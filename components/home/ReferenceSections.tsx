'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { HomeStory, homepageBrand, sectionSlugs } from '@/lib/homepage-content';

const glyphs = { menu: '\uf0c9', search: '\uf002', recent: '\uf110', bolt: '\uf0e7', close: '\uf00d', clock: '\uf017', right: '\uf105', left: '\uf060', up: '\uf106', play: '\uf144', facebook: '\uf09a', twitter: '\uf099', youtube: '\uf16a', instagram: '\uf16d', heart: '\uf004' };
export function SourceIcon({ name, className = '' }: { name: keyof typeof glyphs; className?: string }) {
  return <i className={`sn-icon ${className}`} aria-hidden="true">{glyphs[name]}</i>;
}

export function StoryImage({ story, className = '' }: { story: HomeStory; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!story.image || failed) return null;
  return <img src={story.image} alt={story.title} loading="lazy" className={className} onError={() => setFailed(true)} />;
}

export function Byline({ story, time = true }: { story: HomeStory; time?: boolean }) {
  return <div className="sn-byline"><span className="sn-author"><img src={homepageBrand.avatar} alt="" width={30} height={30} />{story.author || 'सवाल नेपाल'}</span>{time && <span className="sn-time"><SourceIcon name="clock" />{story.date}</span>}</div>;
}

export function SectionHeading({ title, children, all = true }: { title: string; children?: ReactNode; all?: boolean }) {
  return <div className="sn-section-heading"><h2>{title}</h2><div className="sn-heading-actions">{children}{all && <Link className="sn-pill" href={`/category/${sectionSlugs[title] || 'samachar'}`} prefetch={false}>सबै<SourceIcon name="right" /></Link>}</div></div>;
}

export function NewsList({ stories, dates = false, className = '' }: { stories: HomeStory[]; dates?: boolean; className?: string }) {
  return <div className={`sn-news-list ${className}`}>{stories.map(story => <article className="sn-news-row" key={story.id}><Link className="sn-thumb" href={story.href} prefetch={false}><StoryImage story={story} /></Link><div><h3><Link href={story.href} prefetch={false}>{story.title}</Link></h3>{dates && <span className="sn-small-date"><SourceIcon name="clock" />{story.date}</span>}</div></article>)}</div>;
}

export function LeadCard({ story, overlay = false, byline = true, className = '' }: { story: HomeStory; overlay?: boolean; byline?: boolean; className?: string }) {
  if (!story) return null;
  return <article className={`sn-lead-card ${overlay ? 'sn-overlay-card' : ''} ${className}`}><Link href={story.href} className="sn-lead-image" prefetch={false}><StoryImage story={story} /></Link><div className="sn-lead-copy"><h3><Link href={story.href} prefetch={false}>{story.title}</Link></h3>{byline && <Byline story={story} />}</div></article>;
}

function StackCard({ story }: { story: HomeStory }) {
  return <article className="sn-stack-card"><Link href={story.href} prefetch={false}><StoryImage story={story} /><h3>{story.title}</h3></Link></article>;
}

export function ThreeColumnNews({ stories, middleCount = 3, featuredRight = false, byline = true, compact = false }: { stories: HomeStory[]; middleCount?: number; featuredRight?: boolean; byline?: boolean; compact?: boolean }) {
  const right = stories.slice(middleCount + 1);
  return <div className={`sn-three-columns ${compact ? 'sn-three-compact' : ''}`}><LeadCard story={stories[0]} byline={byline} /><div className="sn-middle-stack">{stories.slice(1, middleCount + 1).map(story => <StackCard key={story.id} story={story} />)}</div><div>{featuredRight && right[0] ? <><div className="sn-right-feature"><StackCard story={right[0]} /></div><NewsList stories={right.slice(1)} /></> : <NewsList stories={right} />}</div></div>;
}

