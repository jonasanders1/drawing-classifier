import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ColorProvider } from "./context/colorContext.tsx";
import { PredictionProvider } from "./context/predictionContext.tsx";
import { VisualizationProvider } from "./context/visualizationContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorProvider>
      <PredictionProvider>
        <VisualizationProvider>
          <App />
        </VisualizationProvider>
      </PredictionProvider>
    </ColorProvider>
  </StrictMode>
);
