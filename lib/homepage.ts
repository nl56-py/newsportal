import { db } from '@/lib/db';
import { selectHomepageContent } from './homepage-selection';

// The CMS is authoritative: no captured stories can resurrect deleted content.
export function getHomepageContent() {
  const state = db.getState();
  const content = selectHomepageContent(state.articles, state.videos || []);
  const manualBreaking = (state.breakingNews || []).filter(item => item.active).map(item => ({
    id: item.id, title: item.headline,
    href: item.linkUrl && (/^https?:\/\//i.test(item.linkUrl) || item.linkUrl.startsWith('/')) ? item.linkUrl : `/search?s=${encodeURIComponent(item.headline)}`,
    image: '', summary: '', date: '',
  }));
  return { ...content, ads: state.ads || {}, breaking: state.siteSettings?.breakingNewsEnabled === false ? [] : [...manualBreaking, ...content.breaking] };
}
