import "./App.css";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import Result from "./components/Result";

function App() {
  return (
    <div className="app">
      <div>
        <h1>🎨 Test Your Drawing Against a Trained CNN Model 🧠</h1>
        <p>
          This project features a{" "}
          <div className="highlight">Convolutional Neural Network (CNN)</div>{" "}
          build from{" "}
          <div className="highlight">scratch</div> trained on{" "}
          <div className="highlight">X predefined classes</div>. Your task is to
          draw one of these classes, and the model will analyze your drawing to
          identify the closest match.{" "}
          <div className="highlight">The goal is to evaluate</div> how well the
          model can recognize and classify your input based on its training.{" "}
          <br />
          Challenge the model and see how accurately it can predict your
          drawing!
        </p>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <div className="drawing-container">
          <Toolbar />

          <Canvas />
        </div>
        <div className="result-container">
          <Result />
        </div>
      </div>
    </div>
  );
}

export default App;
