import { create } from 'zustand';
import { CartItem, Medicine, Batch, PaymentMethod } from '../types';

interface CartState {
  items: CartItem[];
  discount: number;
  tax: number;
  paymentMethod: PaymentMethod;
  prescriptionId?: string;
  notes?: string;

  // Computed values
  subtotal: number;
  total: number;

  // Actions
  addItem: (medicine: Medicine, batch: Batch, qty: number) => void;
  removeItem: (medicineId: string, batchId: string) => void;
  updateQty: (medicineId: string, batchId: string, qty: number) => void;
  setDiscount: (discount: number) => void;
  setTax: (tax: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPrescriptionId: (id: string | undefined) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  tax: 0,
  paymentMethod: 'CASH',
  prescriptionId: undefined,
  notes: undefined,
  subtotal: 0,
  total: 0,

  addItem: (medicine: Medicine, batch: Batch, qty: number) => {
    const state = get();
    const existingIndex = state.items.findIndex(
      (item) => item.medicine._id === medicine._id && item.batch._id === batch._id
    );

    let newItems: CartItem[];

    if (existingIndex >= 0) {
      // Update existing item
      newItems = [...state.items];
      newItems[existingIndex].qty += qty;
      newItems[existingIndex].lineTotal = newItems[existingIndex].qty * newItems[existingIndex].price;
    } else {
      // Add new item
      const newItem: CartItem = {
        medicine,
        batch,
        qty,
        price: medicine.sellingPrice,
        lineTotal: qty * medicine.sellingPrice,
      };
      newItems = [...state.items, newItem];
    }

    set({ items: newItems });
    get().calculateTotals();
  },

  removeItem: (medicineId: string, batchId: string) => {
    const state = get();
    const newItems = state.items.filter(
      (item) => !(item.medicine._id === medicineId && item.batch._id === batchId)
    );
    set({ items: newItems });
    get().calculateTotals();
  },

  updateQty: (medicineId: string, batchId: string, qty: number) => {
    const state = get();
    const newItems = state.items.map((item) => {
      if (item.medicine._id === medicineId && item.batch._id === batchId) {
        return {
          ...item,
          qty,
          lineTotal: qty * item.price,
        };
      }
      return item;
    });
    set({ items: newItems });
    get().calculateTotals();
  },

  setDiscount: (discount: number) => {
    set({ discount });
    get().calculateTotals();
  },

  setTax: (tax: number) => {
    set({ tax });
    get().calculateTotals();
  },

  setPaymentMethod: (method: PaymentMethod) => {
    set({ paymentMethod: method });
  },

  setPrescriptionId: (id: string | undefined) => {
    set({ prescriptionId: id });
  },

  setNotes: (notes: string) => {
    set({ notes });
  },

  clearCart: () => {
    set({
      items: [],
      discount: 0,
      tax: 0,
      paymentMethod: 'CASH',
      prescriptionId: undefined,
      notes: undefined,
      subtotal: 0,
      total: 0,
    });
  },

  calculateTotals: () => {
    const state = get();
    const subtotal = state.items.reduce((sum, item) => sum + item.lineTotal, 0);
    const total = subtotal - state.discount + state.tax;
    set({ subtotal, total });
  },
}));
