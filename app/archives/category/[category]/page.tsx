import CategoryArchivePage, { generateMetadata } from "@/app/category/[slug]/page";

interface WordPressCategoryProps {
  params: Promise<{ category: string }>;
}

export { generateMetadata };

export default async function WordPressCategoryPage({
  params,
}: WordPressCategoryProps) {
  const { category } = await params;
  return <CategoryArchivePage params={Promise.resolve({ slug: category })} />;
}
