CONTEXT
Frontend for the AutoParts marketplace — seller dashboard. The product and
inventory screens are partly built, but the API integration is incomplete and
the existing code quality is inconsistent.

Task: verify what already exists, wire all six endpoints correctly, rebuild any
UI that is missing or substandard, and add tests.

--------------------------------------------------------------------
BEFORE CHANGING ANYTHING
--------------------------------------------------------------------
Read and report back on:

- How the API base URL is configured. It is ALREADY implemented somewhere —
  find it (env var, axios instance, config file, api client wrapper). Do NOT
  hardcode a new one or create a second client.
- The existing HTTP client: interceptors, how the auth token is attached, how
  errors are normalised, whether there is a retry or refresh mechanism.
- Every existing seller product / inventory component, hook, service and type.
  List them with a one-line assessment of whether each is usable as-is, needs
  fixing, or should be rewritten.
- State management in use (React Query / SWR / Redux / plain useState) and the
  established pattern for server state.
- The test setup: framework, config, existing test locations, any MSW or mock
  server already present.
- Form handling convention (react-hook-form, Formik, uncontrolled) and the
  validation library.

Then answer these three questions explicitly. Do not build around them:

1. Does GET /seller/products return products whose status is "inactive"?
2. Does the API reject duplicate part numbers?
3. On PATCH, are newly uploaded photos APPENDED to the existing photos array,
   or do they REPLACE it? Is there any endpoint to delete an individual photo?

Report your findings and your plan. WAIT for my approval before writing code.

--------------------------------------------------------------------
SHARED CONVENTIONS — apply to all six endpoints
--------------------------------------------------------------------

AUTH
  Every endpoint requires the seller bearer token. Use the existing token
  mechanism; do not invent a new one.

RESPONSE ENVELOPE
  Success: { success: true, data: <payload>, message: string }
  Failure: { success: false, error: { code: string, message: string } }
  Unwrap `data` in the service layer. Components never touch the envelope.
  Surface error.message to the user; never render a raw error object.

MONEY — the most common bug in this codebase, get it right
  The API sends and expects `priceKobo` as an INTEGER in kobo.
  8500000 kobo = ₦85,000.
  - Display: divide by 100, format as NGN with thousand separators.
  - Input: the seller types naira; multiply by 100 before sending.
  - Never send a float. Never send a formatted string.
  Write ONE pair of helpers (koboToNaira / nairaToKobo) and use them everywhere.

IMAGE URLS — the second most common bug
  `primaryImageUrl` and `photos[].url` are returned as RELATIVE paths:
      "uploads/product-images/product-image-...png"
  But the bulk-upload endpoint can return ABSOLUTE URLs:
      "https://example.com/disc-1.png"
  Write one helper that returns the value unchanged if it already starts with
  http:// or https://, and otherwise prefixes the API origin. Handle a missing
  or null value with a placeholder image. Use this helper for every product
  image in the dashboard.

DATES
  ISO 8601 UTC strings. Format for display in the user's locale; never render
  the raw string.

--------------------------------------------------------------------
PART NUMBER — auto-generated, read-only
--------------------------------------------------------------------
The seller does not type a part number. The frontend generates it.

  Format:  <CATEGORY_PREFIX>-<UNIX_TIMESTAMP_SECONDS>
  Example: RAD-1789105240

CATEGORY_PREFIX is derived from the selected category: take the category slug,
strip non-alphanumerics, uppercase it, truncate to 3–6 characters.
  radiators           -> RAD
  brake-system        -> BRAKE
  filters             -> FILTER
  suspension-steering -> SUSP

Put the mapping in ONE exported constant/function so it can be corrected in a
single place. If a category has no mapping, fall back to the first 4 characters
of the slug, uppercased.

Behaviour:
- The input is rendered but DISABLED, showing the generated value so the seller
  can see and copy it.
- Generate on mount in create mode, and REGENERATE whenever the seller changes
  the category — the prefix must match the selected category.
- Helper line under the field: "Generated automatically from the selected
  category."
- On EDIT, the field stays disabled and shows the product's EXISTING part
  number unchanged. Never regenerate on edit.
