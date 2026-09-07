import assert from 'node:assert/strict';

const baseUrl = process.argv[2] || 'http://localhost:3005';
console.log(`Starting Admin-to-Homepage Integration Test against ${baseUrl}...`);

// 1. Fetch current homepage
const resInitial = await fetch(baseUrl);
assert.equal(resInitial.status, 200, 'Homepage must return 200 OK');
const htmlInitial = await resInitial.text();

// 2. Submit a Lead Article via Admin API
const timestamp = Date.now();
const testArticleTitle = `विशेष प्रविधि समाचार परीक्षण ${timestamp}`;
const postArtRes = await fetch(`${baseUrl}/api/admin/articles`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: testArticleTitle,
    subtitle: 'उपशीर्षक परीक्षण',
    summary: 'यो नयाँ प्रविधि समाचार एडमिन प्यानलबाट होमपेजमा देखिएको परीक्षण हो।',
    content: ['पहिलो अनुच्छेद परीक्षण।', 'दोस्रो अनुच्छेद परीक्षण।'],
    category: 'prawidhi',
    categoryName: 'प्रविधि',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    imageCaption: 'कभर क्याप्सन',
    imagePhotographer: 'सम्पादक',
    tags: 'प्रविधि, एआई, ताजा',
    isLeadStory: true,
    isSubLead: false,
    isBreaking: false,
    isTrending: true,
  }),
});
const postArtData = await postArtRes.json();
assert.ok(postArtData.success, 'Article submission must succeed');
const createdArticleId = postArtData.article.id;
console.log(`✓ Article created successfully (ID: ${createdArticleId})`);

// 3. Submit a Breaking News Flash via Admin API
const testBreakingHeadline = `तत्काल ब्रेकिङ फ्ल्यास हेडलाइन ${timestamp}`;
const postBrkRes = await fetch(`${baseUrl}/api/admin/breaking`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    headline: testBreakingHeadline,
    linkUrl: `/news/${postArtData.article.slug}`,
  }),
});
const postBrkData = await postBrkRes.json();
assert.ok(postBrkData.success, 'Breaking news submission must succeed');
const createdBreakingId = postBrkData.item.id;
console.log(`✓ Breaking news created successfully (ID: ${createdBreakingId})`);

// 4. Submit a Video Story via Admin API
const testVideoTitle = `विशेष भिडियो प्रस्तुति ${timestamp}`;
const postVidRes = await fetch(`${baseUrl}/api/admin/videos`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: testVideoTitle,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    duration: '०४:१५',
    categoryName: 'भिडियो',
  }),
});
const postVidData = await postVidRes.json();
assert.ok(postVidData.success, 'Video submission must succeed');
const createdVideoId = postVidData.video.id;
console.log(`✓ Video story created successfully (ID: ${createdVideoId})`);

// 5. Update Homepage Ad via Admin API
const testAdTitle = `प्रायोजित विज्ञापन परीक्षण ${timestamp}`;
const putAdRes = await fetch(`${baseUrl}/api/admin/ads`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    position: 'Homepage_Mid_Banner',
    currentAd: {
      id: `ad-${timestamp}`,
      title: testAdTitle,
      type: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      redirectUrl: 'https://sawalnepal.com',
      advertiser: 'Sawal Nepal Partner',
      active: true,
    },
  }),
});
const putAdData = await putAdRes.json();
assert.ok(putAdData.success, 'Ad slot update must succeed');
console.log(`✓ Ad slot updated successfully`);

// 6. Fetch Homepage and verify immediate presence of all newly submitted content
const resUpdated = await fetch(baseUrl, { cache: 'no-store' });
assert.equal(resUpdated.status, 200, 'Homepage must return 200 OK');
const htmlUpdated = await resUpdated.text();

assert.ok(htmlUpdated.includes(testArticleTitle), 'Newly created lead article must appear on the homepage');
assert.ok(htmlUpdated.includes(testBreakingHeadline), 'Newly created breaking news headline must appear in the header ticker');
assert.ok(htmlUpdated.includes(testVideoTitle), 'Newly created video title must appear in the video carousel');
assert.ok(htmlUpdated.includes(testAdTitle) || htmlUpdated.includes('photo-1557804506-669a67965ba0'), 'Updated ad banner must appear on the homepage');

console.log(`✓ Homepage verification confirmed:
  - Lead Article rendered: YES ("${testArticleTitle}")
  - Breaking News in Header ticker: YES ("${testBreakingHeadline}")
  - Video in Video Carousel: YES ("${testVideoTitle}")
  - Updated Ad banner: YES ("${testAdTitle}")
`);

// 7. Cleanup test items so DB stays clean
await fetch(`${baseUrl}/api/admin/articles?id=${createdArticleId}`, { method: 'DELETE' });
await fetch(`${baseUrl}/api/admin/breaking?id=${createdBreakingId}`, { method: 'DELETE' });
await fetch(`${baseUrl}/api/admin/videos?id=${createdVideoId}`, { method: 'DELETE' });
console.log(`✓ Cleaned up test records from database`);

// 8. Verify deletion on homepage
const resFinal = await fetch(baseUrl, { cache: 'no-store' });
const htmlFinal = await resFinal.text();
assert.ok(!htmlFinal.includes(testArticleTitle), 'Deleted article must no longer appear on the homepage');
assert.ok(!htmlFinal.includes(testBreakingHeadline), 'Deleted breaking news must no longer appear on the homepage');
console.log(`✓ Confirmed immediate deletion reflection on homepage`);

console.log(`\n======================================================`);
console.log(`🎉 ALL ADMIN SUBMISSION & HOMEPAGE TESTS PASSED 100%!`);
console.log(`======================================================`);
