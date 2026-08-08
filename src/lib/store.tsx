import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  medicines as seedMedicines,
  pharmacies as seedPharmacies,
  seedOrders,
  type Medicine,
  type Order,
  type Pharmacy,
  type Reminder,
  type VerificationStatus,
} from "./medisave-data";

export type Role = "patient" | "pharmacy" | "admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  aadhaarMasked?: string;
  pharmacyId?: string;
};

type State = {
  user: SessionUser | null;
  medicines: Medicine[];
  pharmacies: Pharmacy[];
  orders: Order[];
  saved: string[];
  reminders: Reminder[];
};

type Ctx = State & {
  login: (user: SessionUser) => void;
  logout: () => void;
  addMedicine: (m: Medicine) => void;
  removeMedicine: (id: string) => void;
  addPharmacy: (p: Pharmacy) => void;
  setPharmacyStatus: (id: string, status: VerificationStatus) => void;
  placeOrder: (o: Order) => void;
  toggleSaved: (id: string) => void;
  addReminder: (r: Reminder) => void;
  completeReminder: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);
const KEY = "medisave:state:v1";

const initialState: State = {
  user: null,
  medicines: seedMedicines,
  pharmacies: seedPharmacies,
  orders: seedOrders,
  saved: ["med-3"],
  reminders: [],
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((s) => ({ ...s, ...parsed }));
      }
    } catch {
      /* ignore corrupted local state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const login = useCallback((user: SessionUser) => setState((s) => ({ ...s, user })), []);
  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), []);
  const addMedicine = useCallback(
    (m: Medicine) => setState((s) => ({ ...s, medicines: [m, ...s.medicines] })),
    [],
  );
  const removeMedicine = useCallback(
    (id: string) => setState((s) => ({ ...s, medicines: s.medicines.filter((m) => m.id !== id) })),
    [],
  );
  const addPharmacy = useCallback(
    (p: Pharmacy) => setState((s) => ({ ...s, pharmacies: [p, ...s.pharmacies] })),
    [],
  );
  const setPharmacyStatus = useCallback(
    (id: string, status: VerificationStatus) =>
      setState((s) => ({
        ...s,
        pharmacies: s.pharmacies.map((p) =>
          p.id === id ? { ...p, verificationStatus: status } : p,
        ),
      })),
    [],
  );
  const placeOrder = useCallback(
    (o: Order) => setState((s) => ({ ...s, orders: [o, ...s.orders] })),
    [],
  );
  const toggleSaved = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id],
      })),
    [],
  );
  const addReminder = useCallback(
    (r: Reminder) => setState((s) => ({ ...s, reminders: [r, ...s.reminders] })),
    [],
  );
  const completeReminder = useCallback(
    (id: string) =>
      setState((s) => ({
        ...s,
        reminders: s.reminders.map((r) => (r.id === id ? { ...r, status: "done" } : r)),
      })),
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      login,
      logout,
      addMedicine,
      removeMedicine,
      addPharmacy,
      setPharmacyStatus,
      placeOrder,
      toggleSaved,
      addReminder,
      completeReminder,
    }),
    [
      state,
      login,
      logout,
      addMedicine,
      removeMedicine,
      addPharmacy,
      setPharmacyStatus,
      placeOrder,
      toggleSaved,
      addReminder,
      completeReminder,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/** Medicines that can legally be shown in the marketplace:
 *  verified pharmacy + not expired + in stock. */
export function useListableMedicines() {
  const { medicines, pharmacies } = useStore();
  return useMemo(() => {
    const verified = new Set(
      pharmacies.filter((p) => p.verificationStatus === "verified").map((p) => p.id),
    );
    return medicines.filter(
      (m) =>
        verified.has(m.pharmacyId) &&
        new Date(m.expiryDate).getTime() > Date.now() &&
        m.quantity > 0,
    );
  }, [medicines, pharmacies]);
}