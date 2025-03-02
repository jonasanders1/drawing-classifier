import ColorPicker from "./ColorPicker";
import "../styles/toolbar.css";
const Toolbar = () => {
  return (
    <div className="toolbar">
      <button className="undo-button" onClick={() => document.dispatchEvent(new CustomEvent("canvas-undo"))}>
        <span className="material-symbols-outlined">undo</span>
      </button>
      <ColorPicker />
    </div>
  )
}

export default Toolbar