async function testAll() {
  const urls = [
    'https://sawalnepal.com/',
    'https://www.sawalnepal.com/',
    'https://beta.sawalnepal.com/',
    'https://beta.sawalnepal.com/api/admin/db-health',
    'https://beta.sawalnepal.com/api/admin/articles?page=1&limit=5'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u);
      const text = await res.text();
      if (u.includes('db-health')) {
        const j = JSON.parse(text);
        console.log(u, '=> HTTP', res.status, '| DB Connected:', j.database?.connected, '| Posts:', j.database?.totalPublishedPosts, '| Latency:', j.database?.latencyMs + 'ms');
      } else if (u.includes('articles')) {
        const j = JSON.parse(text);
        console.log(u, '=> HTTP', res.status, '| Total Articles:', j.pagination?.total, '| Pages:', j.pagination?.totalPages);
      } else {
        const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'No title';
        console.log(u, '=> HTTP', res.status, '| Length:', text.length, '| Title:', title);
      }
    } catch (e) {
      console.error(u, '=> ERROR:', e.message);
    }
  }
}

testAll().catch(console.error);
