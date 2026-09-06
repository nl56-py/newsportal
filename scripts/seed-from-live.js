const fs = require('fs');
const path = require('path');

const exportPath = path.join(__dirname, '..', 'data', 'sawalnepal_export.json');
const rawData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

console.log(`Loaded ${rawData.posts.length} live posts and ${rawData.categories.length} categories.`);

function mapCategory(categories) {
  if (!categories || categories.length === 0) return { cat: 'samachar', name: 'समाचार' };
  const slug = categories[0].slug.toLowerCase();
  const name = categories[0].name;

  if (slug.includes('sport') || slug.includes('khelkud')) return { cat: 'sports', name: 'खेलकुद' };
  if (slug.includes('economy') || slug.includes('artha') || slug.includes('share') || slug.includes('bank')) return { cat: 'economy', name: 'अर्थ' };
  if (slug.includes('politic') || slug.includes('rajniti')) return { cat: 'rajniti', name: 'राजनीति' };
  if (slug.includes('entertain') || slug.includes('manoranjan') || slug.includes('cinema')) return { cat: 'entertainment', name: 'मनोरञ्जन' };
  if (slug.includes('life') || slug.includes('lifestyle')) return { cat: 'lifestyle', name: 'जीवनशैली' };
  if (slug.includes('health') || slug.includes('swasthya')) return { cat: 'health', name: 'स्वास्थ्य' };
  if (slug.includes('tech') || slug.includes('pravidhi')) return { cat: 'tech', name: 'सूचना-प्रविधि' };
  if (slug.includes('provin') || slug.includes('pradesh') || slug.includes('rastriya')) return { cat: 'province', name: 'प्रदेश / राष्ट्रिय' };
  if (slug.includes('inter') || slug.includes('biswa')) return { cat: 'international', name: 'अन्तर्राष्ट्रिय' };
  if (slug.includes('blog') || slug.includes('bichar') || slug.includes('opinion')) return { cat: 'blog', name: 'विचार' };
  if (slug.includes('video')) return { cat: 'video', name: 'भिडियो' };
  
  return { cat: 'samachar', name: name || 'मुख्य खबर' };
}

const articles = rawData.posts.map((post, idx) => {
  const cat = mapCategory(post.categories);
  const cleanContent = (post.post_content || '')
    .split(/\r?\n\r?\n/)
    .map(p => p.trim().replace(/<[^>]+>/g, ''))
    .filter(p => p.length > 5);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=450&fit=crop&q=80'
  ];

  const coverImage = (post.thumbnail_url && post.thumbnail_url.startsWith('http'))
    ? post.thumbnail_url
    : fallbackImages[idx % fallbackImages.length];

  return {
    id: `live-${post.ID}`,
    numericId: post.ID,
    slug: decodeURIComponent(post.post_name || `news-${post.ID}`).replace(/[\s\/]+/g, '-'),
    title: post.post_title,
    summary: cleanContent[0] ? cleanContent[0].slice(0, 180) + '...' : post.post_title,
    content: cleanContent.length > 0 ? cleanContent : [post.post_title],
    category: cat.cat,
    categoryName: cat.name,
    tags: post.tags.map(t => t.name),
    coverImage,
    author: {
      id: "auth-sawal",
      name: post.author_name || "सवाल नेपाल",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
      role: "सम्पादकीय टिम (Sawal Nepal)"
    },
    publishedAt: post.post_date ? new Date(post.post_date.replace(' ', 'T') + '+05:45').toISOString() : new Date().toISOString(),
    publishedAtBS: "२०८३ जेठ / असार",
    viewsCount: Math.floor(Math.random() * 8500) + 1200,
    readTimeMinutes: Math.max(1, Math.ceil((post.post_content || '').length / 400)),
    isLeadStory: idx === 0,
    isSubLead: idx >= 1 && idx <= 4,
    isBreaking: idx < 3,
    isPopular: idx < 10,
    popularRank: idx < 9 ? idx + 1 : undefined
  };
});

fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'seeded_articles.json'),
  JSON.stringify(articles, null, 2),
  'utf8'
);

console.log(`Successfully generated ${articles.length} seeded articles at data/seeded_articles.json`);
