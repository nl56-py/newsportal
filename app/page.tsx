import { getHomepageContent } from '@/lib/homepage';
import { HomepageAd } from '@/components/ads/HomepageAd';
import {
  HomepageHighlights, MainNews, ProvinceNews, HorizontalNews, SidebarFeature,
  EntertainmentNews, PoliticsNews, HealthNews, ThreeColumnNews,
  StoryCarousel, SectionHeading, NewsList,
} from '@/components/home/ReferenceSections';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { sections: s, provinces, highlights, ads } = await getHomepageContent();
  return (
    <div className="sn-home">
      <HomepageHighlights stories={highlights} ad={ads.Homepage_Mid_Banner} />
      <div className="sn-container"><MainNews stories={s['समाचार']} ad={ads.Sidebar_Sticky} /></div>
      <StoryCarousel title="धेरै पढिएको" stories={s['धेरै पढिएको']} variant="popular" />
      <div className="sn-container">
        <ProvinceNews provinces={provinces} />
        <div className="sn-section"><HomepageAd slot={ads.Pradesh_Banner} /></div>
        <div className="sn-split sn-section">
          <HorizontalNews title="सूचना-प्रविधि" stories={s['सूचना-प्रविधि']} />
          <aside className="sn-latest"><SectionHeading title="ताजा समाचार" all={false} /><NewsList stories={s['ताजा समाचार']} /></aside>
        </div>
        <EntertainmentNews stories={s['मनोरञ्जन']} />
      </div>
      <StoryCarousel title="फिचर" stories={s['फिचर']} />
      <div className="sn-container">
        <div className="sn-split sn-section sn-economy-row">
          <HorizontalNews title="अर्थ" stories={s['अर्थ']} economy />
          <SidebarFeature title="अन्तर्वार्ता" stories={s['अन्तर्वार्ता']} />
        </div>
      </div>
      <StoryCarousel title="विचार/ब्लग" stories={s['विचार/ब्लग']} variant="opinion" />
      <div className="sn-container">
        <section className="sn-section sn-sports"><SectionHeading title="खेलकुद" /><ThreeColumnNews stories={s['खेलकुद']} featuredRight /></section>
        <div className="sn-split sn-section"><PoliticsNews stories={s['राजनीति']} /><SidebarFeature title="अन्तर्राष्ट्रिय" stories={s['अन्तर्राष्ट्रिय']} /></div>
        <HealthNews stories={s['स्वास्थ्य']} />
        <section className="sn-section sn-strange"><SectionHeading title="विचित्र संसार" /><ThreeColumnNews stories={s['विचित्र संसार']} middleCount={2} byline={false} compact /></section>
        <section className="sn-section sn-religion"><SectionHeading title="धर्म सस्कृति" /><ThreeColumnNews stories={s['धर्म सस्कृति']} middleCount={2} byline={false} compact /></section>
      </div>
      <StoryCarousel title="भिडियो" stories={s['भिडियो']} variant="video" />
    </div>
  );
}
