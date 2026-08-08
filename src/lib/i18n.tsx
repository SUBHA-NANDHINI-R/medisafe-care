import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ta";

type Dict = Record<string, { en: string; ta: string }>;

export const dict: Dict = {
  brand: { en: "MediSave", ta: "மெடிசேவ்" },
  tagline: {
    en: "Affordable Medicines. Trusted Pharmacies. Better Access.",
    ta: "மலிவான மருந்துகள். நம்பகமான மருந்தகங்கள். சிறந்த அணுகல்.",
  },
  heroIntro: {
    en: "Find genuine medicines from verified pharmacies at affordable prices, especially medicines with shorter remaining shelf life.",
    ta: "சரிபார்க்கப்பட்ட மருந்தகங்களிலிருந்து உண்மையான மருந்துகளை மலிவான விலையில் கண்டறியுங்கள் — குறிப்பாக குறைந்த கால அவகாசம் உள்ள மருந்துகள்.",
  },
  getStarted: { en: "Get Started", ta: "தொடங்குங்கள்" },
  login: { en: "Login", ta: "உள்நுழைவு" },
  signup: { en: "Sign Up", ta: "பதிவு செய்க" },
  logout: { en: "Logout", ta: "வெளியேறு" },
  home: { en: "Home", ta: "முகப்பு" },
  medicines: { en: "Medicines", ta: "மருந்துகள்" },
  pharmacies: { en: "Pharmacies", ta: "மருந்தகங்கள்" },
  orders: { en: "Orders", ta: "ஆர்டர்கள்" },
  profile: { en: "Profile", ta: "சுயவிவரம்" },
  search: { en: "Search", ta: "தேடல்" },
  aiFollowUp: { en: "AI Follow-Up", ta: "AI பின்தொடர்தல்" },
  language: { en: "Language", ta: "மொழி" },
  dashboard: { en: "Dashboard", ta: "டாஷ்போர்டு" },
  admin: { en: "Admin", ta: "நிர்வாகம்" },

  ctaFind: { en: "Find Affordable Medicines", ta: "மலிவான மருந்துகளைக் கண்டறியுங்கள்" },
  ctaRegisterPharmacy: { en: "Register Your Pharmacy", ta: "உங்கள் மருந்தகத்தைப் பதிவு செய்யுங்கள்" },
  searchPlaceholder: {
    en: "Search by medicine, generic name, manufacturer or pharmacy",
    ta: "மருந்து, பொதுப் பெயர், தயாரிப்பாளர் அல்லது மருந்தகம் மூலம் தேடுங்கள்",
  },

  howItWorks: { en: "How MediSave Works", ta: "மெடிசேவ் எவ்வாறு செயல்படுகிறது" },
  forPatients: { en: "For Patients", ta: "நோயாளிகளுக்கு" },
  forPharmacies: { en: "For Pharmacies", ta: "மருந்தகங்களுக்கு" },
  whyChoose: { en: "Why Choose MediSave", ta: "ஏன் மெடிசேவ்" },
  safety: { en: "Safety & Verification", ta: "பாதுகாப்பு & சரிபார்ப்பு" },
  faq: { en: "Frequently Asked Questions", ta: "அடிக்கடி கேட்கப்படும் கேள்விகள்" },
  contact: { en: "Contact Us", ta: "எங்களை தொடர்பு கொள்ள" },
  affordableMedicines: { en: "Affordable Medicines", ta: "மலிவான மருந்துகள்" },
  verifiedPharmacies: { en: "Verified Pharmacies", ta: "சரிபார்க்கப்பட்ட மருந்தகங்கள்" },
  howItHelps: { en: "How It Helps People", ta: "இது மக்களுக்கு எப்படி உதவுகிறது" },
  nearYou: { en: "Affordable Medicines Near You", ta: "உங்கள் அருகில் மலிவான மருந்துகள்" },

  whoAreYou: { en: "Who are you?", ta: "நீங்கள் யார்?" },
  patient: { en: "People / Patients", ta: "மக்கள் / நோயாளிகள்" },
  patientDesc: {
    en: "Find affordable medicines from verified pharmacies.",
    ta: "சரிபார்க்கப்பட்ட மருந்தகங்களிலிருந்து மலிவான மருந்துகளைக் கண்டறியுங்கள்.",
  },
  pharmacyOwner: { en: "Pharmacy Owner", ta: "மருந்தக உரிமையாளர்" },
  pharmacyOwnerDesc: {
    en: "List eligible medicines and reach people looking for affordable options.",
    ta: "தகுதியான மருந்துகளை பட்டியலிட்டு, மலிவான தேர்வுகளைத் தேடும் மக்களை அடையுங்கள்.",
  },
  continue: { en: "Continue", ta: "தொடரவும்" },
  selectRoleFirst: { en: "Please select a role to continue.", ta: "தொடர ஒரு பங்கைத் தேர்ந்தெடுக்கவும்." },

  fullName: { en: "Full Name", ta: "முழு பெயர்" },
  mobile: { en: "Mobile Number", ta: "கைபேசி எண்" },
  email: { en: "Email", ta: "மின்னஞ்சல்" },
  password: { en: "Password", ta: "கடவுச்சொல்" },
  confirmPassword: { en: "Confirm Password", ta: "கடவுச்சொல்லை உறுதிப்படுத்தவும்" },
  aadhaarVerification: { en: "Aadhaar Verification", ta: "ஆதார் சரிபார்ப்பு" },
  aadhaarNumber: { en: "Aadhaar Number", ta: "ஆதார் எண்" },
  sendOtp: { en: "Send OTP", ta: "OTP அனுப்பவும்" },
  enterOtp: { en: "Enter 6-digit OTP", ta: "6 இலக்க OTP ஐ உள்ளிடவும்" },
  verify: { en: "Verify", ta: "சரிபார்க்கவும்" },
  identityVerified: { en: "Your identity has been verified.", ta: "உங்கள் அடையாளம் சரிபார்க்கப்பட்டது." },
  createAccount: { en: "Create Account", ta: "கணக்கை உருவாக்கவும்" },
  alreadyHaveAccount: { en: "Already have an account?", ta: "ஏற்கனவே கணக்கு உள்ளதா?" },

  pharmacyName: { en: "Pharmacy Name", ta: "மருந்தக பெயர்" },
  ownerName: { en: "Owner Name", ta: "உரிமையாளர் பெயர்" },
  contactNumber: { en: "Contact Number", ta: "தொடர்பு எண்" },
  address: { en: "Complete Pharmacy Address", ta: "முழு மருந்தக முகவரி" },
  city: { en: "City", ta: "நகரம்" },
  state: { en: "State", ta: "மாநிலம்" },
  pincode: { en: "Pincode", ta: "அஞ்சல் குறியீடு" },
  licenseUpload: { en: "Pharmacy License / Approved Document", ta: "மருந்தக உரிமம் / அங்கீகரிக்கப்பட்ட ஆவணம்" },
  verificationStatus: { en: "Verification Status", ta: "சரிபார்ப்பு நிலை" },
  pending: { en: "Pending Verification", ta: "சரிபார்ப்பு நிலுவையில்" },
  underReview: { en: "Under Review", ta: "மதிப்பாய்வில் உள்ளது" },
  verified: { en: "Verified", ta: "சரிபார்க்கப்பட்டது" },
  rejected: { en: "Rejected", ta: "நிராகரிக்கப்பட்டது" },
  verifiedPharmacy: { en: "Verified Pharmacy", ta: "சரிபார்க்கப்பட்ட மருந்தகம்" },

  overview: { en: "Overview", ta: "மேலோட்டம்" },
  addMedicine: { en: "Add Medicine", ta: "மருந்தைச் சேர்" },
  myMedicines: { en: "My Medicines", ta: "எனது மருந்துகள்" },
  inventory: { en: "Inventory", ta: "சரக்கு" },
  notifications: { en: "Notifications", ta: "அறிவிப்புகள்" },
  activeMedicines: { en: "Active Medicines", ta: "செயலில் உள்ள மருந்துகள்" },
  expiringSoon: { en: "Expiring Soon", ta: "விரைவில் காலாவதி" },
  ordersReceived: { en: "Orders Received", ta: "பெறப்பட்ட ஆர்டர்கள்" },
  totalSales: { en: "Total Sales", ta: "மொத்த விற்பனை" },
  expired: { en: "Expired", ta: "காலாவதியானது" },
  available: { en: "Available", ta: "கிடைக்கிறது" },

  medicineName: { en: "Medicine Name", ta: "மருந்தின் பெயர்" },
  genericName: { en: "Generic Name", ta: "பொதுப் பெயர்" },
  manufacturer: { en: "Manufacturer", ta: "தயாரிப்பாளர்" },
  medicineType: { en: "Medicine Type", ta: "மருந்து வகை" },
  batchNumber: { en: "Batch Number", ta: "தொகுதி எண்" },
  mfgDate: { en: "Manufacturing Date", ta: "தயாரிப்பு தேதி" },
  expiryDate: { en: "Expiry Date", ta: "காலாவதி தேதி" },
  quantity: { en: "Available Quantity", ta: "கிடைக்கும் அளவு" },
  originalPrice: { en: "Original Price", ta: "அசல் விலை" },
  discountedPrice: { en: "Discounted Price", ta: "தள்ளுபடி விலை" },
  prescriptionRequired: { en: "Prescription Required", ta: "மருத்துவ சீட்டு தேவை" },
  noPrescription: { en: "No Prescription Needed", ta: "மருத்துவ சீட்டு தேவையில்லை" },
  medicineImage: { en: "Medicine Image", ta: "மருந்து படம்" },
  description: { en: "Additional Description", ta: "கூடுதல் விவரம்" },
  shelfLife: { en: "Remaining shelf life", ta: "மீதமுள்ள கால அவகாசம்" },
  mrp: { en: "MRP", ta: "அதிகபட்ச விலை" },
  medisavePrice: { en: "MediSave Price", ta: "மெடிசேவ் விலை" },
  off: { en: "OFF", ta: "தள்ளுபடி" },
  viewDetails: { en: "View Details", ta: "விவரங்களைக் காண" },
  save: { en: "Save", ta: "சேமி" },
  saved: { en: "Saved medicines", ta: "சேமித்த மருந்துகள்" },
  order: { en: "Place Order", ta: "ஆர்டர் செய்யவும்" },
  yes: { en: "Yes", ta: "ஆம்" },
  no: { en: "No", ta: "இல்லை" },
  months: { en: "months", ta: "மாதங்கள்" },
  days: { en: "days", ta: "நாட்கள்" },

  filters: { en: "Filters", ta: "வடிகட்டிகள்" },
  priceRange: { en: "Price range", ta: "விலை வரம்பு" },
  minDiscount: { en: "Minimum discount", ta: "குறைந்தபட்ச தள்ளுபடி" },
  expiryPeriod: { en: "Expiry period", ta: "காலாவதி காலம்" },
  location: { en: "Location", ta: "இடம்" },
  sortBy: { en: "Sort by", ta: "வரிசைப்படுத்து" },
  lowestPrice: { en: "Lowest Price", ta: "குறைந்த விலை" },
  highestDiscount: { en: "Highest Discount", ta: "அதிக தள்ளுபடி" },
  nearestExpiry: { en: "Nearest Expiry", ta: "அருகில் காலாவதி" },
  newestListed: { en: "Newest Listed", ta: "புதிதாக பட்டியலிடப்பட்டது" },
  clearFilters: { en: "Clear filters", ta: "வடிகட்டிகளை அழி" },
  noResults: { en: "No medicines match your search.", ta: "உங்கள் தேடலுக்கு மருந்துகள் இல்லை." },

  safetyInfo: { en: "Safety Information", ta: "பாதுகாப்பு தகவல்" },
  expiryWarning: {
    en: "Please check the expiry date before purchase.",
    ta: "வாங்குவதற்கு முன் காலாவதி தேதியைச் சரிபார்க்கவும்.",
  },
  disclaimer: {
    en: "MediSave is a marketplace and information platform. It does not replace advice from a qualified doctor or pharmacist.",
    ta: "மெடிசேவ் ஒரு சந்தை மற்றும் தகவல் தளம் மட்டுமே. இது தகுதியான மருத்துவர் அல்லது மருந்தாளரின் ஆலோசனையை மாற்றாது.",
  },
  aiTitle: { en: "MediSave AI Follow-Up", ta: "மெடிசேவ் AI பின்தொடர்தல்" },
  aiSub: {
    en: "Reminders and general medicine information. Not medical advice.",
    ta: "நினைவூட்டல்கள் மற்றும் பொதுவான மருந்து தகவல். மருத்துவ ஆலோசனை அல்ல.",
  },
  aiPlaceholder: { en: "Ask about reminders or your medicines…", ta: "நினைவூட்டல் அல்லது மருந்துகள் பற்றி கேளுங்கள்…" },
  send: { en: "Send", ta: "அனுப்பு" },
  reminders: { en: "Reminders", ta: "நினைவூட்டல்கள்" },
  addReminder: { en: "Create reminder", ta: "நினைவூட்டலை உருவாக்கு" },
  followUpHistory: { en: "Follow-up history", ta: "பின்தொடர்தல் வரலாறு" },
  required: { en: "This field is required.", ta: "இந்த புலம் தேவை." },
  invalid: { en: "Please enter a valid value.", ta: "சரியான மதிப்பை உள்ளிடவும்." },
  recommended: { en: "Recommended affordable medicines", ta: "பரிந்துரைக்கப்பட்ட மலிவான மருந்துகள்" },
  browse: { en: "Browse medicines", ta: "மருந்துகளை உலாவு" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict | string) => string;
  tx: (en: string, ta: string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("medisave:lang");
    if (stored === "ta" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("medisave:lang", l);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => dict[key as string]?.[lang] ?? (key as string),
      tx: (en, ta) => (lang === "ta" ? ta : en),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}