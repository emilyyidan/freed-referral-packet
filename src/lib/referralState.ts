// State management for referral workflow
// Uses localStorage to persist state across sessions

export interface ReferralPacket {
  id: string;
  createdAt: string;
  status: 'draft' | 'in_progress' | 'ready' | 'sent';
  specialty: string;
  referralLetter: string;
  selectedSOAPNotes: string[]; // SOAP note IDs
  selectedLabs: string[]; // Lab result IDs
  selectedImaging: string[]; // Imaging result IDs
  specialistNotes: string;
  patientId: string;
}

export interface AppState {
  currentReferral: ReferralPacket | null;
  referralHistory: ReferralPacket[];
}

const STORAGE_KEY = 'freed-referral-state';

const defaultState: AppState = {
  currentReferral: null,
  referralHistory: [],
};

export const getState = (): AppState => {
  if (typeof window === 'undefined') return defaultState;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading state:', e);
  }
  return defaultState;
};

export const setState = (state: AppState): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
};

export const resetState = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

export const createReferral = (specialty: string, patientId: string): ReferralPacket => {
  const referral: ReferralPacket = {
    id: `ref-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'draft',
    specialty,
    referralLetter: '',
    selectedSOAPNotes: [],
    selectedLabs: [],
    selectedImaging: [],
    specialistNotes: '',
    patientId,
  };

  const state = getState();
  state.currentReferral = referral;
  setState(state);

  return referral;
};

export const updateCurrentReferral = (updates: Partial<ReferralPacket>): ReferralPacket | null => {
  const state = getState();
  if (!state.currentReferral) return null;

  state.currentReferral = { ...state.currentReferral, ...updates };
  setState(state);

  return state.currentReferral;
};

export const completeReferral = (): void => {
  const state = getState();
  if (state.currentReferral) {
    state.currentReferral.status = 'sent';
    state.referralHistory.push(state.currentReferral);
    state.currentReferral = null;
    setState(state);
  }
};

export const getCurrentReferral = (): ReferralPacket | null => {
  return getState().currentReferral;
};