export function ProvinceNews({ provinces }: { provinces: Record<string, HomeStory[]> }) {
  const [active, setActive] = useState('all__province');
  const tabs = ['देश', 'प्रदेश १', 'प्रदेश २', 'वागमती', 'गण्डकी', 'प्रदेश ५', 'कर्णाली', 'सुदूरपश्चिम'];
  const keys = ['all__province', ...Array.from({ length: 7 }, (_, i) => `province__${i + 1}`)];
  return <section className="sn-section" id="province"><SectionHeading title="देश"><div className="sn-province-tabs" role="tablist" aria-label="प्रदेश समाचार">{tabs.map((tab, i) => <button key={tab} id={`tab-${keys[i]}`} role="tab" aria-selected={active === keys[i]} aria-controls="province-panel" className={`sn-pill ${active === keys[i] ? 'is-active' : ''}`} onClick={() => setActive(keys[i])} onKeyDown={event => { if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 7 : (i + (event.key === 'ArrowRight' ? 1 : 7)) % 8; setActive(keys[next]); document.getElementById(`tab-${keys[next]}`)?.focus(); }}>{tab}</button>)}</div></SectionHeading><div id="province-panel" role="tabpanel" aria-labelledby={`tab-${active}`}><ThreeColumnNews stories={provinces[active] || []} /></div></section>;
}

export function HorizontalNews({ title, stories, economy = false }: { title: string; stories: HomeStory[]; economy?: boolean }) {
  const lead = stories[0];
  return <section className={`sn-section sn-horizontal-section ${economy ? 'sn-economy' : ''}`}><SectionHeading title={title}>{economy && <div className="sn-secondary-tabs"><Link className="sn-pill" href="/category/economy">बैँक / वित्त</Link><Link className="sn-pill" href="/search?s=रोजगार">रोजगार</Link></div>}</SectionHeading><div className="sn-horizontal-lead"><Link href={lead.href} prefetch={false}><StoryImage story={lead} /></Link><div><h3><Link href={lead.href} prefetch={false}>{lead.title}</Link></h3><Byline story={lead} time={false} /></div></div><div className="sn-two-lists"><NewsList stories={stories.slice(1, 3)} /><NewsList stories={stories.slice(3, 5)} /></div></section>;
}

export function SidebarFeature({ title, stories }: { title: string; stories: HomeStory[] }) {
  return <section className="sn-section sn-sidebar-feature"><SectionHeading title={title} /><StackCard story={stories[0]} /><NewsList stories={stories.slice(1)} /></section>;
}

export function MainNews({ stories }: { stories: HomeStory[] }) {
  return <section className="sn-section sn-main-news" id="news"><SectionHeading title="समाचार" /><div className="sn-news-ad-grid"><div><div className="sn-main-news-grid"><LeadCard story={stories[0]} overlay /><NewsList stories={stories.slice(1, 6)} dates /></div><div className="sn-two-lists"><NewsList stories={stories.slice(6, 8)} dates /><NewsList stories={stories.slice(8, 10)} dates /></div></div><aside className="sn-reference-ads" aria-label="विज्ञापन"><img src={homepageBrand.sidebar} alt="JEC IELTS or PTE Classes" loading="lazy" /><img src={homepageBrand.referral} alt="WorldLink Refer Offer" loading="lazy" /><h3>वाई. टेक प्रा.लि</h3></aside></div></section>;
}

export function EntertainmentNews({ stories }: { stories: HomeStory[] }) {
  return <section className="sn-section sn-entertainment"><SectionHeading title="मनोरञ्जन" /><div className="sn-entertainment-grid"><LeadCard story={stories[0]} overlay byline={false} /><NewsList stories={stories.slice(1, 6)} /><div><div className="sn-entertainment-feature"><StackCard story={stories[6]} /></div><NewsList stories={stories.slice(7)} /></div></div></section>;
}

