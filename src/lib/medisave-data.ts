export type VerificationStatus = "pending" | "under_review" | "verified" | "rejected";
export type MedicineType = "Tablet" | "Capsule" | "Syrup" | "Cream" | "Other";

export type Pharmacy = {
  id: string;
  pharmacyName: string;
  ownerName: string;
  contact: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  verificationStatus: VerificationStatus;
  rating: number;
  reviews: { author: string; rating: number; text: string }[];
  createdAt: string;
};

export type Medicine = {
  id: string;
  pharmacyId: string;
  medicineName: string;
  genericName: string;
  manufacturer: string;
  medicineType: MedicineType;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  prescriptionRequired: boolean;
  image: string;
  description: string;
  safetyInfo: string;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  pharmacyId: string;
  medicineId: string;
  quantity: number;
  totalPrice: number;
  orderStatus: "placed" | "confirmed" | "ready" | "collected" | "cancelled";
  createdAt: string;
};

export type Reminder = {
  id: string;
  userId: string;
  reminderType: string;
  reminderDate: string;
  language: "en" | "ta";
  status: "active" | "done";
};

const MED_IMG: Record<string, string> = {
  tablet:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=70",
  capsule:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=70",
  syrup:
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=70",
  cream:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=70",
  other:
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=70",
};

function monthsFromNow(m: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + m);
  return d.toISOString().slice(0, 10);
}
function monthsAgo(m: number) {
  return monthsFromNow(-m);
}

export const pharmacies: Pharmacy[] = [
  {
    id: "ph-1",
    pharmacyName: "Sri Balaji Medicals",
    ownerName: "R. Karthik",
    contact: "+91 98400 22110",
    email: "care@sribalajimedicals.in",
    address: "12, Gandhi Road, T. Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600017",
    verificationStatus: "verified",
    rating: 4.7,
    reviews: [
      { author: "Meena S.", rating: 5, text: "Genuine medicines and clear expiry labelling." },
      { author: "Arun P.", rating: 4, text: "Saved almost half on my monthly BP tablets." },
    ],
    createdAt: monthsAgo(14),
  },
  {
    id: "ph-2",
    pharmacyName: "LifeLine Pharmacy",
    ownerName: "S. Fathima",
    contact: "+91 99620 78455",
    email: "hello@lifelinepharmacy.in",
    address: "45, Anna Salai",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641018",
    verificationStatus: "verified",
    rating: 4.5,
    reviews: [{ author: "Vinoth K.", rating: 5, text: "Pharmacist explained the shelf life clearly." }],
    createdAt: monthsAgo(9),
  },
  {
    id: "ph-3",
    pharmacyName: "Green Cross Chemists",
    ownerName: "D. Ramesh",
    contact: "+91 90031 55420",
    email: "contact@greencrosschemists.in",
    address: "8, Bharathi Street, K.K. Nagar",
    city: "Madurai",
    state: "Tamil Nadu",
    pincode: "625020",
    verificationStatus: "verified",
    rating: 4.8,
    reviews: [{ author: "Lakshmi R.", rating: 5, text: "Affordable and always sealed packs." }],
    createdAt: monthsAgo(6),
  },
  {
    id: "ph-4",
    pharmacyName: "CityCare Drug House",
    ownerName: "M. Prakash",
    contact: "+91 93450 11223",
    email: "info@citycaredrug.in",
    address: "220, Trichy Main Road",
    city: "Salem",
    state: "Tamil Nadu",
    pincode: "636007",
    verificationStatus: "under_review",
    rating: 0,
    reviews: [],
    createdAt: monthsAgo(1),
  },
  {
    id: "ph-5",
    pharmacyName: "Anand Medicals",
    ownerName: "K. Anand",
    contact: "+91 96770 33418",
    email: "anand@anandmedicals.in",
    address: "3, Market Street",
    city: "Trichy",
    state: "Tamil Nadu",
    pincode: "620001",
    verificationStatus: "pending",
    rating: 0,
    reviews: [],
    createdAt: monthsAgo(0),
  },
];

type Seed = [string, string, string, MedicineType, number, number, boolean, number, string, string];

