import { createContext, useContext, ReactNode, useState } from 'react';

interface PredictionContextType {
  predictions: { className: string; percentage: number }[];
  setPredictions: (predictions: { className: string; percentage: number }[]) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<{ className: string; percentage: number }[]>([
    { className: 'circle', percentage: 0 },
    { className: 'square', percentage: 0 },
    { className: 'triangle', percentage: 0 },
    { className: 'cat', percentage: 0 },
    { className: 'dog', percentage: 0 },
    { className: 'bird', percentage: 0 },
    { className: 'airplane', percentage: 0 },
    { className: 'car', percentage: 0 },
    { className: 'house', percentage: 0 },
    { className: 'star', percentage: 0 }
  ]);

  return (
    <PredictionContext.Provider value={{ predictions, setPredictions }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePredictions() {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
}