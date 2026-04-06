import { auth } from '@/services/firebase';
import { UserProfile } from '@/utils/types';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { create } from 'zustand';

interface AuthState {
  user: UserProfile | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  initAuth: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const mapUser = (user: User): UserProfile => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
});

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  loading: false,
  error: null,

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      set({
        user: firebaseUser ? mapUser(firebaseUser) : null,
        initializing: false,
      });
    });

    return unsubscribe;
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await signOut(auth);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
