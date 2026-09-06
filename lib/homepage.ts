import { db } from '@/lib/db';
import { HomeStory, localAsset, referenceSections, referenceProvinces, referenceHighlights } from './homepage-content';

// Keep the captured editorial placement while resolving existing stories against
// the CMS. Missing migration records retain their real source article links.
// This read-only adapter never overwrites the user's database or admin edits.
export function getHomepageContent() {
  const articles = db.getArticles();
  const byId = new Map(articles.map(article => [String(article.numericId || article.id), article]));
  const resolve = (story: HomeStory): HomeStory => {
    const article = byId.get(story.id);
    if (!article) return story;
    return { ...story, title: article.title, href: `/news/${article.slug}`, image: localAsset(article.coverImage) || story.image, author: article.author.name };
  };
  const sections = Object.fromEntries(Object.entries(referenceSections).map(([title, stories]) => [title, stories.map(resolve)]));
  const provinces = Object.fromEntries(Object.entries(referenceProvinces).map(([id, stories]) => [id, stories.map(resolve)]));
  const highlights = referenceHighlights.map(resolve);
  const lead = articles.find(article => article.isLeadStory);
  if (lead && String(lead.numericId || lead.id) !== highlights[0]?.id) {
    highlights[0] = { id: lead.id, title: lead.title, href: `/news/${lead.slug}`, image: localAsset(lead.coverImage) || lead.coverImage, summary: lead.summary, date: lead.publishedAtBS, author: lead.author.name };
  }
  return { sections, provinces, highlights };
}
