async function main() {
  const res = await fetch('https://beta.sawalnepal.com/');
  const html = await res.text();
  
  const emptyCount = (html.match(/यस विधामा समाचार प्रकाशित भएको छैन/g) || []).length;
  console.log('Total EmptyNews occurrences in homepage HTML:', emptyCount);

  const sections = [
    'समाचार', 'अर्थ', 'खेलकुद', 'राजनीति', 'मनोरञ्जन', 'स्वास्थ्य', 
    'सूचना-प्रविधि', 'अन्तर्राष्ट्रिय', 'विचार/ब्लग', 'देश', 'भिडियो', 'विचित्र संसार', 'धर्म सस्कृति'
  ];

  for (const s of sections) {
    const idx = html.indexOf(s);
    if (idx === -1) {
      console.log(s, '=> NOT FOUND in HTML');
    } else {
      const chunk = html.slice(idx, idx + 2000);
      const hasEmpty = chunk.includes('यस विधामा समाचार प्रकाशित भएको छैन');
      console.log(s, '=> Found! Empty notice present?', hasEmpty);
    }
  }
}

main().catch(console.error);
