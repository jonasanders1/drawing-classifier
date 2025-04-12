import { useColor } from "../context/colorContext";
import "../styles/colorPicker.css";

const ColorPicker = () => {
  const { selectedColor, setSelectedColor } = useColor();

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };
  return (
    <div className="color-box-container">
      <button
        className={`color-box color-box-white ${
          selectedColor === "#fff" ? "color-box-selected" : ""
        }`}
        onClick={() => handleColorClick("#fff")}
      ></button>
      <button
        className={`color-box color-box-green ${
          selectedColor === "#4CAF50" ? "color-box-selected" : ""
        }`}
        onClick={() => handleColorClick("#4CAF50")}
      ></button>
      <button
        className={`color-box color-box-blue ${
          selectedColor === "#2196F3" ? "color-box-selected" : ""
        }`}
        onClick={() => handleColorClick("#2196F3")}
      ></button>
      <button
        className={`color-box color-box-red ${
          selectedColor === "#F44336" ? "color-box-selected" : ""
        }`}
        onClick={() => handleColorClick("#F44336")}
      ></button>
      <button
        className={`color-box color-box-yellow ${
          selectedColor === "#FFC107" ? "color-box-selected" : ""
        }`}
        onClick={() => handleColorClick("#FFC107")}
      ></button>
    </div>
  );
}

export default ColorPicker;