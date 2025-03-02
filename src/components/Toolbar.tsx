import ColorPicker from "./ColorPicker";
import "../styles/toolbar.css";
const Toolbar = () => {
  return (
    <div className="toolbar">
      <div className="toolbar-buttons">
      <button className="toolbar-button undo" onClick={() => document.dispatchEvent(new CustomEvent("canvas-undo"))}>
        Undo
      </button>
      <button className="toolbar-button redo" onClick={() => document.dispatchEvent(new CustomEvent("canvas-redo"))}>
        Redo
      </button>
      </div>
      <ColorPicker />
    </div>
  )
}

export default Toolbar