export function PoliticsNews({ stories }: { stories: HomeStory[] }) {
  return <section className="sn-section sn-politics"><SectionHeading title="राजनीति" /><div className="sn-politics-grid"><div className="sn-politics-lead"><StackCard story={stories[0]} /></div><div className="sn-politics-small-grid">{stories.slice(1, 5).map(story => <StackCard key={story.id} story={story} />)}</div></div><div className="sn-two-lists"><NewsList stories={stories.slice(5, 7)} /><NewsList stories={stories.slice(7, 9)} /></div></section>;
}

export function HealthNews({ stories }: { stories: HomeStory[] }) {
  return <section className="sn-section sn-health"><SectionHeading title="स्वास्थ्य" /><div className="sn-split"><div><LeadCard story={stories[0]} byline={false} /><div className="sn-two-lists"><NewsList stories={stories.slice(1, 2)} /><NewsList stories={stories.slice(2, 3)} /></div></div><div className="sn-health-side"><StackCard story={stories[3]} /><NewsList stories={stories.slice(4)} /></div></div></section>;
}

export function StoryCarousel({ title, stories, variant = 'feature' }: { title: string; stories: HomeStory[]; variant?: 'popular' | 'feature' | 'opinion' | 'video' }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(4);
  useEffect(() => {
    const update = () => setPerPage(window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 4);
    update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
  }, []);
  const pages = Math.ceil(stories.length / perPage);
  const goTo = (next: number) => { const safe = Math.max(0, Math.min(pages - 1, next)); setPage(safe); track.current?.scrollTo({ left: safe * (track.current.clientWidth + 30), behavior: 'smooth' }); };
  const dots = <div className="sn-carousel-dots" aria-label={`${title} स्लाइड`}>{Array.from({ length: pages }, (_, i) => <button key={i} aria-label={`${title}: स्लाइड ${i + 1}`} aria-current={page === i ? 'true' : undefined} className={page === i ? 'is-active' : ''} onClick={() => goTo(i)} />)}</div>;
  return <section className={`sn-carousel sn-carousel-${variant}`} aria-label={title}><div className="sn-container"><SectionHeading title={title} all={variant !== 'popular'}>{variant === 'popular' && dots}</SectionHeading><div ref={track} className="sn-carousel-track" tabIndex={0} onKeyDown={e => {if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){e.preventDefault();goTo(page + (e.key === 'ArrowRight' ? 1 : -1));}}} onScroll={() => { if(track.current) setPage(Math.min(pages - 1, Math.round(track.current.scrollLeft / (track.current.clientWidth + 30)))); }}>{stories.map((story, i) => <article className="sn-carousel-card" key={story.id}><Link href={story.href} prefetch={false}><div className="sn-carousel-image"><StoryImage story={story} /></div>{variant === 'popular' && <span className="sn-rank">{String(i + 1).replace(/\d/g, n => '०१२३४५६७८९'[Number(n)])}</span>}{variant === 'video' && <span className="sn-video-play"><SourceIcon name="play" /></span>}<h3>{story.title}</h3></Link></article>)}</div>{variant !== 'popular' && variant !== 'video' && dots}{variant === 'video' && <div className="sn-video-pagination">{dots}</div>}</div></section>;
}

export function HomepageHighlights({ stories }: { stories: HomeStory[] }) {
  return <section className="sn-container sn-highlights" aria-label="मुख्य समाचार">{stories.map((story, i) => <div key={story.id}><article className={`sn-highlight ${i < 2 ? 'sn-highlight-divider' : ''}`}><h1 hidden={i !== 0}>{i === 0 && <Link href={story.href} prefetch={false}>{story.title}</Link>}</h1>{i > 0 && <h2><Link href={story.href} prefetch={false}>{story.title}</Link></h2>}<Byline story={story} />{i === 2 && <><Link href={story.href} prefetch={false} className="sn-highlight-image"><img src={story.image} alt={story.title} width={1536} height={838} fetchPriority="high" /></Link><p className="sn-highlight-summary">{story.summary}</p></>}</article>{i === 1 && <div className="sn-headline-ad"><img src={homepageBrand.banner} alt="Unicampus Global — Study in Australia" width={640} height={156} /></div>}</div>)}</section>;
}
