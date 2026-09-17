# Seller Orders milestone

Implemented on 11 September 2026. Automated and isolated browser verification are complete; live API verification remains pending.

## API contract and existing conventions

The [Postman collection](https://documenter.getpostman.com/view/15386056/2sBXwyH7vT) contains three requests under **sellers → orders**:

| Request | Integration |
| --- | --- |
| `GET /seller/orders` | Lists seller orders and unwraps `data` in the service layer. |
| `GET /seller/orders?itemStatus=pending&page=1&limit=10` | Status, page and page size are sent to the server; the all-statuses option omits `itemStatus`. |
| `PATCH /seller/orders/:id/status` | Sends JSON `{ "itemStatus": "ready_for_pickup" }` or `{ "itemStatus": "cancelled" }`. The ID is the order-item ID, not the parent order ID. |

The user confirmed `ready_for_pickup` is correct. The implementation uses the existing labels and colors from `src/config/constant.js`; it never translates this milestone into “Shipped.”

The existing `src/utils/axios.js` client is reused. `API_URL` comes from `src/config/constant.js`: development uses `/api` through the existing proxy and production uses the existing configured backend URL. Its request interceptor attaches the seller token from `localStorage`; its response interceptor normalizes errors and rejects failure envelopes. There is no retry/token-refresh mechanism; unauthorized requests clear the session and redirect to login. No client, base URL or auth mechanism was added.

The implementation follows the existing Redux Toolkit thunk/slice and controlled React state conventions, reuses the money and product image helpers, adds PropTypes for order shapes, and uses the installed Vitest + React Testing Library + MSW setup. No dependencies were added.

The local backend was inspected read-only at `/Users/mac/Desktop/autopart-backend`. Its seller validator and order service accept item filters `pending`, `ready_for_pickup`, `picked_up`, `delivered`, and `cancelled`. `confirmed` describes a parent order, so it is not offered as an item filter. The service allows a paid, pending item on a non-cancelled/non-delivered order to become ready for pickup or cancelled. Other transitions are handled outside this seller UI. These findings describe the local checkout; deployed behavior has not been independently verified.

## UI behavior

- The existing Orders navigation opens the rebuilt list. Items are grouped under real parent order IDs, with product photos, part numbers, quantities, exact naira amounts and individual status badges.
- Pagination counts parent orders, matching the API. Filters and page size change requests. URL query parameters preserve list navigation, and a page emptied by an update is corrected to an available page.
- The total-order card uses server pagination totals. Item-status cards explicitly describe the current page. Search and CSV export also explicitly apply to the current page.
- Manage item opens the parent order with all seller items. Detail shows actual payment fields and the documented delivery `street`, city, state and phone; it does not infer refunds/payment or invent customer information, shipping fees, tracking, or milestone timestamps.
- Each eligible item offers **Mark as Ready for Pickup** and **Cancel item**. Cancellation requires a dialog naming the product. Requests disable actions while pending. Status updates use the item's actual ID, update the list/detail state, and refetch the current list query. Failures retain the existing status and display the API message.
- Loading, empty, missing-detail and retryable error states are present. Product images reuse the existing loading/fallback component. The layouts were inspected at desktop and mobile widths.
- There is no documented seller order-detail endpoint. Direct detail links therefore search the authenticated, unfiltered seller list in pages of 50. Cached unfiltered orders can be reused; filtered list data is never treated as complete detail. Existing `ORD-000007` links still resolve by item ID. A dedicated backend detail endpoint would reduce requests for large accounts.

## Files created, changed or rewritten

| File | Change and reason |
| --- | --- |
| `src/features/orderSlice.js` | Rewritten. The previous slice flattened items into synthetic order IDs, called Axios directly, mapped pickup readiness to shipping, rounded away kobo, and shared list/update loading state. It now stores the API order groups, separates detail and mutation state, and ignores stale list responses. |
| `src/pages/orders/Orders.jsx` | Rewritten. The previous filter button and edit/delete buttons were inert, pagination was local, summary counts were misleading, and loading/error states were missing. The replacement implements server filters/pagination and usable item management links. |
| `src/pages/orders/OrderDetail.jsx` | Rewritten. The previous page required an already-loaded list, inferred payment from fulfilment, ignored the documented street field, offered invalid actions, and hid mutation errors. The replacement loads on direct navigation, shows all seller items, and uses actual payment/delivery fields. |
| `src/services/orders.js` | Created. List, complete-detail lookup, and item-status update services using the existing Axios client and envelope unwrapping. |
| `src/types/orders.js` | Created. PropTypes for seller orders, items, addresses, paginated responses, and update results. |
| `src/utils/orders.js` | Created. Supported item filters, seller-action rules, localized dates, address formatting, and safe CSV cells. |
| `src/components/orders/OrderStatusBadge.jsx` | Created. Shared canonical item-status display using existing label/color constants. |
| `src/components/orders/OrderLoading.jsx` | Created. Accessible order list/detail loading skeletons. |
| `src/components/orders/OrderItemActions.jsx` | Created. Shared per-item pickup/cancel actions, confirmation dialog, progress, errors, success feedback and list refresh. |
| `src/styles/orders.css` | Created. Scoped responsive list/detail styling. Summary class naming avoids an existing global CSS collision. |
| `tests/mocks/orders.js` | Created. Synthetic orders, items, pagination and update fixtures matching the Postman response shapes. |
| `tests/mocks/server.js` | Updated. Mock GET/PATCH handlers for seller orders. Unhandled test requests still fail. |
| `tests/render.jsx` | Updated. Adds the order reducer and optional preloaded order state to the shared test renderer. |
| `tests/services/orders.test.js` | Created. 11 tests: authenticated default listing, canonical filter/pagination, JSON updates for both actions using item IDs, error envelopes for HTTP 200/409/422, multi-page detail lookup, legacy links, missing and invalid IDs. |
| `tests/features/orderSlice.test.js` | Created. 6 tests: stale page protection, complete detail from a filtered list, item-specific updates/payment preservation, failures retaining state, duplicate mutation protection, and preventing older lists from reverting an update. |
| `tests/pages/orders/Orders.test.jsx` | Created. 6 tests: loading/populated grouped rows and images/money/status, empty state, error/retry, server filters/page-size/pagination, linked filter restoration, and current-page search/export. |
| `tests/pages/orders/OrderDetail.test.jsx` | Created. 13 tests: direct detail loading, pickup payload/progress/refetch, named cancellation and sibling preservation, API-error retry, seven invalid-action scenarios, filtered list-to-detail-to-update-to-list flow, and missing/error states. |
| `tests/utils/orders.test.js` | Created. 3 tests: localized dates and street address, action eligibility, and CSV quoting/formula protection. |
| `ORDERS_MILESTONE.md` | Created. This implementation and verification report. |

Production build artifacts under `dist/` were regenerated by Vite. No buyer/admin code, product form, dependencies, base URL or HTTP client was changed. The workspace has no `.git` directory; the previous order files and test renderer were backed up to `/tmp/autoparts-before-orders-milestone.zip`.

## Verification results and limits

- **39 new Orders tests passed across five files.** Every test request is mocked.
- Full `npm test`: **115 passed, 1 failed (116 total)**. The remaining failure is the existing ProductForm OEM-preservation test at `tests/components/products/ProductForm.test.jsx:84`. The unchanged form excludes uppercase `OEM` from its fallback option but renders a lowercase `oem` option, so an uppercase existing value displays as `new`. The same test fails when run alone. This product-form issue was not changed as part of the Orders milestone.
- Production build passed; Vite retains its existing large-bundle warning.
- ESLint passed for all added/changed implementation and test files. Whole-repository lint reports **32 errors in untouched files**, primarily unused variables/imports.
- An isolated Chrome profile exercised list pagination, canonical status filtering, complete detail loading, pickup update, hard reload persistence and desktop/mobile rendering. All API and remote image traffic was intercepted; no live orders were changed. The final run made **12 mocked API requests**, recorded **zero JavaScript exceptions**, and measured **390px document width at a 390px viewport** for both list and detail.
- Browser evidence: `/tmp/autoparts-orders-browser-result.json`, `/tmp/autoparts-orders-desktop.png`, `/tmp/autoparts-order-detail-desktop.png`, `/tmp/autoparts-orders-mobile.png`, and `/tmp/autoparts-order-detail-mobile.png`. The isolated check script is `/tmp/autoparts-orders-browser-check.mjs`.
- **Live acceptance remains pending.** No approved dedicated test seller session/order item was supplied during this milestone. Marking an item ready can create a courier job, so the live mutation was not performed against an arbitrary order. The earlier product implementation report also records that its development account was suspended; that account was not reused here.

To rerun the milestone tests:

```sh
npm test -- tests/services/orders.test.js tests/features/orderSlice.test.js tests/pages/orders tests/utils/orders.test.js
```
