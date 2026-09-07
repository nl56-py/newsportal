'use client';

import type { AdSlotDefinition } from '@/lib/types';
import { localAsset } from '@/lib/homepage-content';

// Render the admin's slot in the existing homepage advertising containers.
export function HomepageAd({ slot }: { slot?: AdSlotDefinition }) {
  const ad = slot?.currentAd;
  if (!slot || !ad?.active) return null;
  const now = Date.now();
  if (ad.startDate && Date.parse(ad.startDate) > now) return null;
  if (ad.endDate && Date.parse(`${ad.endDate.slice(0, 10)}T23:59:59+05:45`) < now) return null;
  if (ad.type !== 'image') return ad.htmlCode ? <iframe title={ad.title} srcDoc={ad.htmlCode} sandbox="allow-scripts allow-popups" style={{ width: '100%', height: slot.dimensions.desktop.height, border: 0 }} /> : null;
  if (!ad.imageUrl) return null;
  const picture = <img src={localAsset(ad.imageUrl) || ad.imageUrl} alt={ad.title} width={slot.dimensions.desktop.width} height={slot.dimensions.desktop.height} />;
  const url = ad.redirectUrl;
  return url && (/^https?:\/\//i.test(url) || url.startsWith('/')) ? <a href={url} target={ad.targetBlank === false ? '_self' : '_blank'} rel="noopener noreferrer sponsored">{picture}</a> : picture;
}
