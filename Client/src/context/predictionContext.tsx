import { createContext, useContext, ReactNode, useState } from "react";


interface PredictionContextType {
  predictions: { className: string; percentage: number; image: string }[];
  setPredictions: (
    predictions: { className: string; percentage: number; image: string }[]
  ) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(
  undefined
);



export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<
    { className: string; percentage: number; image: string }[]
  >([
    { className: "circle", percentage: 0, image: "circle" },
    { className: "square", percentage: 0, image: "check_box_outline_blank" },
    { className: "triangle", percentage: 0, image: "change_history" },
    { className: "cat", percentage: 0, image: "pets" },
    { className: "dog", percentage: 0, image: "sound_detection_dog_barking" },
    { className: "bird", percentage: 0, image: "raven" },
    { className: "airplane", percentage: 0, image: "flight" },
    { className: "car", percentage: 0, image: "local_taxi" },
    { className: "house", percentage: 0, image: "cottage" },
    { className: "star", percentage: 0, image: "star" },
    { className: "umbrella", percentage: 0, image: "beach_access" },
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
    throw new Error("usePredictions must be used within a PredictionProvider");
  }
  return context;
}
