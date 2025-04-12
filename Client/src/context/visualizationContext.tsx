import { createContext, useContext, ReactNode, useState } from "react";

type VisualizationType = 'grid' | 'list';

interface VisualizationContextType {
  visualizationType: VisualizationType;
  setVisualizationType: (type: VisualizationType) => void;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export function VisualizationProvider({ children }: { children: ReactNode }) {
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('grid');

  return (
    <VisualizationContext.Provider value={{ visualizationType, setVisualizationType }}>
      {children}
    </VisualizationContext.Provider>
  );
}

export function useVisualization() {
  const context = useContext(VisualizationContext);
  if (context === undefined) {
    throw new Error("useVisualization must be used within a VisualizationProvider");
  }
  return context;
} 