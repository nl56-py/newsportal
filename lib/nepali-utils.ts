import { ProvinceId, ProvinceInfo } from "./types";

// Nepali Unicode numerals
export const NEPALI_DIGITS: { [key: string]: string } = {
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

// Convert English numbers or strings with digits to Nepali Unicode numerals
export function toNepaliDigits(input: string | number): string {
  if (input === undefined || input === null) return "";
  return String(input).replace(/[0-9]/g, (digit) => NEPALI_DIGITS[digit] || digit);
}

// Convert Nepali Unicode numerals back to English numbers
export function toEnglishDigits(input: string): string {
  if (!input) return "";
  const reversed: { [key: string]: string } = {
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
  };
  return input.replace(/[०-९]/g, (d) => reversed[d] || d);
}

export const BS_MONTH_NAMES_NEPALI = [
  "वैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कात्तिक",
  "मङ्सिर",
  "पुस",
  "माघ",
  "फागुन",
  "चैत",
];

export const BS_MONTH_NAMES_ENGLISH = [
  "Baishakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const NEPALI_DAYS = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहीबार",
  "शुक्रबार",
  "शनिबार",
];

export const NEPALI_DAYS_SHORT = ["आइत", "सोम", "मंग", "बुध", "बिही", "शुक्र", "शनि"];

export const ENGLISH_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Calendar Conversion Table for Bikram Sambat (2070 - 2085 BS)
 * Days in each month for each Bikram Sambat year starting from Baishakh to Chaitra
 */
const BS_CALENDAR_DATA: { [year: number]: number[] } = {
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2081: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 29, 31],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
};

// Reference point: 2081 Baishakh 1 is equal to 2024 April 13 Saturday
const REF_BS_YEAR = 2081;
const REF_AD_DATE = new Date(Date.UTC(2024, 3, 13)); // 2024-04-13

export interface BSDateResult {
  year: number;
  month: number; // 1-12
  day: number; // 1-32
  dayOfWeek: number; // 0-6 (0 = Sunday)
  monthNameNepali: string;
  monthNameEnglish: string;
  dayNameNepali: string;
  dayNameEnglish: string;
  formattedNepali: string; // e.g. "शनिबार, १३ भदौ २०८१"
  formattedEnglish: string; // e.g. "Saturday, 13 Bhadra 2081"
}

/**
 * Converts AD Date to Bikram Sambat (BS)
 */
export function getBikramSambatDate(adDateInput: Date | string = new Date()): BSDateResult {
  const adDate = typeof adDateInput === "string" ? new Date(adDateInput) : adDateInput;
  
  // Calculate total days difference from reference point
  const targetUtc = Date.UTC(adDate.getFullYear(), adDate.getMonth(), adDate.getDate());
  const refUtc = REF_AD_DATE.getTime();
  const diffDays = Math.floor((targetUtc - refUtc) / (1000 * 60 * 60 * 24));

  let currentBsYear = REF_BS_YEAR;
  let currentBsMonth = 0; // 0-indexed (0 = Baishakh)
  let currentBsDay = 1;

  if (diffDays >= 0) {
    let remainingDays = diffDays;
    while (remainingDays > 0) {
      const yearMonths = BS_CALENDAR_DATA[currentBsYear] || [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30];
      const daysInCurrentMonth = yearMonths[currentBsMonth];
      const daysLeftInMonth = daysInCurrentMonth - currentBsDay + 1;

      if (remainingDays >= daysLeftInMonth) {
        remainingDays -= daysLeftInMonth;
        currentBsDay = 1;
        currentBsMonth++;
        if (currentBsMonth > 11) {
          currentBsMonth = 0;
          currentBsYear++;
        }
      } else {
        currentBsDay += remainingDays;
        remainingDays = 0;
      }
    }
  } else {
    let remainingDays = Math.abs(diffDays);
    while (remainingDays > 0) {
      if (currentBsDay > remainingDays) {
        currentBsDay -= remainingDays;
        remainingDays = 0;
      } else {
        remainingDays -= currentBsDay;
        currentBsMonth--;
        if (currentBsMonth < 0) {
          currentBsMonth = 11;
          currentBsYear--;
        }
        const yearMonths = BS_CALENDAR_DATA[currentBsYear] || [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30];
        currentBsDay = yearMonths[currentBsMonth];
      }
    }
  }

  const dayOfWeek = adDate.getDay();
  const monthNepali = BS_MONTH_NAMES_NEPALI[currentBsMonth];
  const monthEnglish = BS_MONTH_NAMES_ENGLISH[currentBsMonth];
  const dayNepali = NEPALI_DAYS[dayOfWeek];
  const dayEnglish = ENGLISH_DAYS[dayOfWeek];

  const formattedNepali = `${dayNepali}, ${toNepaliDigits(currentBsDay)} ${monthNepali} ${toNepaliDigits(currentBsYear)}`;
  const formattedEnglish = `${dayEnglish}, ${currentBsDay} ${monthEnglish} ${currentBsYear}`;

  return {
    year: currentBsYear,
    month: currentBsMonth + 1,
    day: currentBsDay,
    dayOfWeek,
    monthNameNepali: monthNepali,
    monthNameEnglish: monthEnglish,
    dayNameNepali: dayNepali,
    dayNameEnglish: dayEnglish,
    formattedNepali,
    formattedEnglish,
  };
}

