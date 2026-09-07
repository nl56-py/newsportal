import type { NewsArticle, VideoStory } from './types';
import { localAsset, sectionSlugs, referenceSections, referenceProvinces, type HomeStory } from './homepage-content';

const aliases: Record<string, string> = {
  rajniti: 'politics', politics: 'politics', 'राजनीति': 'politics',
  artha: 'economy', economy: 'economy', business: 'economy', finance: 'economy', 'अर्थ': 'economy', 'अर्थ / बजार': 'economy',
  khelkud: 'sports', sports: 'sports', 'खेलकुद': 'sports',
  manoranjan: 'entertainment', entertainment: 'entertainment', cinema: 'entertainment', films: 'entertainment', 'मनोरञ्जन': 'entertainment',
  bichar: 'blog', blog: 'blog', opinion: 'blog', 'विचार': 'blog', 'विचार / ब्लग': 'blog', 'विचार/ब्लग': 'blog',
  pradesh: 'province', province: 'province', desh: 'province', national: 'province', 'प्रदेश': 'province', 'देश': 'province', 'प्रदेश / राष्ट्रिय': 'province',
  bishwa: 'international', international: 'international', world: 'international', bidesh: 'international', 'विश्व': 'international', 'अन्तर्राष्ट्रिय': 'international',
  prawidhi: 'tech', prabidhi: 'tech', tech: 'tech', technology: 'tech', it: 'tech', 'प्रविधि': 'tech', 'सूचना-प्रविधि': 'tech',
  swasthya: 'health', health: 'health', 'स्वास्थ्य': 'health',
  dharma: 'religion', religion: 'religion', culture: 'religion', sanskriti: 'religion', 'धर्म': 'religion', 'धर्म सस्कृति': 'religion', 'धर्म संस्कृति': 'religion',
  anautho: 'different-world', vichitra: 'different-world', 'different-world': 'different-world', strange: 'different-world', 'अनौठा कुरा': 'different-world', 'विचित्र संसार': 'different-world',
  antarwarta: 'interview', antarbarta: 'interview', interview: 'interview', 'अन्तर्वार्ता': 'interview',
  multimedia: 'video', video: 'video', 'भिडियो': 'video', 'फोटो/भिडियो': 'video',
  news: 'samachar', samachar: 'samachar', 'समाचार': 'samachar', 'मुख्य खबर': 'samachar',
  feature: 'feature', samaj: 'feature', lifestyle: 'feature', trending: 'feature', 'फिचर': 'feature', 'समाज': 'feature', 'जीवनशैली': 'feature',
};

const provinceIds = ['koshi', 'madhesh', 'bagmati', 'gandaki', 'lumbini', 'karnali', 'sudurpashchim'];
const limits: Record<string, number> = {
  'समाचार': 10, 'धेरै पढिएको': 10, 'देश': 9, 'सूचना-प्रविधि': 5, 'ताजा समाचार': 4,
  'मनोरञ्जन': 9, 'फिचर': 8, 'अर्थ': 5, 'अन्तर्वार्ता': 2, 'विचार/ब्लग': 8,
  'खेलकुद': 7, 'राजनीति': 9, 'अन्तर्राष्ट्रिय': 5, 'स्वास्थ्य': 6,
  'विचित्र संसार': 7, 'धर्म सस्कृति': 7, 'भिडियो': 8,
};

// Keep editor-uploaded and remote images, not just the reference asset manifest.
export function publicMedia(url: string = ''): string {
  if (!url) return '';
  return localAsset(url) || url;
}

export function selectHomepageContent(input: NewsArticle[], videos: VideoStory[] = []) {
  const articles = [...input].sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  const story = (article: NewsArticle): HomeStory => ({
    id: article.id,
    title: article.title,
    href: `/news/${article.slug}`,
    image: publicMedia(article.coverImage),
    summary: article.summary,
    date: article.publishedAtBS,
    author: article.author?.name || 'सवाल नेपाल',
  });
  const category = (article: NewsArticle) => {
    const raw = (article.category || '').toLowerCase().trim();
    return aliases[raw] || raw;
  };
  const unique = (items: NewsArticle[]) => [...new Map(items.map(item => [item.id, item])).values()];
  const leads = articles.filter(a => a.isLeadStory).slice(0, 1);
  const featured = unique([...leads, ...articles.filter(a => a.isSubLead), ...articles]);
  const national = articles.filter(a => category(a) === 'province' || !!a.provinceId);
  const ranked = [...articles].sort((a, b) => {
    const priority = (item: NewsArticle) => item.isPopular || (item.popularRank || 0) > 0 ? 0 : 1;
    return priority(a) - priority(b) || (a.popularRank || Infinity) - (b.popularRank || Infinity)
      || b.viewsCount - a.viewsCount || (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0);
  });
  const sections: Record<string, HomeStory[]> = {};
  for (const [title, limit] of Object.entries(limits)) {
    let selected: NewsArticle[];
    switch (title) {
      case 'समाचार': selected = unique([...leads, ...articles]); break;
      case 'ताजा समाचार': selected = articles; break;
      case 'धेरै पढिएको': selected = ranked; break;
      case 'देश': selected = national; break;
      case 'फिचर': selected = unique([...articles.filter(a => a.isTrending || category(a) === 'feature'), ...articles]); break;
      default: selected = articles.filter(a => category(a) === sectionSlugs[title]);
    }
    const liveStories = selected.slice(0, limit).map(story);
    const refStories = referenceSections[title] || [];
    const needed = limit - liveStories.length;
    const backfill = needed > 0
      ? refStories.filter(r => !liveStories.some(l => l.title === r.title || l.id === r.id)).slice(0, needed)
      : [];
    sections[title] = [...liveStories, ...backfill];
  }
  // The video admin stores newest submissions first.
  sections['भिडियो'] = [...videos.map(video => ({
    id: `video:${video.id}`,
    title: video.title,
    href: /^https?:\/\//i.test(video.videoUrl) || video.videoUrl.startsWith('/') ? video.videoUrl : '/category/video',
    image: publicMedia(video.thumbnail),
    summary: '',
    date: video.publishedAtBS,
  })), ...sections['भिडियो']].slice(0, 8);

  const allRefProv = referenceProvinces['all__province'] || [];
  const provinces: Record<string, HomeStory[]> = {
    all__province: national.length > 0
      ? [...national.slice(0, 9).map(story), ...allRefProv.filter(r => !national.some(n => n.title === r.title)).slice(0, Math.max(0, 9 - national.length))]
      : allRefProv.slice(0, 9),
  };
  provinceIds.forEach((id, i) => {
    const key = `province__${i + 1}`;
    const liveProv = articles.filter(a => a.provinceId === id).slice(0, 9).map(story);
    const refProv = referenceProvinces[key] || [];
    const needed = 9 - liveProv.length;
    const backfill = needed > 0 ? refProv.filter(r => !liveProv.some(l => l.title === r.title)).slice(0, needed) : [];
    provinces[key] = [...liveProv, ...backfill];
  });
  return {
    sections,
    provinces,
    highlights: featured.slice(0, 3).map(story),
    recent: articles.slice(0, 6).map(story),
    breaking: articles.filter(a => a.isBreaking).map(story),
  };
}
