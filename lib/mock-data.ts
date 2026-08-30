import {
  Author,
  FinancialRate,
  MarketCommodity,
  NewsArticle,
  PhotoGalleryItem,
  VideoStory,
} from "./types";

export const AUTHORS: { [key: string]: Author } = {
  sawal_editorial: {
    id: "auth-sawal",
    name: "सवाल नेपाल",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
    role: "सम्पादकीय टिम (Sawal Nepal)",
    bio: "सत्य, तथ्य र निष्पक्ष समाचार तथा मनोरञ्जनको अग्रणी डिजिटल पत्रिका।",
    email: "news@sawalnepal.com",
    socials: { twitter: "@sawalnepal", facebook: "https://facebook.com/sawaalnepal" },
  },
  kedar_adhikari: {
    id: "auth-kedar",
    name: "केदार अधिकारी",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    role: "विशेष संवाददाता (दमक / झापा)",
    bio: "शिक्षा, स्थानीय सरोकार र समसामयिक राजनीति सम्बन्धी खोजमूलक पत्रकारिता।",
    email: "kedar@sawalnepal.com",
  },
  swarnim_wagle: {
    id: "auth-3",
    name: "डा. स्वर्णिम वाग्ले",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    role: "अर्थशास्त्री तथा स्तम्भकार",
    bio: "अर्थतन्त्र, बजेट, राजस्व तथा सार्वजनिक नीति सम्बन्धी विश्लेषक।",
    email: "swarnim@sawalnepal.com",
  },
  bikas_shrestha: {
    id: "auth-6",
    name: "विकास श्रेष्ठ",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80",
    role: "अर्थ ब्यूरो प्रमुख",
    bio: "बैंकिङ, पुँजीबजार, नेप्से र सुनचाँदी कारोबार विश्लेषक।",
  },
  rita_pandey: {
    id: "auth-7",
    name: "रिता पाण्डे",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
    role: "खेलकुद तथा मनोरञ्जन संवाददाता",
    bio: "फुटबल, क्रिकेट र नेपाली चलचित्र क्षेत्रका विश्लेषक।",
  },
};

export const BREAKING_NEWS_LIST = [
  "दमकका शैक्षिक परामर्श ब्यवसायीहरु सडकमा : नियमावली २०८३ विरुद्ध शान्तिपूर्ण विरोध र्‍याली",
  "नयाँ आर्थिक वर्ष शुरु : शिक्षा, स्वास्थ्य र बिजुलीमा पनि थप करको व्यवस्था लागू",
  "आज सुनको भाउ बढ्यो, चाँदीको घट्यो : प्रतितोला १ लाख ६२ हजार ५०० मा कारोबार",
  "इङ्ग्ल्यान्ड भर्सेस अर्जेन्टिना: कसले मार्ला बाजी? विश्वकप फुटबलको यस्तो छ इतिहास",
  "विभिन्न कार्यक्रमका साथ देशभर भव्य रूपमा गणतन्त्र दिवस मनाइँदै",
];