const seeds: Seed[] = [
  ["Paracetamol 500mg", "Paracetamol", "ABC Pharma", "Tablet", 50, 25, false, 3, "ph-1", "Used for fever and mild pain relief."],
  ["Amoxicillin 250mg", "Amoxicillin", "Cipla", "Capsule", 120, 66, true, 4, "ph-1", "Antibiotic capsule. Complete the full course as advised."],
  ["Cetirizine 10mg", "Cetirizine HCl", "Sun Pharma", "Tablet", 40, 16, false, 2, "ph-2", "Antihistamine for allergy symptoms."],
  ["Metformin 500mg", "Metformin HCl", "USV", "Tablet", 90, 45, true, 5, "ph-2", "Used in the management of type 2 diabetes."],
  ["Cough Relief Syrup", "Dextromethorphan", "Dr. Reddy's", "Syrup", 110, 55, false, 6, "ph-3", "Soothes dry cough. Shake well before use."],
  ["Amlodipine 5mg", "Amlodipine Besylate", "Torrent", "Tablet", 75, 30, true, 2, "ph-3", "Used for high blood pressure."],
  ["Clotrimazole Cream", "Clotrimazole", "Glenmark", "Cream", 95, 48, false, 7, "ph-1", "Topical antifungal cream for external use only."],
  ["Pantoprazole 40mg", "Pantoprazole Sodium", "Alkem", "Tablet", 130, 59, true, 3, "ph-2", "Reduces stomach acid production."],
  ["Vitamin D3 60K", "Cholecalciferol", "Mankind", "Capsule", 85, 34, false, 8, "ph-3", "Weekly vitamin D supplement."],
  ["ORS Powder", "Oral Rehydration Salts", "FDC", "Other", 25, 12, false, 5, "ph-1", "Restores fluids and electrolytes."],
  ["Azithromycin 500mg", "Azithromycin", "Zydus", "Tablet", 160, 72, true, 2, "ph-3", "Antibiotic. Use only under prescription."],
  ["Ibuprofen 400mg", "Ibuprofen", "Abbott", "Tablet", 60, 27, false, 4, "ph-2", "Anti-inflammatory pain relief tablet."],
  ["Iron + Folic Acid", "Ferrous Ascorbate", "Emcure", "Tablet", 145, 65, false, 9, "ph-1", "Supplement for iron deficiency anaemia."],
  ["Salbutamol Syrup", "Salbutamol", "Cipla", "Syrup", 70, 31, true, 3, "ph-3", "Bronchodilator syrup for breathing relief."],
  ["Calamine Lotion", "Calamine", "Nivea Health", "Cream", 55, 22, false, 10, "ph-2", "Soothes skin irritation. External use only."],
  ["Montelukast 10mg", "Montelukast Sodium", "Lupin", "Tablet", 180, 79, true, 6, "ph-1", "Used for asthma and allergic rhinitis."],
];

export const medicines: Medicine[] = seeds.map(
  ([name, generic, mfr, type, mrp, price, rx, monthsLeft, phId, desc], i) => ({
    id: `med-${i + 1}`,
    pharmacyId: phId,
    medicineName: name,
    genericName: generic,
    manufacturer: mfr,
    medicineType: type,
    batchNumber: `B${2026}${String(i + 11).padStart(3, "0")}`,
    manufacturingDate: monthsAgo(24 - monthsLeft),
    expiryDate: monthsFromNow(monthsLeft),
    quantity: 12 + ((i * 7) % 60),
    originalPrice: mrp,
    discountedPrice: price,
    prescriptionRequired: rx,
    image: MED_IMG[type.toLowerCase()] ?? MED_IMG["other"]!,
    description: desc,
    safetyInfo:
      "Store below 25°C in a dry place, away from direct sunlight and out of reach of children. Check the seal and expiry date on the pack before use. Consult a doctor or pharmacist if you are pregnant, breastfeeding, or taking other medicines.",
    createdAt: monthsAgo((i % 5) * 0.4),
  }),
);

export const seedOrders: Order[] = [
  {
    id: "ord-1001",
    userId: "demo-user",
    userName: "Divya R.",
    pharmacyId: "ph-1",
    medicineId: "med-1",
    quantity: 2,
    totalPrice: 50,
    orderStatus: "collected",
    createdAt: monthsAgo(0.25),
  },
  {
    id: "ord-1002",
    userId: "demo-user",
    userName: "Divya R.",
    pharmacyId: "ph-2",
    medicineId: "med-4",
    quantity: 1,
    totalPrice: 45,
    orderStatus: "ready",
    createdAt: monthsAgo(0.1),
  },
  {
    id: "ord-1003",
    userId: "user-2",
    userName: "Suresh M.",
    pharmacyId: "ph-3",
    medicineId: "med-6",
    quantity: 3,
    totalPrice: 90,
    orderStatus: "placed",
    createdAt: monthsAgo(0.05),
  },
];

/* ---------- helpers ---------- */

export function daysUntil(dateStr: string) {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

export type ShelfStatus = "expired" | "expiring" | "available";

export function shelfStatus(expiryDate: string): ShelfStatus {
  const d = daysUntil(expiryDate);
  if (d <= 0) return "expired";
  if (d <= 90) return "expiring";
  return "available";
}

export function shelfLifeLabel(expiryDate: string, lang: "en" | "ta") {
  const d = daysUntil(expiryDate);
  if (d <= 0) return lang === "ta" ? "காலாவதியானது" : "Expired";
  if (d < 60) return `${d} ${lang === "ta" ? "நாட்கள்" : "days"}`;
  const m = Math.round(d / 30);
  return `${m} ${lang === "ta" ? "மாதங்கள்" : "months"}`;
}

export function discountPercent(original: number, discounted: number) {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export function formatMonthYear(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function rupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function getPharmacy(id: string) {
  return pharmacies.find((p) => p.id === id);
}