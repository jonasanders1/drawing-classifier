import ColorPicker from "./ColorPicker";
import "../styles/toolbar.css";
import { useState } from "react";

const Toolbar = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isEraserActive, setIsEraserActive] = useState(false);

  const handleButtonClick = (button: string) => {
    if (button === "eraser") {
      setIsEraserActive(!isEraserActive);
      document.dispatchEvent(new Event("canvas-toggle-eraser"));
    } else {
      setActiveButton(button);
      // Reset active state after a short delay for visual feedback
      setTimeout(() => setActiveButton(null), 100);

      if (button === "undo") {
        document.dispatchEvent(new Event("canvas-undo"));
      } else if (button === "redo") {
        document.dispatchEvent(new Event("canvas-redo"));
      } else if (button === "save") {
        document.dispatchEvent(new Event("canvas-save"));
      }
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-buttons">
        <button
          className={`toolbar-button undo ${
            activeButton === "undo" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("undo")}
        >
          <span className="material-symbols-rounded">undo</span>
        </button>
        <button
          className={`toolbar-button redo ${
            activeButton === "redo" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("redo")}
        >
          <span className="material-symbols-rounded">redo</span>
        </button>
        <button
          className={`toolbar-button eraser ${isEraserActive ? "active" : ""}`}
          onClick={() => handleButtonClick("eraser")}
        >
          <span className="material-symbols-rounded">
            {isEraserActive ? "ink_eraser_off" : "ink_eraser"}
          </span>
        </button>
        <button
          className={`toolbar-button save ${
            activeButton === "save" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("save")}
        >
          <span className="material-symbols-rounded">save</span>
        </button>
      </div>
      <ColorPicker />
    </div>
  );
};

export default Toolbar;
