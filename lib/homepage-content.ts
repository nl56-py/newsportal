import reference from '@/data/homepage-reference.json';
import assetManifest from '@/data/homepage-assets.json';

export interface HomeStory {
  id: string;
  title: string;
  href: string;
  image: string;
  summary: string;
  date: string;
  author?: string;
}

const assets: Record<string, string> = assetManifest;
export const localAsset = (url: string) => assets[url] || (url.startsWith('/') ? url : '');
export const homepageBrand = {
  logo: localAsset('https://www.sawalnepal.com/wp-content/uploads/2021/05/logo1.png'),
  avatar: localAsset(Object.keys(assets).find(url => url.includes('gravatar.com')) || ''),
  banner: localAsset(reference.ads[1].image),
  sidebar: localAsset('https://www.sawalnepal.com/wp-content/uploads/2025/04/50-off-jec-1024x1024.jpg'),
  referral: localAsset('https://www.sawalnepal.com/wp-content/uploads/2023/12/263-x-150_T4b3H7eDrF.webp'),
};

export const sectionSlugs: Record<string, string> = {
  'समाचार': 'samachar', 'धेरै पढिएको': 'popular', 'देश': 'province',
  'सूचना-प्रविधि': 'tech', 'ताजा समाचार': 'samachar', 'मनोरञ्जन': 'entertainment',
  'फिचर': 'feature', 'अर्थ': 'economy', 'अन्तर्वार्ता': 'interview',
  'विचार/ब्लग': 'blog', 'खेलकुद': 'sports', 'राजनीति': 'politics',
  'अन्तर्राष्ट्रिय': 'international', 'स्वास्थ्य': 'health',
  'विचित्र संसार': 'different-world', 'धर्म सस्कृति': 'religion', 'भिडियो': 'video',
};

export function referenceStory(story: typeof reference.highlights[number]): HomeStory {
  return { ...story, title: story.title.replace(/\u00a0/g, ' '), image: localAsset(story.image), date: story.date || (Number(story.id) >= 265727 ? '२ महिना अघि' : '३ महिना अघि'), author: 'सवाल नेपाल' };
}

export const referenceSections = Object.fromEntries(reference.sections.map(section => [section.title, section.articles.map(referenceStory)]));
export const referenceProvinces = Object.fromEntries(reference.provinces.map(province => [province.id, province.articles.map(referenceStory)]));
export const referenceHighlights = reference.highlights.map(referenceStory);
