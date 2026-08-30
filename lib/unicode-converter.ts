/**
 * Comprehensive Nepali Unicode / Romanized Conversion Engine
 * Converts Romanized English input to Devanagari Unicode in real-time.
 */

const unicodeMap: { [key: string]: string } = {
  // Vowels
  a: "अ",
  aa: "आ",
  A: "आ",
  i: "इ",
  ee: "ई",
  I: "ई",
  u: "उ",
  oo: "ऊ",
  U: "ऊ",
  ri: "ऋ",
  e: "ए",
  ai: "ऐ",
  o: "ओ",
  au: "औ",
  am: "अं",
  ah: "अः",

  // Matras (Vowel signs)
  ka: "क",
  kaa: "का",
  kA: "का",
  ki: "कि",
  kee: "की",
  kI: "की",
  ku: "कु",
  koo: "कू",
  kU: "कू",
  kri: "कृ",
  ke: "के",
  kai: "कै",
  ko: "को",
  kau: "कौ",
  kam: "कं",
  kah: "कः",

  // Consonants with virama / basic
  k: "क्",
  kh: "ख्",
  g: "ग्",
  gh: "घ्",
  ng: "ङ्",
  ch: "च्",
  chh: "छ्",
  j: "ज्",
  jh: "झ्",
  yn: "ञ्",
  T: "ट्",
  Th: "ठ्",
  D: "ड्",
  Dh: "ढ्",
  N: "ण्",
  t: "त्",
  th: "थ्",
  d: "द्",
  dh: "ध्",
  n: "न्",
  p: "प्",
  ph: "फ्",
  f: "फ्",
  b: "ब्",
  bh: "भ्",
  m: "म्",
  y: "य्",
  r: "र्",
  l: "ल्",
  v: "व्",
  w: "व्",
  sh: "श्",
  Sh: "ष्",
  s: "स्",
  h: "ह्",
  ksh: "क्ष्",
  tra: "त्र",
  gya: "ज्ञ",
  gy: "ज्ञ्",

  // Numbers
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

// Common word substitutions for natural typing
const commonWords: { [key: string]: string } = {
  nepal: "नेपाल",
  nepali: "नेपाली",
  namaste: "नमस्ते",
  dhanyabad: "धन्यवाद",
  mero: "मेरो",
  timro: "तिम्रो",
  tapai: "तपाईं",
  tapaiko: "तपाईंको",
  hami: "हामी",
  hamro: "हाम्रो",
  khabar: "खबर",
  samachar: "समाचार",
  sawal: "सवाल",
  desh: "देश",
  bikas: "विकास",
  rajniti: "राजनीति",
  artha: "अर्थ",
  khelkud: "खेलकुद",
  manoranjan: "मनोरञ्जन",
  swasthya: "स्वास्थ्य",
  kathmandu: "काठमाडौँ",
  pokhara: "पोखरा",
  jhapa: "झापा",
  damak: "दमक",
  biratnagar: "विराटनगर",
};

export function convertRomanToNepali(text: string): string {
  if (!text) return "";

  // Split into words, preserving spaces and line breaks
  const words = text.split(/(\s+|[.,!?;:'"()[\]{}])/);

  return words
    .map((word) => {
      // Check if exact match in common words
      const lower = word.toLowerCase();
      if (commonWords[lower]) {
        return commonWords[lower];
      }

      // Simple phonetic conversion
      let result = "";
      let i = 0;
      while (i < word.length) {
        // Try 4-char, 3-char, 2-char, then 1-char combinations
        let match = "";
        for (let len = 4; len >= 1; len--) {
          if (i + len <= word.length) {
            const sub = word.substring(i, i + len);
            if (unicodeMap[sub] || unicodeMap[sub.toLowerCase()]) {
              match = unicodeMap[sub] || unicodeMap[sub.toLowerCase()];
              i += len;
              break;
            }
          }
        }

        if (match) {
          result += match;
        } else {
          result += word[i];
          i++;
        }
      }

      // Clean up standalone viramas before vowels if needed
      return result
        .replace(/्अ/g, "")
        .replace(/्आ/g, "ा")
        .replace(/्इ/g, "ि")
        .replace(/्ई/g, "ी")
        .replace(/्उ/g, "ु")
        .replace(/्ऊ/g, "ू")
        .replace(/्ऋ/g, "ृ")
        .replace(/्ए/g, "े")
        .replace(/्ऐ/g, "ै")
        .replace(/्ओ/g, "ो")
        .replace(/्औ/g, "ौ")
        .replace(/्ं/g, "ं");
    })
    .join("");
}
