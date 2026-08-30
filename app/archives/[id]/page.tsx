import { redirect } from "next/navigation";
import { getArticleBySlug } from "@/lib/api";
import NewsDetailPage from "@/app/news/[slug]/page";

interface ArchivesPageProps {
  params: Promise<{ id: string }>;
}

export { generateMetadata } from "@/app/news/[slug]/page";

export default async function ArchivesPostPage({ params }: ArchivesPageProps) {
  const { id } = await params;
  const article = await getArticleBySlug(id);

  if (article && article.slug !== id) {
    // If slug exists and is different, redirect or render directly
    return <NewsDetailPage params={Promise.resolve({ slug: article.slug })} />;
  }

  return <NewsDetailPage params={Promise.resolve({ slug: id })} />;
}
