# Sawal Nepal homepage implementation

## Delivered

The WordPress homepage at https://www.sawalnepal.com/ was inspected with Chrome DevTools MCP and rebuilt in the existing Next.js App Router, React, TypeScript, and Tailwind/CSS project. No WordPress runtime or additional frontend framework was introduced.

The implementation is at `/`. The current development preview is http://localhost:3001/.

## Homepage structure

The masthead reproduces the source logo, Nepali date, advertisement, red navigation, action buttons, desktop trending strip, and mobile menu. Three large headline blocks include author/time rows, the intervening advertisement, and the third story's image and summary.

| Section | Implemented layout |
| --- | --- |
| समाचार | Large image-overlay lead, five thumbnail stories, four supporting stories, and advertising sidebar |
| धेरै पढिएको | Ranked image-overlay carousel |
| देश | Lead, middle image stack, right thumbnail list; national plus seven province datasets |
| सूचना-प्रविधि | Horizontal image/title lead and two supporting lists |
| ताजा समाचार | Thumbnail sidebar alongside technology |
| मनोरञ्जन | Tall overlay lead, middle list, and featured right column |
| फिचर | Full-width charcoal carousel |
| अर्थ | Horizontal lead, supporting lists, and category links |
| अन्तर्वार्ता | Featured interview and supporting story alongside economy |
| विचार/ब्लग | Light-background portrait carousel |
| खेलकुद | Three-column lead, stacked stories, and featured sidebar |
| राजनीति | Lead, four-card grid, and supporting lists |
| अन्तर्राष्ट्रिय | Featured image and four-story list alongside politics |
| स्वास्थ्य | Wide lead with supporting stories and image-led sidebar |
| विचित्र संसार | Three-column lead, image stack, and thumbnail list |
| धर्म सस्कृति | Matching three-column religion/culture section |
| भिडियो | Full-width blue video-story carousel with play icons and linked stories |

The footer reproduces the logo/social row, red band, teal copyright row, and back-to-top control. The project's existing Nexaform credit is retained instead of the source site's Ytech credit.

## Assets and typography

- 135 source image URLs are mapped to local files in `public/reference/`.
- The actual Ek Mukta font subsets are cached locally: 15 WOFF2 files plus the source icon font.
- `data/homepage-reference.json` holds the captured homepage placement and province datasets.
- `data/homepage-assets.json` maps original URLs to local assets.
- `scripts/cache-homepage-assets.mjs` makes the asset collection reproducible. Run only when intentionally refreshing the reference assets.
- Source assets that returned 404 are recorded in `data/homepage-asset-failures.json`; unavailable popular-card images retain the source's gradient-only appearance.

## Behavior

- Sticky navigation and mobile drawer, including Escape dismissal, focus handling, and body scroll locking.
- Search overlay connected to the existing search page; keyword and date-only searches work. Date boundaries use Nepal time.
- Recent and popular panels display six and nine stories respectively.
- Eight province tabs switch the complete section dataset; arrow/Home/End keyboard navigation is supported.
- Carousels support pagination buttons, horizontal scrolling/touch swiping, and arrow keys. They do not auto-advance.
- Story, category, trending, Unicode, social, and back-to-top links/controls have real destinations/actions.
- Homepage-only removal of the unrelated fixed bottom stock advertisement.
- Single-column mobile layouts and two-card tablet carousels; desktop section proportions are retained at larger widths.

## Data integration and scope

`lib/homepage.ts` is a read-only adapter between the captured placement and the existing CMS database. Matching article IDs use local news routes and CMS titles/authors. Existing lead-story selection is respected. Homepage revalidation is set to 60 seconds.

This is a homepage UI implementation, not a complete WordPress content migration. Stories absent from the database still link to their real articles on the original website. Video cards link to their corresponding stories; this task does not add a video-hosting backend. The captured section placement is not a continuous live WordPress feed. Existing category pages and the administration/database/deployment systems were preserved, not redesigned or comprehensively audited.

Ads retain the captured visual artwork; this work does not connect those reference banners to a new ad-management or billing service. Review content/image rights and complete any required article migration before public launch.

## Main files

- `app/page.tsx`: section composition.
- `app/sawal-home.css`: source-specific typography, grids, responsive rules, and panels.
- `components/home/ReferenceSections.tsx`: reusable news layouts, highlights, province tabs, and carousels.
- `components/header/Header.tsx` / `components/footer/Footer.tsx`: shared site chrome.
- `lib/homepage-content.ts` / `lib/homepage.ts`: reference content and CMS resolution.
- `lib/api.ts` / `app/search/page.tsx`: working date filters and date-only search feedback.
- `app/layout.tsx`: homepage fonts/styles and header data wiring.
- `components/ads/BottomAnchorAd.tsx`: homepage exclusion.

## Verification

- Chrome DevTools paired source/implementation screenshots: desktop 1440 × 1000 and mobile 390 × 844, including focused sections and footer.
- No document overflow at 320, 390, 768, or 1024 CSS-pixel viewports.
- No homepage browser console errors or warnings during the checked state.
- All 17 section headings, eight province datasets, and local asset files verified.
- Drawer, header panels, province switches, carousel pagination, category/Unicode routes, keyword search, and future-date empty search verified.
- Production build passes, including TypeScript validation and generation of 38 static pages across the existing app.

Run the repeatable smoke checks against a running preview:

```powershell
node scripts/check-homepage.mjs http://localhost:3001
npm.cmd run build
```

To restart the isolated development preview without interfering with production build output:

```powershell
$env:NEXT_DIST_DIR = '.next-preview'
node node_modules/next/dist/bin/next dev --port 3001
```

Visual findings and accepted differences are recorded in `design-qa.md`. No deployment was performed.
