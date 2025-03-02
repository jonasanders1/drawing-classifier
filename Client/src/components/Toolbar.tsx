import ColorPicker from "./ColorPicker";
import "../styles/toolbar.css";
import { useState } from "react";

const Toolbar = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isEraserActive, setIsEraserActive] = useState(false);
  
  const handleButtonClick = (button: string) => {
    if (button === 'eraser') {
      setIsEraserActive(!isEraserActive);
      document.dispatchEvent(new Event('canvas-toggle-eraser'));
    } else {
      setActiveButton(button);
      // Reset active state after a short delay for visual feedback
      setTimeout(() => setActiveButton(null), 100);
      
      if (button === 'undo') {
        document.dispatchEvent(new Event('canvas-undo'));
      } else if (button === 'redo') {
        document.dispatchEvent(new Event('canvas-redo'));
      }
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar-buttons">
        <button 
          className={`toolbar-button undo ${activeButton === "undo" ? "active" : ""}`} 
          onClick={() => handleButtonClick("undo")}
        >
          Undo
        </button>
        <button 
          className={`toolbar-button redo ${activeButton === "redo" ? "active" : ""}`} 
          onClick={() => handleButtonClick("redo")}
        >
          Redo
        </button>
        <button 
          className={`toolbar-button eraser ${isEraserActive ? "active" : ""}`} 
          onClick={() => handleButtonClick("eraser")}
        >
          Eraser
        </button>
      </div>
      <ColorPicker />
    </div>
  )
}

export default Toolbar