- The generated value is still sent in the request body.
- If the API rejects duplicate part numbers, handle that error explicitly and
  regenerate rather than surfacing a raw validation error.

--------------------------------------------------------------------
ENDPOINTS
--------------------------------------------------------------------

1. CREATE PRODUCT
   POST /seller/products
   Body: multipart/form-data
   Fields:
     title           string, required
     description     string, required
     categoryId      integer, required
     partNumber      string, auto-generated (see above)
     condition       "new" | "used"
     priceKobo       integer (kobo)
     stockQty        integer
     location        string
     compatibility   JSON STRING of an array — send as a string, not an object:
                     '[{"make":"Mazda","model":"CX-5 Signature","yearFrom":2018,"yearTo":2021}]'
     photos          one or more image files, field name repeated per file
   Returns the full product object (shape below).

2. LIST PRODUCTS
   GET /seller/products
   Returns { products: [...], pagination: { page, limit, total, totalPages } }
   List rows are a REDUCED shape — no description, no photos[], no
   compatibility[]. Type it separately from the detail shape; do not assume the
   list returns everything.

3. UPDATE PRODUCT
   PATCH /seller/products/:id
   Body: multipart/form-data, same fields as create.
   Returns the full product:
     { id, title, description, category:{id,name,slug}, partNumber, condition,
       priceKobo, stockQty, location, seller:{id,businessName,rating},
       primaryImageUrl, photos:[{id,url,position}],
       compatibility:[{id,make,model,yearFrom,yearTo}],
       status, createdAt, updatedAt }

4. DELETE PRODUCT
   DELETE /seller/products/:id
   Returns the product with status "inactive" — the API performs a SOFT delete.
   Required UI behaviour is a full removal (see UI section).

5. GET INVENTORY
   GET /seller/inventory?status=all&lowStockOnly=false&page=1&limit=10
   Query params: status, lowStockOnly (boolean), page, limit.
   Returns { inventory: [...], summary: {...}, pagination: {...} }
   Each row adds: lowStockThreshold, isLowStock, isOutOfStock.
   summary: totalListings, activeListings, inactiveListings,
            outOfStockListings, lowStockListings, totalUnitsInStock,
            lowStockThreshold.
   Render the summary as stat cards above the table. Use isLowStock and
   isOutOfStock for badges — do NOT recompute them client-side from stockQty.

6. BULK UPLOAD
   POST /seller/inventory/bulk
   Body: multipart/form-data, field `file` (CSV).
   Returns { createdCount, lowStockThreshold, products: [...] }
   After success, show how many were created and refresh the inventory list.
   Handle partial-failure and malformed-CSV responses gracefully — report what
   the API actually returns in those cases rather than assuming.

--------------------------------------------------------------------
UI REQUIREMENTS
--------------------------------------------------------------------
For each screen: verify what exists, fix what is broken, build what is missing.
Where existing code is poor, rewrite it rather than patching around it — but
tell me which files you rewrote and why.

PRODUCTS LIST
- Paginated table or card grid: thumbnail, title, part number, category, price
  in naira, stock, status badge.
- Empty state, loading skeleton, error state with retry.
- Row actions: edit, delete.

CREATE / EDIT FORM
- ONE shared form component for both modes.
- Client-side validation before submit, matching the API's rules.
- Part number field disabled and auto-generated per the rules above.
- Compatibility is a repeatable sub-form: add/remove rows of
  make / model / yearFrom / yearTo. Validate yearFrom <= yearTo. Serialise to a
  JSON string only at submit time.
- Photo upload with preview, file-type and size validation, remove-before-
  submit, and multiple files.
- Disable submit while in flight. Show field-level errors returned by the API.

EDIT MODE — fully pre-filled, including images
- Opening the edit form must pre-populate EVERY field from the product being
  edited: title, description, categoryId, condition, priceKobo (shown in
  naira), stockQty, location, part number (disabled), and every compatibility
  row.
- Render each existing photo from photos[] as a thumbnail, in position order,
  using the image URL helper.
