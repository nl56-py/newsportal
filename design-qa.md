# Homepage design QA

final result: passed

## Evidence and normalization

- Source visual truth: https://www.sawalnepal.com/ — Chrome DevTools page 2.
- Rendered implementation: http://localhost:3001/ — Chrome DevTools page 3.
- Source and implementation screenshots: inline Chrome DevTools screenshot attachments in this task's conversation. Paired captures were emitted in the same comparison input, not judged from separate remembered views.
- Screenshot filesystem path: unavailable. Chrome DevTools rejected both absolute and relative screenshot destinations because its configured workspace roots did not permit them. No nonexistent screenshot files are claimed here.
- Desktop CSS viewport and capture: 1440 × 1000, deviceScaleFactor 1, 1440 × 1000 image pixels on both sides.
- Mobile CSS viewport and capture: 390 × 844, deviceScaleFactor 1, 390 × 844 image pixels on both sides after the overflow correction.
- No density scaling or device frame was used. Focused sections were aligned to the same viewport region where possible.
- States: homepage at top, scrolled news/category regions, default province, first carousel page, mobile single-column flow, and page-bottom footer. Separate interaction checks exercised expanded panels, drawer, province selection, and final carousel pages.
- Full-view evidence: desktop and mobile scrolling captures from masthead through footer during the implementation; focused pairs covered headlines, main news, province/technology, entertainment/feature, economy/opinion, politics/international, health/strange, religion/video, and footer. Final paired recaptures are labelled `final-desktop-news` and `final-mobile-footer` in the tool output.

The source has a sticky-header jump and a dark date fragment below its sticky menu. The implementation intentionally reserves the navbar's height and does not reproduce that artifact. Source lazy-loading failures and animated advertisement frames make absolute document heights and animation pixels unsuitable for exact pixel-difference scoring.

## Comparison history

1. [P1, resolved] Incorrect Devanagari font subset changed headline width and weight. Replaced the initial legacy font files in active CSS with the actual source Ek Mukta WOFF2 subsets. Paired desktop headlines then reproduced the source wrapping and hierarchy.
2. [P2, resolved] Headline/byline margins accumulated vertical drift. Corrected desktop padding and divider spacing; measured the source mobile headline as 44px/50.16px and matched its block positions. Final paired mobile masthead/headline captures show matching line breaks and banner placement.
3. [P2, resolved] Main-news tracks and variable row heights displaced supporting stories. Matched the lead/sidebar proportions and 120px story rhythm. The final desktop-news pair shows aligned heading, lead height, thumbnail rows, and supporting-list start.
4. [P2, resolved] A broad horizontal-lead image selector enlarged author avatars. Restricted the selector to the lead image. Post-fix economy/interview paired captures show correctly sized bylines.
5. [P2, resolved] An unbroken nonbreaking-space headline expanded the mobile document to 425px at a 390px viewport. Normalized those spaces and added safe heading wrapping. The page now measures 390px at 390px; additional 320/768/1024 checks found no document overflow.
6. [P2, resolved] Trailing list margins increased technology, entertainment, and economy section gaps. Removed last-item margins and adjusted carousel/compact-section spacing. Subsequent politics/health/religion pairs retain the intended dense layout.
7. [P2, resolved] Final partially filled carousel pages could report the wrong active dot. End-of-track detection now marks the final page correctly; tested all four carousels.
8. [P2, resolved] Mobile footer logo was constrained to 300px rather than 320px. Corrected its responsive wrapper; the final-mobile-footer pair aligns logo, social row, red band, and copyright region.

## Required fidelity surfaces

- Fonts/typography: actual source font and icon assets, desktop/mobile headline scale, heading weights, body hierarchy, and principal wrapping checked. Minor browser antialiasing/byline alignment differences remain P3.
- Spacing/layout: all 17 heading regions and source column patterns are present; desktop and mobile composition checked. Lead heights, banner dimensions, list rhythm, carousel tracks, footer bands, and horizontal overflow checked.
- Colors/tokens: red/green navigation, pale section bars, dark feature strip, pale opinion strip, blue video region, red/teal footer, gradient cards, and active states checked against source captures.
- Images/assets: original local logo, advertisements, article imagery, portraits, and source icon font used. No handcrafted replacement logos or invented editorial photos. Some small thumbnail crops differ where CMS/thumbnail variants differ; classified P3, not missing content.
- Copy/content: captured Nepali section labels and editorial placement retained. CMS-resolved headlines may reflect local edits. Date is runtime-generated; existing Nexaform credit intentionally retained.

## Functional checks

- Header search, recent, and popular toggles open and close; news panels contain six/nine stories.
- Drawer opens with close-button focus and body lock, then closes and restores navigation focus.
- All eight province selections set active state and change lead content.
- Carousel last-page state passes for popular, feature, opinion, and video; keyboard handlers and native touch scrolling are implemented.
- Category/economy and Unicode destinations return HTTP 200.
- Keyword search returns results; future date-only search displays the correct empty-result message.
- Homepage uses one H1 and local image URLs; no broken loaded homepage images were observed.
- Browser console check: no errors or warnings in the checked homepage state.
- `node scripts/check-homepage.mjs`: passed.
- `npm.cmd run build`: passed, including type validation and static-page generation.

## Accepted differences and test limits

- P3: small byline/icon alignment, thumbnail crop, and antialiasing differences; not a claim of zero-pixel-difference output.
- Expected: local development indicator; not present in production.
- Expected: animated ads can show different frames at capture time.
- Intentional: stable sticky navigation, manual/non-autoplay carousels, keyboard focus indicators, and preserved Nexaform credit.
- Scope limit: this is not a full WordPress archive migration. Missing local article records retain source links. Third-party article/video/social destinations and all admin workflows were not comprehensively tested.
- Source 404 image slots retain gradient-only appearance. Successful assets are served locally.

## Implementation checklist

- [x] Required fonts, layouts, colors, images, and copy reviewed in paired browser captures.
- [x] Identified P1/P2 issues corrected and relevant states recaptured or re-tested.
- [x] Mobile overflow and footer fidelity corrected.
- [x] Homepage interaction and route smoke checks passed.
- [x] Build and TypeScript validation passed.
- [x] Handoff documents content-migration limits and no deployment.

No actionable P0/P1/P2 homepage findings remain in the reviewed states. P3 refinements and the stated out-of-scope migration work do not block this homepage handoff.
