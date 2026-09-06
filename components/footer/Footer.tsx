'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { homepageBrand } from '@/lib/homepage-content';
import { SourceIcon } from '@/components/home/ReferenceSections';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <footer className="sn-footer">
    <div className="sn-container sn-footer-main">
      <Link href="/"><img src={homepageBrand.logo} alt="Sawal Nepal" width={320} height={90} /></Link>
      <div className="sn-socials">
        <a href="https://facebook.com/sawaalnepal" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><SourceIcon name="facebook" /></a>
        <a href="https://twitter.com/sawalnepal" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><SourceIcon name="twitter" /></a>
        <a href="https://youtube.com/c/SawalNepalTvHD" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><SourceIcon name="youtube" /></a>
        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><SourceIcon name="instagram" /></a>
      </div>
    </div>
    <div className="sn-footer-band" />
    <div className="sn-copyright"><div className="sn-container"><span>© 2026, All right reserved to Sawal Nepal</span><span>Made with <SourceIcon name="heart" /> By <a href="https://www.nexa-form.com/" target="_blank" rel="noopener noreferrer">Nexaform</a></span></div></div>
    <button className="sn-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to Top"><SourceIcon name="up" /></button>
  </footer>;
}