export const MOCK_ARTICLES: NewsArticle[] = [
  // 1. Lead Story - Sawal Nepal Live Featured Article (Koshi)
  {
    id: "art-265738",
    numericId: 265738,
    slug: "damak-educational-consultancy-protest",
    title: "दमकका शैक्षिक परामर्श ब्यवसायीहरु सडकमा",
    subtitle: "शैक्षिक परामर्श, भाषा शिक्षण र तयारी कक्षा सञ्चालन नियमावली २०८३ विरुद्ध विरोध र्‍याली",
    summary:
      "दमकका शैक्षिक परामर्श व्यवसायीहरू “शैक्षिक परामर्श, भाषा शिक्षण र तयारी कक्षा सञ्चालन तथा व्यवस्थापन नियमावली, २०८३” विरुद्ध शान्तिपूर्ण विरोध र्‍यालीसहित सडकमा उत्रिएका छन्।",
    content: [
      "दमकका शैक्षिक परामर्श व्यवसायीहरू “शैक्षिक परामर्श, भाषा शिक्षण र तयारी कक्षा सञ्चालन तथा व्यवस्थापन नियमावली, २०८३” विरुद्ध शान्तिपूर्ण विरोध र्‍यालीसहित सडकमा उत्रिएका छन्।",
      "शैक्षिक परामर्श क्षेत्रको अस्तित्व, गुणस्तर, पारदर्शिता तथा विद्यार्थी हितको संरक्षण गर्दै सरोकारवालाहरूको साझा चासो, सुझाव र मागहरू सम्बन्धित निकायसमक्ष जिम्मेवारीपूर्वक पुर्‍याउने उद्देश्यले कार्यक्रम आयोजना गरिएको ECAN झापाका सचिव विशाल सिटौलाले बताए।",
      "व्यवसायीहरूका अनुसार सो नियमावलीमा परामर्श व्यवसायीहरूले २५ लाख रुपैयाँ धरौटी राख्नुपर्ने व्यवस्थाप्रति गम्भीर असहमति छ। उनीहरूले विद्यार्थी वा अभिभावकबाट विदेशका कलेजमा लाग्ने शुल्क लिँदै नलिने भएकाले त्यसको जिम्मेवारी परामर्श व्यवसायीहरूलाई जबर्जस्ती लादिनु न्यायसंगत नभएको बताएका छन्।",
    ],
    category: "province",
    categoryName: "राष्ट्रिय",
    tags: ["दमक", "झापा", "शैक्षिक परामर्श", "शिक्षा", "विरोध र्‍याली"],
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=650&fit=crop&q=80",
    imageCaption: "दमकमा शैक्षिक परामर्श व्यवसायीहरूद्वारा आयोजित शान्तिपूर्ण विरोध र्‍याली।",
    imagePhotographer: "सवाल नेपाल प्रतिनिधि",
    author: AUTHORS.kedar_adhikari,
    publishedAt: "2026-07-17T19:25:28+05:45",
    publishedAtBS: "२०८३ श्रावण १, शुक्रबार १७:२१ गते",
    isLeadStory: true,
    isBreaking: true,
    isTrending: true,
    viewsCount: 24890,
    readTimeMinutes: 4,
    provinceId: "koshi",
  },

  // 2. Koshi Province (प्रदेश १)
  {
    id: "art-265740",
    numericId: 265740,
    slug: "koshi-province-construction-companies-blacklisted",
    title: "कोशी प्रदेशका ४ सहित देशभरका ११ निर्माण कम्पनी कालो सूचीमा",
    subtitle: "समयमै काम सम्पन्न नगर्ने ठेकेदारहरूमाथि सार्वजनिक खरिद अनुगमन कार्यालयको कडा कारबाही",
    summary:
      "सार्वजनिक खरिद अनुगमन कार्यालयले विकास निर्माणका काम अलपत्र पार्ने कोशी प्रदेशका ४ सहित देशभरका ११ निर्माण कम्पनीलाई कालो सूचीमा राखेको छ।",
    content: [
      "विराटनगर — सार्वजनिक खरिद अनुगमन कार्यालयले सम्झौता बमोजिम काम सम्पन्न नगर्ने निर्माण कम्पनीहरूलाई कालो सूचीमा राखेको छ। जसअन्तर्गत कोशी प्रदेशका झापा, मोरङ र सुनसरीका चार निर्माण व्यवसायी परेका छन्।",
      "कार्यालयका अनुसार कालो सूचीमा परेका कम्पनीहरूले १ वर्षदेखि ३ वर्षसम्म सार्वजनिक निकायको कुनै पनि खरिद कारबाहीमा भाग लिन पाउने छैनन्।",
    ],
    category: "province",
    categoryName: "प्रदेश १",
    tags: ["कोशी", "विराटनगर", "निर्माण", "कालो सूची"],
    coverImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&h=650&fit=crop&q=80",
    imageCaption: "सडक तथा पूर्वाधार निर्माण कार्य।",
    author: AUTHORS.kedar_adhikari,
    publishedAt: "2026-07-16T10:30:00+05:45",
    publishedAtBS: "२०८३ असार ३२, बिहीबार",
    viewsCount: 13400,
    readTimeMinutes: 3,
    provinceId: "koshi",
  },

  // 3. Madhesh Province (प्रदेश २)
  {
    id: "art-265742",
    numericId: 265742,
    slug: "madhesh-province-janakpur-cultural-festival",
    title: "जनकपुरधाममा अन्तर्राष्ट्रिय मैथिली सांस्कृतिक महोत्सव शुरु",
    subtitle: "मधेशको मौलिक कला, साहित्य र मिथिला पेन्टिङको भव्य प्रदर्शनी",
    summary:
      "मधेश प्रदेशको राजधानी जनकपुरधाममा मिथिला कला, साहित्य र संस्कृतिको जगेर्ना गर्ने उद्देश्यले पाँच दिने अन्तर्राष्ट्रिय महोत्सव आयोजना गरिएको छ।",
    content: [
      "जनकपुरधाम — मधेश प्रदेश सरकार र स्थानीय सांस्कृतिक प्रतिष्ठानको संयुक्त आयोजनामा जानकी मन्दिर परिसरमा अन्तर्राष्ट्रिय मैथिली सांस्कृतिक महोत्सवको उद्घाटन भएको छ।",
      "महोत्सवमा नेपाल र भारतका सयौँ कलाकार, साहित्यकार तथा अनुसन्धानकर्ताहरूको सहभागिता रहेको छ। मिथिला भोजन, हस्तकला र मौलिक भेषभूषाका स्टलहरू आकर्षणको केन्द्र बनेका छन्।",
    ],
    category: "province",
    categoryName: "प्रदेश २",
    tags: ["मधेश", "जनकपुरधाम", "मिथिला", "संस्कृति"],
    coverImage: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&h=650&fit=crop&q=80",
    imageCaption: "जनकपुरधाम जानकी मन्दिर परिसरमा आयोजित सांस्कृतिक कार्यक्रम।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-07-15T09:00:00+05:45",
    publishedAtBS: "२०८३ असार ३१, बुधबार",
    viewsCount: 16700,
    readTimeMinutes: 3,
    provinceId: "madhesh",
  },

  // 4. Bagmati Province (वागमती)
  {
    id: "art-265744",
    numericId: 265744,
    slug: "bagmati-province-kathmandu-metro-beautification",
    title: "काठमाडौं उपत्यकामा सौन्दर्यीकरण र फुटपाथ व्यवस्थापनमा नयाँ रणनीति",
    subtitle: "पैदलयात्रीको अधिकार सुरक्षित गर्दै सडक व्यवस्थापनलाई प्राथमिकता",
    summary:
      "बागमती प्रदेशको राजधानी तथा काठमाडौं महानगरपालिकाले उपत्यकाका मुख्य सडकहरूमा हरियाली प्रवर्द्धन र फुटपाथ व्यवस्थित बनाउने अभियान तीव्र पारेको छ।",
    content: [
      "काठमाडौँ — महानगरपालिकाले सडक पेटीलाई पैदलयात्रीमैत्री बनाउन र व्यापारिक अतिक्रमण हटाउन विशेष टोली परिचालन गरेको छ।",
      "साथै नदी करिडोरहरूमा वृक्षारोपण र रात्रि बत्ती जडान गरी पर्यटकीय आकर्षण बढाउने योजना अघि बढाइएको छ।",
    ],
    category: "province",
    categoryName: "वागमती",
    tags: ["बागमती", "काठमाडौँ", "महानगर", "सडक"],
    coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&h=650&fit=crop&q=80",
    imageCaption: "काठमाडौँ उपत्यकाको दृश्य।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-07-14T15:20:00+05:45",
    publishedAtBS: "२०८३ असार ३०, मंगलबार",
    viewsCount: 22100,
    readTimeMinutes: 3,
    provinceId: "bagmati",
  },

  // 5. Gandaki Province (गण्डकी)
  {
    id: "art-265746",
    numericId: 265746,
    slug: "gandaki-province-pokhara-paragliding-tourism",
    title: "पोखरामा पर्यटन प्रवर्द्धन : फेवाताल र सराङकोटमा अन्तर्राष्ट्रिय साहसिक खेल महोत्सव",
    subtitle: "अन्नपूर्ण पदमार्ग र प्याराग्लाइडिङमा विदेशी पर्यटकको उत्साहजनक आगमन",
    summary:
      "गण्डकी प्रदेशको पर्यटकीय राजधानी पोखरामा नयाँ सिजनको सुरुवातसँगै आन्तरिक तथा बाह्य पर्यटकको चाप उल्लेख्य रूपमा बढेको छ।",
    content: [
      "पोखरा — गण्डकी प्रदेश पर्यटन बोर्डका अनुसार पोखरा अन्तर्राष्ट्रिय विमानस्थल सञ्चालन र प्याराग्लाइडिङ उडानहरू व्यवस्थित भएपछि होटल बुकिङ ८० प्रतिशतभन्दा माथि पुगेको छ।",
      "अन्नपूर्ण आधार शिविर जाने पदयात्रीहरूको संख्या समेत गत वर्षको तुलनामा २५ प्रतिशतले वृद्धि भएको जनाइएको छ।",
    ],
    category: "province",
    categoryName: "गण्डकी",
    tags: ["गण्डकी", "पोखरा", "पर्यटन", "फेवाताल"],
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=650&fit=crop&q=80",
    imageCaption: "पोखरा फेवाताल र माछापुच्छ्रे हिमाल।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-07-13T12:00:00+05:45",
    publishedAtBS: "२०८३ असार २९, सोमबार",
    viewsCount: 19800,
    readTimeMinutes: 3,
    provinceId: "gandaki",
  },

  // 6. Lumbini Province (प्रदेश ५ / लुम्बिनी)
  {
    id: "art-265748",
    numericId: 265748,
    slug: "lumbini-province-peace-corridor-development",
    title: "लुम्बिनीमा विश्व बौद्ध शान्ति करिडोर परियोजना सुरु",
    subtitle: "मायादेवी मन्दिर र कपिलवस्तु क्षेत्रलाई जोड्ने विद्युतीय यातायात सञ्जाल",
    summary:
      "भगवान बुद्धको जन्मस्थल लुम्बिनीलाई अन्तर्राष्ट्रिय शान्ति केन्द्रका रूपमा विकास गर्न नयाँ हरित करिडोर परियोजना अघि बढाइएको छ।",
    content: [
      "बुटवल — लुम्बिनी प्रदेश सरकार र लुम्बिनी विकास कोषले पवित्र उद्यान क्षेत्रको संरक्षण र तीर्थयात्रीलाई सहज सुविधा पुर्‍याउन वातावरणीय मैत्री विद्युतीय सवारी सञ्चालनमा ल्याएका छन्।",
      "गौतमबुद्ध अन्तर्राष्ट्रिय विमानस्थलबाट लुम्बिनीसम्म सिधा सडक सञ्जाल विस्तार गर्ने काम अन्तिम चरणमा पुगेको छ।",
    ],
    category: "province",
    categoryName: "प्रदेश ५",
    tags: ["लुम्बिनी", "बुद्ध", "शान्ति", "बुटवल"],
    coverImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&h=650&fit=crop&q=80",
    imageCaption: "लुम्बिनी मायादेवी मन्दिर परिसर।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-07-12T11:00:00+05:45",
    publishedAtBS: "२०८३ असार २८, आइतबार",
    viewsCount: 15400,
    readTimeMinutes: 3,
    provinceId: "lumbini",
  },

  // 7. Karnali Province (कर्णाली)
  {
    id: "art-265752",
    numericId: 265752,
    slug: "karnali-province-organic-apple-herb-processing",
    title: "कर्णालीमा जडीबुटी तथा अर्गानिक स्याउ प्रशोधन उद्योग स्थापना",
    subtitle: "जुम्ला, कालिकोट र मुगुका किसानलाई स्थानीय तहमै उचित मूल्य पाउने अवसर",
    summary:
      "कर्णाली प्रदेश सरकारको अनुदान सहयोगमा जुम्लामा आधुनिक शीतभण्डार र जडीबुटी प्रशोधन केन्द्र सञ्चालनमा आएको छ।",
    content: [
      "सुर्खेत — कर्णालीका हिमाली जिल्लाहरूमा उत्पादित अर्गानिक स्याउ र बहुमूल्य यार्सागुम्बा, पाँचऔँले जस्ता जडीबुटीलाई गुणस्तरीय प्याकेजिङ गरी राष्ट्रिय तथा अन्तर्राष्ट्रिय बजारमा पुर्‍याउन सुरु गरिएको छ।",
      "यसबाट स्थानीय किसानहरूको आयआर्जनमा उल्लेख्य सुधार आउने विश्वास लिइएको छ।",
    ],
    category: "province",
    categoryName: "कर्णाली",
    tags: ["कर्णाली", "जुम्ला", "स्याउ", "जडीबुटी"],
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=650&fit=crop&q=80",
    imageCaption: "कर्णालीको अर्गानिक कृषि उत्पादन।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-07-11T14:30:00+05:45",
    publishedAtBS: "२०८३ असार २७, शनिबार",
    viewsCount: 12800,
    readTimeMinutes: 3,
    provinceId: "karnali",
  },

  // 8. Sudurpashchim Province (सुदूरपश्चिम)
  {
    id: "art-265754",
    numericId: 265754,
    slug: "sudurpashchim-province-west-seti-hydro-project",
    title: "सुदूरपश्चिममा पश्चिम सेती जलविद्युत आयोजनाको कामले गति लियो",
    subtitle: "७५० मेगावाट क्षमताको राष्ट्रिय गौरवको आयोजनाबाट प्रदेशको मुहार फेरिने",
    summary:
      "सुदूरपश्चिम प्रदेशको आर्थिक समृद्धिको आधार मानिएको पश्चिम सेती जलविद्युत आयोजनाको निर्माण प्रक्रिया द्रुत गतिमा अघि बढेको छ।",
    content: [
      "धनगढी — लगानी बोर्ड र विकास साझेदारहरूबीच विस्तृत सम्झौता भएसँगै डोटी र डडेल्धुरा जोड्ने जलाशययुक्त आयोजनाको स्थलगत कार्य सुरु भएको छ।",
      "प्रदेश सरकारले स्थानीयलाई मुआब्जा वितरण र पुनर्वासको व्यवस्था पारदर्शी रूपमा गरिने जनाएको छ।",
    ],
    category: "province",
    categoryName: "सुदूरपश्चिम",
    tags: ["सुदूरपश्चिम", "धनगढी", "पश्चिम सेती", "जलविद्युत"],
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=650&fit=crop&q=80",
    imageCaption: "सुदूरपश्चिमको नदी तथा जलस्रोत।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-07-10T16:00:00+05:45",
    publishedAtBS: "२०८३ असार २६, शुक्रबार",
    viewsCount: 14700,
    readTimeMinutes: 3,
    provinceId: "sudurpashchim",
  },

  // 9. Economy - New Fiscal Year
  {
    id: "art-265734",
    numericId: 265734,
    slug: "new-fiscal-year-tax-policies",
    title: "नयाँ आर्थिक वर्ष शुरु : शिक्षा, स्वास्थ्य र बिजुलीमा पनि थप करको व्यवस्था लागू",
    subtitle: "आर्थिक ऐन २०८३ मार्फत नयाँ करका दरहरू कार्यान्वयनमा",
    summary:
      "नयाँ आर्थिक वर्षको पहिलो दिनदेखि सरकारले विभिन्न उपभोग्य तथा सामाजिक क्षेत्रमा नयाँ कर संरचना कार्यान्वयनमा ल्याएको छ।",
    content: [
      "काठमाडौँ — नयाँ आर्थिक वर्षको पहिलो दिनदेखि सरकारले ल्याएको बजेट र आर्थिक ऐनका विभिन्न नयाँ कर व्यवस्थाहरू औपचारिक रूपमा लागू भएका छन्।",
      "अर्थ मन्त्रालयका अनुसार आन्तरिक राजस्व संकलनलाई सुदृढ बनाउन र करको दायरा विस्तार गर्न यो कदम चालिएको हो।",
    ],
    category: "economy",
    categoryName: "अर्थ",
    tags: ["अर्थतन्त्र", "बजेट", "कर", "राजस्व", "स्वास्थ्य"],
    coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=650&fit=crop&q=80",
    imageCaption: "नयाँ आर्थिक वर्षको नीति तथा राजस्व कार्यान्वयन।",
    author: AUTHORS.swarnim_wagle,
    publishedAt: "2026-07-16T14:10:00+05:45",
    publishedAtBS: "२०८३ असार ३२, बिहीबार १४:१० गते",
    isSubLead: true,
    isPopular: true,
    popularRank: 4,
    viewsCount: 18450,
    readTimeMinutes: 3,
  },

  // 10. Economy - Gold Silver
  {
    id: "art-265732",
    numericId: 265732,
    slug: "gold-silver-price-updates",
    title: "आज सुनको भाउ बढ्यो, चाँदीको घट्यो",
    subtitle: "स्थानीय बजारमा सुन प्रतितोला १ हजार २ सय रुपैयाँले वृद्धि",
    summary:
      "नेपाली बजारमा आज सुनको मूल्यमा सामान्य वृद्धि भएको छ भने चाँदीको मूल्यमा केही गिरावट आएको छ।",
    content: [
      "काठमाडौँ — नेपाल सुनचाँदी व्यवसायी महासंघका अनुसार आज सुनको मूल्य तोलामा १ हजार २ सय रुपैयाँले बढेर प्रतितोला १ लाख ६२ हजार ५ सय रुपैयाँ पुगेको छ।",
      "त्यस्तै चाँदीको मूल्य भने तोलामा २० रुपैयाँले घटेर प्रतितोला १ हजार ९५० रुपैयाँमा कारोबार भइरहेको महासंघले जनाएको छ।",
    ],
    category: "economy",
    categoryName: "अर्थ",
    tags: ["सुनचाँदी", "बजार", "मूल्य", "नेपाल सुनचाँदी"],
    coverImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&h=650&fit=crop&q=80",
    imageCaption: "सुन तथा चाँदीका गरगहना।",
    author: AUTHORS.bikas_shrestha,
    publishedAt: "2026-07-15T11:00:00+05:45",
    publishedAtBS: "२०८३ असार ३१, बुधबार ११:०० गते",
    isSubLead: true,
    viewsCount: 14200,
    readTimeMinutes: 2,
  },

  // 11. Sports - England vs Argentina
  {
    id: "art-265727",
    numericId: 265727,
    slug: "england-vs-argentina-football-history",
    title: "इङ्ग्ल्यान्ड भर्सेस अर्जेन्टिना: कसले मार्ला बाजी? यस्तो छ इतिहास",
    subtitle: "फुटबल इतिहासका दुई चिरपरिचित प्रतिद्वन्द्वी फेरि भिड्दै",
    summary:
      "अन्तर्राष्ट्रिय फुटबलमा इङ्ग्ल्यान्ड र अर्जेन्टिनाबीचको प्रतिस्पर्धा सधैँ रोमाञ्चक र चर्चाको केन्द्रमा रहने गर्दछ।",
    content: [
      "विश्व फुटबलका दुई महारथी इङ्ग्ल्यान्ड र अर्जेन्टिनाबीचको खेल सधैँ ऐतिहासिक र तनावपूर्ण रहने गरेको छ। म्याराडोनाको चर्चित 'ह्यान्ड अफ गड' देखि डेभिड बेकह्यामको रातो कार्डसम्मका क्षणहरू फुटबल प्रेमीको मानसपटलमा अझै ताजा छन्।",
    ],
    category: "sports",
    categoryName: "खेलकुद",
    tags: ["फुटबल", "अर्जेन्टिना", "इङ्ग्ल्यान्ड", "विश्वकप", "खेल"],
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=650&fit=crop&q=80",
    imageCaption: "फुटबल मैदानमा खेलाडीहरू।",
    author: AUTHORS.rita_pandey,
    publishedAt: "2026-07-14T17:45:00+05:45",
    publishedAtBS: "२०८३ असार ३०, मंगलबार १७:४५ गते",
    isSubLead: true,
    viewsCount: 19800,
    readTimeMinutes: 4,
  },

  // 12. Lifestyle - 101 Ukhan Tukka
  {
    id: "art-115233",
    numericId: 115233,
    slug: "101-nepali-ukhan-tukka-collection",
    title: "१०१ नेपाली उखान टुक्का | COLLECTION OF 101 NEPALI “UKHAN-TUKKA”",
    subtitle: "नेपाली भाषा, साहित्य र जनजीवनमा प्रचलित लोकप्रिय उखान र तिनको अर्थ",
    summary:
      "नेपाली समाजमा पुस्तौँदेखि बोलीचालीमा प्रयोग हुँदै आएका १०१ मौलिक उखान टुक्काहरूको संग्रह र तिनको महत्त्व।",
    content: [
      "नेपाली उखान टुक्काहरू हाम्रो संस्कृति, जीवनशैली र लोकज्ञानका अनुपम ऐना हुन्।",
      "१. 'अगुल्टोले हानेको कुकुर बिजुली चम्किँदा तर्सन्छ' - एक पटक नराम्रो अनुभव भएको मानिस सानो घटनामा पनि डराउँछ।",
      "२. 'कागलाई बेल पाक्यो हर्ष न विस्मात' - आफूलाई सरोकार नभएको कुरामा कुनै प्रभाव नपर्नु।",
    ],
    category: "lifestyle",
    categoryName: "जीवनशैली",
    tags: ["उखान टुक्का", "नेपाली साहित्य", "संस्कृति", "ज्ञान"],
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=650&fit=crop&q=80",
    imageCaption: "नेपाली भाषा तथा साहित्यका अमूल्य उखान टुक्काहरू।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2024-04-12T12:00:00+05:45",
    publishedAtBS: "२०८१ वैशाख १, आइतबार",
    isPopular: true,
    popularRank: 1,
    viewsCount: 154800,
    readTimeMinutes: 6,
  },

  // 13. Strange World (विचित्र संसार)
  {
    id: "art-227943",
    numericId: 227943,
    slug: "unusual-places-in-the-world",
    title: "विश्वका अनौठा ठाउँहरू जहाँ विज्ञान पनि अचम्मित हुन्छ",
    subtitle: "प्रकृतिका रहस्यमयी आश्चर्यहरू जसले जोकोहीलाई चकित पार्छन्",
    summary:
      "विश्वभर त्यस्ता कयौँ रहस्यमयी भूभागहरू छन् जहाँ भौतिक विज्ञानका सामान्य नियमहरू पनि लागू हुँदैनन्।",
    content: [
      "पृथ्वीमा थुप्रै यस्ता स्थानहरू छन् जहाँ पानी उकालो बग्छ, चुम्बकीय पहाडले गाडी तान्छ वा ढुङ्गाहरू आफैँ हिँड्छन्।",
    ],
    category: "different-world",
    categoryName: "विचित्र संसार",
    tags: ["विचित्र संसार", "रहस्य", "विज्ञान", "अनौठा कुरा"],
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=650&fit=crop&q=80",
    imageCaption: "प्रकृतिका अनौठा रहस्यहरू।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-06-01T15:30:00+05:45",
    publishedAtBS: "२०८३ जेठ १८, सोमबार",
    viewsCount: 34500,
    readTimeMinutes: 4,
  },

  // 14. Religion & Culture (धर्म संस्कृति)
  {
    id: "art-265760",
    numericId: 265760,
    slug: "nepal-traditional-festivals-culture",
    title: "नेपाली मौलिक चाडपर्व र तिनको सांस्कृतिक महत्व",
    subtitle: "विविधतामा एकता झल्काउने हाम्रा परम्परा र रीतिथिति",
    summary:
      "नेपाल बहुसांस्कृतिक र बहुधार्मिक देश हो जहाँ हरेक चाडपर्वले सामाजिक सद्भाव र पारिवारिक एकतालाई मजबुत बनाउँछ।",
    content: [
      "नेपाली चाडपर्वहरू केवल पूजापाठ र रमाइलोमा मात्र सीमित छैनन्, यसले प्रकृति संरक्षण, पारिवारिक पुनर्मिलन र मानवीय मूल्यहरूको सन्देश समेत दिन्छ।",
    ],
    category: "religion",
    categoryName: "धर्म संस्कृति",
    tags: ["संस्कृति", "चाडपर्व", "परम्परा", "नेपाल"],
    coverImage: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&h=650&fit=crop&q=80",
    imageCaption: "नेपाली सांस्कृतिक अनुष्ठान।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-08-15T12:00:00+05:45",
    publishedAtBS: "२०८३ साउन ३१, शनिबार",
    viewsCount: 21300,
    readTimeMinutes: 4,
  },

  // 15. Technology (सूचना-प्रविधि)
  {
    id: "art-265770",
    numericId: 265770,
    slug: "telecom-special-data-voice-offers",
    title: "संविधान दिवसमा नेपाल टेलिकमको विशेष अफर : सहुलियत दरमा डेटा र भ्वाइस प्याक",
    subtitle: "सम्पूर्ण ग्राहकका लागि ५ जी परीक्षण र नयाँ अनलिमिटेड अफर सार्वजनिक",
    summary:
      "नेपाल टेलिकमले राष्ट्रिय दिवसको अवसर पारेर आफ्ना ग्राहकहरूका लागि आकर्षक दरमा इन्टरनेट डेटा र भ्वाइस प्याकेज ल्याएको छ।",
    content: [
      "काठमाडौँ — नेपाल टेलिकमले संविधान दिवसको अवसरमा विशेष छुट प्याकेज सार्वजनिक गरेको छ। जसअन्तर्गत प्रिपेड तथा पोस्टपेड ग्राहकहरूले सस्तो दरमा इन्टरनेट डेटा र अन-नेट भ्वाइस कल सुविधा उपभोग गर्न पाउनेछन्।",
    ],
    category: "tech",
    categoryName: "सूचना-प्रविधि",
    tags: ["प्रविधि", "टेलिकम", "इन्टरनेट", "डेटा"],
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=650&fit=crop&q=80",
    imageCaption: "सूचना प्रविधि र डिजिटल दूरसञ्चार सेवा।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-08-22T08:00:00+05:45",
    publishedAtBS: "२०८३ भदौ ६, शुक्रबार",
    viewsCount: 15400,
    readTimeMinutes: 3,
  },
  {
    id: "art-265772",
    numericId: 265772,
    slug: "telecom-authority-internet-pricing-guideline",
    title: "आफूखुसी इन्टरनेट शुल्क नबढाउन नेपाल दूरसञ्चार प्राधिकरणको निर्देशन",
    subtitle: "सेवा प्रदायकहरूले स्वीकृत दरभन्दा बढी शुल्क लिए कडा कारबाही हुने",
    summary:
      "नेपाल दूरसञ्चार प्राधिकरणले इन्टरनेट सेवा प्रदायकहरूलाई पूर्वस्वीकृति बिना शुल्क वृद्धि नगर्न चेतावनी दिएको छ।",
    content: [
      "काठमाडौँ — उपभोक्ताबाट अतिरिक्त शुल्क असुल गरिएको गुनासो आएपछि प्राधिकरणले सबै सेवा प्रदायकलाई सचेत गराएको हो।",
    ],
    category: "tech",
    categoryName: "सूचना-प्रविधि",
    tags: ["दूरसञ्चार", "इन्टरनेट", "प्राधिकरण", "नियमन"],
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=650&fit=crop&q=80",
    imageCaption: "इन्टरनेट तथा ब्रोडब्यान्ड नेटवर्क।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-08-21T13:00:00+05:45",
    publishedAtBS: "२०८३ भदौ ५, बिहीबार",
    viewsCount: 11200,
    readTimeMinutes: 2,
  },

  // 16. Politics (राजनीति)
  {
    id: "art-265780",
    numericId: 265780,
    slug: "parliament-session-key-bills-consensus",
    title: "संसद्को हिउँदे अधिवेशन : महत्वपूर्ण विधेयकहरूमाथि दलहरूबीच सहमति जुटाउने प्रयास",
    subtitle: "नागरिकता, संघीय निजामती र विद्यालय शिक्षा विधेयकलाई प्राथमिकता",
    summary:
      "प्रतिनिधिसभाको आगामी बैठकमा लामो समयदेखि विचाराधीन रहेका महत्वपूर्ण विधेयकहरू पारित गर्न संसदीय समितिहरू सक्रिय भएका छन्।",
    content: [
      "काठमाडौँ — संसद्मा प्रस्तुत भएका जनसरोकारका विधेयकहरूलाई छिटो टुंगोमा पुर्‍याउन सभामुखको पहलमा प्रमुख दलका सचेतकहरूसँग छलफल भएको छ।",
    ],
    category: "politics",
    categoryName: "राजनीति",
    tags: ["राजनीति", "संसद्", "विधेयक", "सिंहदरबार"],
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=650&fit=crop&q=80",
    imageCaption: "संसद् भवन नयाँ बानेश्वर।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-08-23T11:00:00+05:45",
    publishedAtBS: "२०८३ भदौ ७, शनिबार",
    viewsCount: 18900,
    readTimeMinutes: 3,
  },

  // 17. Entertainment (मनोरञ्जन)
  {
    id: "art-265785",
    numericId: 265785,
    slug: "nepali-cinema-global-market-expansion",
    title: "नेपाली चलचित्रको अन्तर्राष्ट्रिय बजार विस्तार : अस्ट्रेलिया र अमेरिकामा भव्य शो",
    subtitle: "मौलिक कथा र गुणस्तरीय छायांकनले डायस्पोरामा बढायो नेपाली सिनेमाको क्रेज",
    summary:
      "नेपाली चलचित्रहरूले स्वदेशमा मात्र नभई अन्तर्राष्ट्रिय बजारमा समेत हाउसफुल व्यापार गर्न सफल भएका छन्।",
    content: [
      "काठमाडौँ — पछिल्लो समय निर्माण भएका नेपाली कथानक चलचित्रहरूले विदेशमा रहेका नेपाली दर्शकहरूको मन जित्दै उत्साहजनक कमाइ गरिरहेका छन्।",
    ],
    category: "entertainment",
    categoryName: "मनोरञ्जन",
    tags: ["मनोरञ्जन", "चलचित्र", "सिनेमा", "कला"],
    coverImage: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1200&h=650&fit=crop&q=80",
    imageCaption: "सिनेमा हल र दर्शकीय माहोल।",
    author: AUTHORS.rita_pandey,
    publishedAt: "2026-08-24T16:00:00+05:45",
    publishedAtBS: "२०८३ भदौ ८, आइतबार",
    viewsCount: 23100,
    readTimeMinutes: 3,
  },

  // 18. Health (स्वास्थ्य)
  {
    id: "art-265790",
    numericId: 265790,
    slug: "nepal-hypertension-diabetes-prevention-advice",
    title: "नेपालमा उच्च रक्तचाप र मधुमेहका बिरामीको संख्या बढ्दो : सन्तुलित खानपान र व्यायाम आवश्यक",
    subtitle: "स्वास्थ्य विज्ञहरूद्वारा नियमित स्वास्थ्य परीक्षण र जीवनशैली सुधारमा जोड",
    summary:
      "सहरी क्षेत्रमा बदलिँदो खानपान र निष्क्रिय जीवनशैलीका कारण नसर्ने रोगहरूको जोखिम तीव्र रूपमा बढेको चिकित्सकहरूले औँल्याएका छन्।",
    content: [
      "काठमाडौँ — मुटुरोग विशेषज्ञहरूका अनुसार दैनिक व्यायाम, नुन र चिल्लो पदार्थको कम प्रयोग तथा तनाव व्यवस्थापनले उच्च रक्तचापबाट बच्न सकिन्छ।",
    ],
    category: "health",
    categoryName: "स्वास्थ्य",
    tags: ["स्वास्थ्य", "मुटु", "रक्तचाप", "चिकित्सा"],
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=650&fit=crop&q=80",
    imageCaption: "स्वास्थ्य परीक्षण तथा परामर्श।",
    author: AUTHORS.sawal_editorial,
    publishedAt: "2026-08-25T10:00:00+05:45",
    publishedAtBS: "२०८३ भदौ ९, सोमबार",
    viewsCount: 17600,
    readTimeMinutes: 3,
  },

  // 19. Opinion / Blog (विचार/ब्लग)
  {
    id: "art-265795",
    numericId: 265795,
    slug: "public-transportation-and-citizen-priorities",
    title: "किन हाम्रा नीति निर्माताहरू सार्वजनिक यातायात र नागरिक सरोकारमा गम्भीर छैनन् ?",
    subtitle: "सार्वजनिक यातायातको गुणस्तर सुधार नगरी सहरी समृद्धिको परिकल्पना सम्भव छैन",
    summary:
      "नागरिकले दैनिक भोग्नुपर्ने सास्ती, अस्तव्यस्त सडक र वातावरण प्रदूषण नियन्त्रण गर्न दीर्घकालीन रणनीतिको खाँचो छ।",
    content: [
      "सार्वजनिक यातायात कुनै पनि देशको सभ्यता र विकासको पहिलो ऐना हो। विकसित मुलुकहरूमा उच्च पदस्थ व्यक्तिहरू समेत मेट्रो र बसमा यात्रा गर्छन्, तर हाम्रो परिवेशमा अझै यसलाई उपेक्षा गरिएको छ।",
    ],
    category: "blog",
    categoryName: "विचार/ब्लग",
    tags: ["विचार", "विश्लेषण", "यातायात", "समाज"],
    coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=650&fit=crop&q=80",
    imageCaption: "सहरी यातायात र जनजीवन।",
    author: AUTHORS.swarnim_wagle,
    publishedAt: "2026-08-26T14:00:00+05:45",
    publishedAtBS: "२०८३ भदौ १०, मंगलबार",
    viewsCount: 28400,
    readTimeMinutes: 5,
  },
];

