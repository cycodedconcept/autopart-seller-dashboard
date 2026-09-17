Dashboard icons and chart styling — 12 September 2026

The dashboard now renders real package, cart, customer and currency SVG icons in small outlined tiles. Revenue uses orange diagonal stripes, a solid highlighted bar, circular markers, dotted horizontal grid lines and a compact amount/month tooltip, following the supplied screenshot. Stock bars and their legend use the screenshot's orange/yellow/green palette, with proportions based on the API counts.

The earlier real-percentage calculation and comparison text below each card value are preserved. No screenshot amounts were added to application data. The chart remains bound to monthly API totals; its tooltip uses the actual month and year rather than inventing a daily timestamp. The previous Weekly/Daily selectors had no handlers or supporting data, so they were replaced by a Monthly label on revenue and removed from the current-stock summary.

| File | Change |
| --- | --- |
| `src/pages/Dashboard.jsx` | Resolve card keys to Lucide components rather than rendering icon-name strings; use the extracted revenue chart, responsive layout and stock graphic. |
| `src/components/StatCard.jsx` | Add a dashboard variant with compact spacing, rounded square icon tiles and smaller titles. |
| `src/components/dashboard/RevenueChart.jsx` | Created the chart component with striped SVG bars, highlighted hover state, markers, grid, real-data tooltips and an empty state. |
| `src/styles/dashboard.css` | Created scoped dashboard/card/chart/stock styles, with horizontal chart scrolling inside the card on narrow screens. |
| `src/features/dashboardSlice.js` | Retain the response year for tooltips and highlight the current month only when the response year also matches. |
| `tests/features/dashboardSlice.test.js` | Add two cases covering monthly kobo amounts/tooltip labels and avoiding current-month highlighting for historical years. |
| `DASHBOARD_VISUAL_UPDATE.md` | Created this change report. |

The inline revenue chart was replaced because its stripes, missing markers/grid, tooltip and fixed column layout did not match the reference. Other files received targeted changes. No dependencies, HTTP clients or endpoints were added.

Validation: 196 tests pass across 24 files. The production build and scoped ESLint pass. An isolated Chrome run with mocked API responses verified all four SVG icons, 12 markers, horizontal grid lines, the July amount/year tooltip, empty revenue and zero-stock rendering. Desktop (1440 px) and mobile (390 px) had no document-level horizontal overflow, with no JavaScript or console errors. Screenshots were inspected visually.

The screenshot's sample values were used only in the temporary browser fixture. Browser artifacts are in `/private/tmp/dashboard-browser-TmVkae/`, including `dashboard-detail.png`, `dashboard-mobile.png` and `result.json`. The temporary check script is `/private/tmp/dashboard-browser-check.mjs`.
