Product and inventory implementation — September 11, 2026

The seller frontend now uses the existing Axios client for all six required endpoints. Product and inventory state are independent. Create and edit share one validated form, product detail is fetched separately, and requests preserve integer kobo, compatibility arrays and product images.

**Backend findings and implementation decisions**

The supplied [Postman collection](https://documenter.getpostman.com/view/15386056/2sBXwyH7vT) references a backend checkout at `/Users/mac/Desktop/autopart-backend`. Its source was inspected read-only; no backend, buyer or admin code was changed. These findings describe that checkout, not a verified production deployment.

| Question | Evidence and resulting behavior |
| --- | --- |
| Does the product list include inactive items? | Yes, by default. `seller-products.validator.js` defaults status to `all`; `products.repository.js` implements a status predicate. Products now requests `status=active` on the server, so both rows and pagination totals exclude soft-deleted items. There is no frontend inactive-product filter or hidden-ID list. Inventory continues to request all statuses by default. |
| Are duplicate part numbers rejected? | No uniqueness check was found in the local service, and `idx_products_part_number` is a non-unique database index. Create generates category-prefixed Unix-second identifiers. Defensive handling regenerates a number if a future server explicitly reports a part-number collision; edit always preserves the existing number. |
| Does PATCH append or replace photos? | It replaces all photos when a nonempty upload is supplied. With no files, the original set remains unchanged. `updateSellerProduct` and `updateOwnedProduct` implement this; no individual-photo deletion endpoint exists. |
| How are retained photos saved? | When photos change, retained images are downloaded without credentials and uploaded again before new files, as one complete replacement set. A failed download prevents PATCH and explains how to re-upload the original. Unchanged photo sets are not downloaded or uploaded. Saving zero photos is blocked. |
| How is full detail fetched? | The documented `GET /products/:id` returns description, photos and compatibility for active products. The existing client attaches its bearer token. The frontend checks ownership when seller-profile information is available; PATCH/DELETE enforce ownership on the server. Inactive inventory rows remain visible without links to this active-only detail endpoint. |
| Upload rules | One to six JPEG, PNG or WebP photos, maximum 2 MiB each. CSV maximum 2 MiB. These limits come from the backend upload middleware. |
| Bulk failure behavior | The local backend validates CSV rows before insertion and writes the batch in one transaction. Validation failures return 422 with a message, often identifying the CSV row. There is no documented partial-success response. The UI displays the actual message, reports `createdCount` on success, and refreshes inventory after either outcome to account for uncertain transport failures. |
| CSV template | No template endpoint exists in the local router. A header-only downloadable template was derived from the existing backend `inventory.csv`, preserving its exact column names. |
| Conditions | New listings offer `new` and `used`, as requested. Existing uppercase `OEM` values are preserved on edit because the local backend accepts them. |
| Validation messages | The backend's Joi middleware currently combines quoted field paths into `error.message`. The client preserves structured errors when supplied and maps those quoted paths to form fields when the message is the only available detail. |

Relevant backend evidence: `src/services/products.service.js`, `src/repositories/products.repository.js`, `src/routes/seller-products.routes.js`, `src/routes/products.routes.js`, `src/routes/seller-inventory.routes.js`, `src/validators/seller-products.validator.js`, `src/validators/seller-inventory.validator.js`, `src/middleware/upload.middleware.js`, `src/middleware/validate.middleware.js`, and `src/db/migrations/005_create_products_table.sql` in that checkout.

**What was rewritten and why**

The previous product slice collapsed list and detail data into one lossy UI shape and shared loading, error and pagination fields with inventory. It was rewritten while keeping Redux Toolkit and the established thunk pattern. Requests now unwrap success envelopes in the service layer, preserve structured failures and ignore stale fetch responses.

The previous create/edit pages duplicated form logic, omitted description inputs, used editable millisecond-based part numbers, restricted compatibility to hardcoded vehicle presets and removed image previews without changing the backend. They are now small page wrappers around the shared form.

Products was rewritten as a server-paginated table with required states and actions. The former detail screen contained fabricated reviews, descriptions, compatibility, gallery images and stock values; the replacement renders actual product detail. Inventory was rebuilt around server summaries, status/low-stock queries and CSV upload.

The Axios module was simplified while retaining the same client and token mechanism. It still returns response bodies to existing consumers, while product services unwrap their inner `data`. The browser supplies multipart boundaries. Failure metadata is preserved, and failure envelopes are rejected even when delivered with HTTP 200.

**Files changed**

| File | Change |
| --- | --- |
| `src/main.jsx` | Load catalog styles. |
| `src/config/constant.js` | Keep the backend URL in one place, expose its origin, fix money conversion, add decimal-safe naira-to-kobo conversion and preserve decimal display. |
| `src/config/categories.js` | Add slugs, documented Radiators category, exported prefix mapping and Unix-second part numbers. |
| `src/features/productSlice.js` | Rewrite product/inventory requests and state, including independent fetch/mutation states and stale-response protection. |
| `src/features/dashboardSlice.js` | Resolve featured-product images through the shared helper and use its placeholder. |
| `src/utils/axios.js` | Preserve authentication behavior, normalize rich errors and handle multipart boundaries. |
| `src/pages/Dashboard.jsx` | Adapt product fallback data to the separate list shape; use shared images and money formatting. |
| `src/pages/Inventory.jsx` | Rewrite summary/filter/table/pagination/upload composition. |
| `src/pages/products/Products.jsx` | Rewrite pagination, states, named deletion dialog, removal feedback and refetch. |
| `src/pages/products/ProductDetail.jsx` | Rewrite using separately fetched full product details and real photos. |
| `src/pages/products/AddProduct.jsx` | Shared-form create wrapper. |
| `src/pages/products/EditProduct.jsx` | Detail-fetching shared-form edit wrapper. |
| `package.json` | Approved testing dependencies, PropTypes and test scripts. |
| `package-lock.json` | Lock dependency resolution. |
| `vite.config.js` | Reuse the existing centralized backend URL for proxy targets. |
| `eslint.config.js` | Recognize JSX component references without suppressing unused-import checks or adding dependencies. |

**Files created**

| File | Purpose |
| --- | --- |
| `src/types/products.js` | Separate PropTypes for list items, detail, inventory, summaries, pagination, bulk results and envelopes/errors. |
| `src/services/products.js` | Six endpoint functions, detail retrieval, FormData serialization and retained-photo preparation. |
| `src/utils/productValidation.js` | API-aligned form, photo and CSV validation. |
| `src/utils/apiError.js` | Normalize and serialize API failures and field errors. |
| `src/utils/productImages.js` | Resolve relative and absolute product images and missing values. |
| `src/styles/catalog.css` | Product/inventory layouts, responsive forms, tables, skeletons, dialogs and image states. |
| `src/components/products/ProductForm.jsx` | Shared create/edit form, compatibility rows, part numbers, uploads and field errors. |
| `src/components/products/ProductImage.jsx` | Image loading/failure states and temporary-file previews with URL cleanup. |
| `src/components/products/CatalogState.jsx` | Reusable errors, loading rows and server pagination controls. |
| `src/components/products/BulkUpload.jsx` | CSV selection, validation, upload progress and results. |
| `public/product-placeholder.svg` | Local product-image placeholder. |
| `public/inventory-template.csv` | CSV template derived from the backend sample header. |
| `vitest.config.js` | Vitest/JSDOM configuration. |
| `tests/setup.js` | RTL cleanup, MSW lifecycle, isolated storage and compatible multipart binary types. |
| `tests/render.jsx` | Isolated Redux/router rendering helper. |
| `tests/mocks/server.js` | Mock API handlers; unhandled test requests fail. |
| `tests/mocks/fixtures.js` | Distinct reduced-list, full-detail, inventory and form fixtures. |
| `PRODUCT_INVENTORY_IMPLEMENTATION.md` | This change report and remaining verification limits. |

**Tests added**

All test network requests are mocked. Browser checks also use an isolated profile with intercepted API responses and a fake token.

| Test file | Cases and coverage |
| --- | --- |
| `tests/config/constant.test.js` | 16: zero, small, fractional and large kobo round trips; exact decimal input; currency formatting; malformed/overflowing input; non-integer kobo rejection. |
| `tests/config/categories.test.js` | 5: radiator, brake, filter, suspension and unknown-category prefixes with Unix seconds. |
| `tests/utils/productImages.test.js` | 9: relative paths with/without slash, HTTP/HTTPS URLs, null/undefined/empty/whitespace values, stable placeholder resolution. |
| `tests/utils/apiError.test.js` | 3: message/code/status/field preservation, safe fallback text, actual Joi field-path mapping. |
| `tests/services/products.test.js` | 13: active-list pagination/auth; full detail; POST/PATCH multipart headers, body, kobo, string compatibility and repeated photos; DELETE; all inventory query fields; CSV file field; credential-free retained-image uploads; failed image retention; unchanged photos; HTTP 200/422 failures; CSV row errors. |
| `tests/features/productSlice.test.js` | 2: late responses cannot overwrite the newest page; inventory and products keep independent pagination. |
| `tests/components/products/ProductForm.test.jsx` | 11: automatic disabled part number/category regeneration; complete edit prefill and photo ordering; invalid-submit blocking; correct FormData; compatibility validation/add/remove; unchanged fields including zero values; existing OEM condition; field errors; in-flight disabling; type/size validation and preview cleanup; preventing removal of all photos. |
| `tests/components/products/ProductImage.test.jsx` | 1: loading, successful load, source change and failed-image placeholder. |
| `tests/pages/products/Products.test.jsx` | 6: loading/populated, empty, retryable error, named delete confirmation/removal/refetch, cancellation/failure retaining the row, server page changes. Deletion waits for success, so no optimistic rollback is necessary. |
| `tests/pages/products/EditProduct.test.jsx` | 2: full prefill on direct navigation with only a reduced list cached; errors prevent rendering an editable form. |
| `tests/pages/products/ProductDetail.test.jsx` | 1: direct navigation, real compatibility/gallery and preserved zero price/stock. |
| `tests/pages/Inventory.test.jsx` | 8: summary values and authoritative low-stock/out-of-stock flags, server filters/page reset, visible inactive rows, non-CSV rejection, upload progress/count/refetch/template, actual CSV failure messages, loading/error/empty/retry states. |

Final results: **77 tests passed across 12 files**, the production build passed, and lint passed for all changed/new implementation and test files. An isolated Chrome check exercised product loading, edit prefill and save, named deletion and list refetch, and inventory display across desktop and mobile: 17 mocked API requests, no JavaScript exceptions, and no document-level horizontal overflow. The mobile screenshot was recaptured with transitions disabled to avoid capturing the existing sidebar animation mid-transition.

Run `npm test` for all tests, `npm run test:watch` during development, and `npm run build` for production compilation.

**Verification limits**

- Live end-to-end acceptance remains unverified. Login with the development account documented in the project returned HTTP 403: “This account has been suspended.” An active seller account is needed to verify all six production endpoints and confirm the deployed backend matches the local checkout.
- Retaining images during replacement requires browser-readable image URLs. CORS restrictions or missing files produce a visible error and prevent the update; the seller can remove the inaccessible image and upload its original again.
- Category choices retain the existing static catalog with the documented Radiators entry. The backend still validates category availability and vehicle compatibility.
- Whole-repository ESLint reports 37 existing errors in untouched files. The changed/new implementation and test files pass lint. The original count was 357; most were false positives for JSX component references, now corrected by configuration.
- The production build retains the existing large-bundle warning. Dependency installation reported 13 advisories; no unrelated dependency upgrades or automated breaking fixes were performed.
- This workspace has no `.git` directory, so no commit was created. A pre-change source archive and browser screenshots were kept under `/tmp` during verification.