export const MOCK_VIDEOS: VideoStory[] = [
  {
    id: "vid-1",
    title: "दमकको समसामयिक विकास र शैक्षिक आन्दोलनबारे विशेष संवाद",
    thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=380&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "१२:४५",
    publishedAtBS: "३ दिन अघि",
    views: 45200,
    categoryName: "अन्तर्वार्ता",
  },
  {
    id: "vid-2",
    title: "नेपालको सेयर बजार र अर्थतन्त्रको दिशा : विज्ञ विश्लेषण",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=380&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "०८:२०",
    publishedAtBS: "५ दिन अघि",
    views: 32100,
    categoryName: "अर्थ संवाद",
  },
  {
    id: "vid-3",
    title: "विश्वकप फुटबलको इतिहास र यादगार क्षणहरू",
    thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=380&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "१५:१०",
    publishedAtBS: "१ हप्ता अघि",
    views: 68400,
    categoryName: "खेल विशेष",
  },
  {
    id: "vid-4",
    title: "नेपालका अनौठा प्राकृतिक आश्चर्यहरूको भिडियो वृत्तचित्र",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=380&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "१८:३०",
    publishedAtBS: "२ हप्ता अघि",
    views: 89300,
    categoryName: "विचित्र संसार",
  },
];

export const MOCK_PHOTO_GALLERIES: PhotoGalleryItem[] = [
  {
    id: "gal-1",
    title: "नेपालका हिमाल र प्राकृतिक सौन्दर्य",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop&q=80",
        caption: "माछापुच्छ्रे हिमालको दृश्य",
        photographer: "सवाल नेपाल",
      },
    ],
    publishedAtBS: "२०८३ भदौ",
    photosCount: 6,
  },
];

export const MOCK_FOREX_RATES: FinancialRate[] = [
  {
    currency: "USD",
    currencyName: "अमेरिकी डलर",
    unit: 1,
    buy: 134.2,
    sell: 134.8,
    symbol: "$",
  },
  {
    currency: "EUR",
    currencyName: "युरोपियन युरो",
    unit: 1,
    buy: 145.6,
    sell: 146.2,
    symbol: "€",
  },
];

export const MOCK_COMMODITIES: MarketCommodity[] = [
  {
    name: "छापावाल सुन",
    unit: "प्रतितोला",
    price: 162500,
    change: 1200,
  },
  {
    name: "तेजाबी सुन",
    unit: "प्रतितोला",
    price: 161800,
    change: 1200,
  },
  {
    name: "चाँदी",
    unit: "प्रतितोला",
    price: 1950,
    change: -20,
  },
];
