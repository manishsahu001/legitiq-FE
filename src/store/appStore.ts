import { create } from "zustand";
import { Document, CompareResponse } from "../types";

interface FeedbackState {
  feedback: Record<string, "accepted" | "rejected">;
  setFeedback: (clauseId: string, status: "accepted" | "rejected") => void;
  getFeedbackCounts: () => {
    accepted: number;
    rejected: number;
    total: number;
  };
  resetFeedback: () => void;
}

interface AppState extends FeedbackState {
  step: "upload" | "processing" | "results";
  documents: Document[];
  selectedPolicyId: string | null;
  compareResult: CompareResponse | null;
  isProcessing: boolean;
  progress: number;
  progressMessage: string;

  setStep: (step: "upload" | "processing" | "results") => void;
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  setSelectedPolicy: (id: string) => void;
  setCompareResult: (result: CompareResponse) => void;
  setProcessing: (status: boolean) => void;
  setProgress: (value: number, message: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  feedback: {},
  setFeedback: (clauseId, status) =>
    set((state) => ({
      feedback: { ...state.feedback, [clauseId]: status },
    })),
  getFeedbackCounts: () => {
    const feedback = get().feedback;
    const values = Object.values(feedback);
    return {
      accepted: values.filter((v) => v === "accepted").length,
      rejected: values.filter((v) => v === "rejected").length,
      total: values.length,
    };
  },
  resetFeedback: () => set({ feedback: {} }),

  step: "upload",
  documents: [],
  selectedPolicyId: null,
  compareResult: null,
  isProcessing: false,
  progress: 0,
  progressMessage: "",

  setStep: (step) => set({ step }),
  setDocuments: (documents) => set({ documents }),
  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      selectedPolicyId:
        state.selectedPolicyId === id ? null : state.selectedPolicyId,
    })),
  setSelectedPolicy: (selectedPolicyId) => set({ selectedPolicyId }),
  setCompareResult: (compareResult) => set({ compareResult }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setProgress: (progress, progressMessage) =>
    set({ progress, progressMessage }),
  reset: () =>
    set({
      step: "upload",
      compareResult: null,
      isProcessing: false,
      progress: 0,
      progressMessage: "",
      feedback: {},
    }),
}));
