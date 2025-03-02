import "./App.css";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import Result from "./components/Result";

function App() {
  return (
    <div className="app">
      <div className="drawing-container">
        <Toolbar />
        <Canvas />
      </div>
      <div className="result-container">
        <Result />
      </div>
    </div>
  );
}

export default App;
