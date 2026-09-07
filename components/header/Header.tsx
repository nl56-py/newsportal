'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeStory, homepageBrand, referenceSections } from '@/lib/homepage-content';
import { NewsList, SourceIcon } from '@/components/home/ReferenceSections';
import { formatNepaliDateBS } from '@/lib/nepali-utils';
import { HomepageAd } from '@/components/ads/HomepageAd';
import type { AdSlotDefinition } from '@/lib/types';

const navigation = [
  ['गृहपृष्ठ', '/'], ['राष्ट्रिय', '/category/province'],
  ['अन्तराष्ट्रिय', '/category/international'], ['अर्थ', '/category/economy'],
  ['खेलकुद', '/category/sports'], ['मनोरञ्जन', '/category/entertainment'],
  ['जीवनशैली', '/category/lifestyle'],
];
const extraNavigation = [
  ['स्वास्थ्य', '/category/health'], ['राशिफल', '/search?s=राशिफल'],
  ['अनौठा कुरा', '/category/different-world'], ['कोरोना', '/search?s=कोरोना'],
  ['विचार/ब्लग', '/category/blog'],
];

export function Header({ recent, popular, breaking = [], ad }: { recent?: HomeStory[]; popular?: HomeStory[]; breaking?: HomeStory[]; ad?: AdSlotDefinition }) {
  const pathname = usePathname();
  const [panel, setPanel] = useState<'search' | 'recent' | 'popular' | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [date, setDate] = useState('');
  const [sticky, setSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setDate(formatNepaliDateBS(new Date())); }, []);
  useEffect(() => { setPanel(null); setDrawer(false); }, [pathname]);
  useEffect(() => {
    const update = () => setSticky((navRef.current?.getBoundingClientRect().top || 0) <= 0);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setPanel(null); setDrawer(false); menuButton.current?.focus(); }
      if (event.key === 'Tab' && drawer && drawerRef.current) {
        const elements = [...drawerRef.current.querySelectorAll<HTMLElement>('a,button')];
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', close);
    if (drawer) { drawerRef.current?.querySelector<HTMLElement>('button')?.focus(); }
    return () => window.removeEventListener('keydown', close);
  }, [drawer]);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [drawer]);
  if (pathname.startsWith('/admin')) return null;
  const toggle = (value: typeof panel) => setPanel(current => current === value ? null : value);
  const closeDrawer = () => { setDrawer(false); menuButton.current?.focus(); };

  return <header className="sn-header">
    <div className="sn-masthead sn-container">
      <div className="sn-brand"><Link href="/"><img src={homepageBrand.logo} alt="Sawal Nepal" width={320} height={90} /></Link><div className="sn-date">{date || '२१ भाद्र २०८३, आइतबार'}</div></div>
      <div className="sn-masthead-ad"><HomepageAd slot={ad} /></div>
    </div>
    <div ref={navRef} className="sn-nav-space">
      <div className={`sn-nav-shell ${sticky ? 'is-sticky' : ''}`}>
        <nav className="sn-nav" aria-label="मुख्य नेभिगेसन"><div className="sn-container sn-nav-inner">
          <button ref={menuButton} className="sn-menu-button" aria-label="Open menu" aria-expanded={drawer} onClick={() => {setDrawer(true);setPanel(null);}}><SourceIcon name="menu" /></button>
          <div className="sn-nav-links">{navigation.map(([label, href]) => <Link key={href} href={href} prefetch={false} className={(href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'is-active' : ''}>{label}</Link>)}</div>
          <div className="sn-nav-actions">
            <button className="sn-search-toggle" aria-label="Search" aria-expanded={panel === 'search'} onClick={() => toggle('search')}><SourceIcon name="search" /></button>
            <button aria-label="Recent News" aria-expanded={panel === 'recent'} onClick={() => toggle('recent')}><SourceIcon name="recent" /></button>
            <button className="sn-popular-toggle" aria-label="Popular News" aria-expanded={panel === 'popular'} onClick={() => toggle('popular')}><SourceIcon name="bolt" /></button>
            <Link href="/unicode" className="sn-unicode" prefetch={false}>Unicode</Link>
          </div>
        </div></nav>
        {panel === 'search' && <div className="sn-search-panel"><form action="/search" className="sn-container sn-search-form">
          <input name="from" aria-label="बाट मिति" placeholder="बाट" onFocus={event => event.currentTarget.type = 'date'} onBlur={event => {if(!event.currentTarget.value) event.currentTarget.type = 'text';}} />
          <input name="to" aria-label="सम्म मिति" placeholder="सम्म" onFocus={event => event.currentTarget.type = 'date'} onBlur={event => {if(!event.currentTarget.value) event.currentTarget.type = 'text';}} />
          <input name="s" aria-label="खोजशब्द" placeholder="खोजशब्द" autoFocus />
          <button type="submit" className="sn-search-submit">SEARCH</button>
          <button type="button" aria-label="Close search" onClick={() => setPanel(null)}><SourceIcon name="close" /></button>
        </form></div>}
        {(panel === 'recent' || panel === 'popular') && <section className={`sn-news-panel ${panel === 'popular' ? 'sn-popular-panel' : ''}`} aria-label={panel === 'recent' ? 'ताजा अपडेट' : 'धेरै पढिएको'}><div className="sn-container">
          <div className="sn-panel-heading"><h2>{panel === 'recent' ? 'ताजा अपडेट' : 'धेरै पढिएको'}</h2><button aria-label="Close news panel" onClick={() => setPanel(null)}><SourceIcon name="close" /></button></div>
          <NewsList stories={(panel === 'recent' ? recent || referenceSections['ताजा समाचार'] : popular || referenceSections['धेरै पढिएको']).slice(0, panel === 'recent' ? 6 : 9)} />
        </div></section>}
      </div>
    </div>
    <div className="sn-trending"><span className="sn-trending-label">{breaking.length ? 'ब्रेकिङ' : 'ट्रेण्डिङ'}<SourceIcon name="bolt" /></span><div>{(breaking.length ? breaking : recent || []).slice(0, 8).map(story => <span key={story.id}><Link href={story.href} prefetch={false}>{story.title}</Link>　</span>)}</div></div>
    {drawer && <div className="sn-drawer-layer"><button className="sn-drawer-backdrop" aria-label="Close menu backdrop" onClick={closeDrawer} /><div ref={drawerRef} className="sn-drawer" role="dialog" aria-modal="true" aria-label="नेभिगेसन मेनु"><button className="sn-drawer-close" onClick={closeDrawer} aria-label="Close menu"><SourceIcon name="left" /></button><nav>{[...navigation, ...extraNavigation].map(([label, href]) => <Link key={href} href={href} prefetch={false} onClick={closeDrawer}>{label}</Link>)}</nav></div></div>}
  </header>;
}