- Each existing photo has a remove control, so the seller can retain or replace
  images.
- The seller can add new files alongside the retained ones.
- Make the behaviour explicit in the UI: state clearly whether the seller is
  adding to or replacing the existing set, based on what the API actually does.
- If the API only APPENDS and offers no way to delete an individual photo, say
  so and do NOT build a remove control that silently does nothing. Tell me and
  I will decide.
- Show a loading state on thumbnails and a placeholder for any image that fails
  to load.
- The form must not submit unchanged fields as empty. Send the current value of
  every field, pre-filled or edited.

DELETE — remove the row from the UI entirely
- Confirmation dialog naming the product before the call is made.
- On success, remove the product from the list immediately. Do not show it as
  inactive and do not leave it in place.
- Optimistic removal is acceptable, with rollback and an error toast on failure.
- After success, invalidate/refetch the products list so pagination totals stay
  correct.
- Success message: "Product removed."
- IMPORTANT: the API soft-deletes. If GET /seller/products still returns
  inactive products, the row will reappear on the next fetch and hiding it
  client-side is not sufficient. Report this to me BEFORE building around it —
  the fix belongs in the backend, not in a frontend filter. Note also that
  GET /seller/inventory DOES return inactive products, so a deleted item will
  still appear there.

INVENTORY
- Summary stat cards from `summary`.
- Filters for status and lowStockOnly that drive the query params.
- Low-stock and out-of-stock badges from the API flags.
- Bulk upload: drag-and-drop or file picker, CSV only, progress state, result
  summary, and a downloadable CSV template if one exists — ask me if there is
  no template endpoint.

--------------------------------------------------------------------
TESTING
--------------------------------------------------------------------
Create a top-level `tests/` folder mirroring the source structure.
Use the framework already configured in the project. If none is configured,
propose Vitest + React Testing Library + MSW and wait for my approval before
adding dependencies.

Write tests for:
- koboToNaira / nairaToKobo round-trip, including zero and large values.
- The image URL helper: relative path, absolute URL, null, empty string.
- Part number generation: correct prefix per category, regenerates on category
  change, does NOT regenerate in edit mode, field is disabled.
- Each service function: correct method, URL, headers and body shape. Assert
  that compatibility is sent as a STRING and that photos are appended as
  repeated form fields.
- Products list: loading, empty, populated, error states.
- Create form: validation blocks submit, valid submit calls the service with
  the correct FormData, API field errors are displayed.
- Edit form: pre-populates every field from an existing product, including
  compatibility rows and existing photo thumbnails.
- Delete: confirmation required, row removed from the list on success,
  rollback on failure.
- Inventory: summary cards render from `summary`, filters update the query,
  low-stock badge follows the API flag and not a client calculation.
- Bulk upload: rejects non-CSV, shows createdCount, refreshes the list.

Mock all network calls. Do not hit the live API in tests.

--------------------------------------------------------------------
CONSTRAINTS
--------------------------------------------------------------------
- Use the EXISTING base URL configuration and HTTP client. Do not create a
  second one.
- Follow the project's existing state-management and form conventions.
- TypeScript types (or PropTypes, matching the project) for every API shape.
  Separate the list shape from the detail shape.
- No new dependencies without asking.
- Do not modify buyer-facing or admin code.
- No console.log left in committed code.

--------------------------------------------------------------------
ACCEPTANCE
--------------------------------------------------------------------
- All six endpoints work end to end against the live API.
- Prices display in naira and submit in kobo, verified by a round-trip test.
- Product images load — both relative and absolute URL forms.
- Part numbers auto-generate with the correct category prefix, are read-only,
  and are preserved unchanged on edit.
- The edit form pre-fills every field and shows existing images.
- Deleting a product removes it from the list and it does not reappear on
  refetch.
- Compatibility rows can be added, edited and removed, and survive a round trip
  through create and update.
- Inventory filters and pagination change the request, not just the view.
- Every test passes.
- Loading, empty and error states exist on every screen.

When done, list every file created, changed or rewritten, which existing code
you judged substandard and why, every test added, and anything you could not
complete or had to assume.