/**
 * Format full BS Date in Nepali e.g. "१४ भदौ २०८३, आइतबार"
 */
export function formatNepaliDateBS(date: Date | string = new Date()): string {
  const bs = getBikramSambatDate(date);
  return `${toNepaliDigits(bs.day)} ${bs.monthNameNepali} ${toNepaliDigits(bs.year)}, ${bs.dayNameNepali}`;
}

/**
 * Format relative time in Nepali (e.g. "५ मिनेट अगाडि", "२ घण्टा अगाडि")
 */
export function getNepaliRelativeTime(publishedAt: string | Date): string {
  const date = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "भर्खरै";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${toNepaliDigits(diffInMinutes)} मिनेट अगाडि`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${toNepaliDigits(diffInHours)} घण्टा अगाडि`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${toNepaliDigits(diffInDays)} दिन अगाडि`;
  }

  const bs = getBikramSambatDate(date);
  return `${toNepaliDigits(bs.day)} ${bs.monthNameNepali} ${toNepaliDigits(bs.year)}`;
}

/**
 * Format number with Nepali comma separation (Lakh / Crore) and Devanagari numerals
 */
export function formatNepaliNumber(num: number): string {
  const parts = num.toString().split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Indian/Nepali numbering system: last 3 digits, then groups of 2
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + decimalPart;

  return toNepaliDigits(formatted);
}

/**
 * Province Information Directory
 */
export const PROVINCES: ProvinceInfo[] = [
  { id: "koshi", code: 1, nameNepali: "कोशी प्रदेश", nameEnglish: "Koshi Province", capital: "विराटनगर" },
  { id: "madhesh", code: 2, nameNepali: "मधेश प्रदेश", nameEnglish: "Madhesh Province", capital: "जनकपुरधाम" },
  { id: "bagmati", code: 3, nameNepali: "बागमती प्रदेश", nameEnglish: "Bagmati Province", capital: "हेटौंडा" },
  { id: "gandaki", code: 4, nameNepali: "गण्डकी प्रदेश", nameEnglish: "Gandaki Province", capital: "पोखरा" },
  { id: "lumbini", code: 5, nameNepali: "लुम्बिनी प्रदेश", nameEnglish: "Lumbini Province", capital: "देउखुरी" },
  { id: "karnali", code: 6, nameNepali: "कर्णाली प्रदेश", nameEnglish: "Karnali Province", capital: "वीरेन्द्रनगर" },
  { id: "sudurpashchim", code: 7, nameNepali: "सुदूरपश्चिम प्रदेश", nameEnglish: "Sudurpashchim Province", capital: "गोदावरी" },
];

export function getProvinceById(id: ProvinceId | string): ProvinceInfo | undefined {
  return PROVINCES.find((p) => p.id === id);
}

/**
 * Category translation helper
 */
export const CATEGORY_MAP: { [key: string]: { nameNepali: string; path: string } } = {
  samachar: { nameNepali: "समाचार", path: "/category/samachar" },
  bichar: { nameNepali: "विचार", path: "/category/bichar" },
  artha: { nameNepali: "अर्थ", path: "/category/artha" },
  rajniti: { nameNepali: "राजनीति", path: "/category/rajniti" },
  khelkud: { nameNepali: "खेलकुद", path: "/category/khelkud" },
  manoranjan: { nameNepali: "मनोरञ्जन", path: "/category/manoranjan" },
  pradesh: { nameNepali: "प्रदेश", path: "/category/pradesh" },
  bishwa: { nameNepali: "विश्व", path: "/category/bishwa" },
  prawidhi: { nameNepali: "प्रविधि", path: "/category/prawidhi" },
  blog: { nameNepali: "ब्लग", path: "/category/blog" },
  multimedia: { nameNepali: "फोटो/भिडियो", path: "/category/multimedia" },
};
