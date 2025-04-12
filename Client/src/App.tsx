import "./App.css";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import GridResult from "./components/GridResult";
import ListResult from "./components/ListResult";
import VisualizationSelector from "./components/VisualizationSelector";
import { useVisualization } from "./context/visualizationContext";

function App() {
  const { visualizationType } = useVisualization();

  return (
    <div className="app">
      <div>
        <h1>🎨 Test Your Drawing Against a Trained CNN Model 🧠</h1>
        <div>
          This project features a{" "}
          <div className="highlight">Convolutional Neural Network (CNN)</div>{" "}
          build from{" "}
          <div className="highlight">scratch</div> trained on{" "}
          <div className="highlight">11 predefined classes</div>. Your task is to
          draw one of these classes, and the model will analyze your drawing to
          identify the closest match.{" "}
          <div className="highlight">The goal is to evaluate</div> how well the
          model can recognize and classify your input based on its training.{" "}
          <br />
          Challenge the model and see how accurately it can predict your
          drawing!
        </div>
      </div>
      <main className="main-container">
        <div className="drawing-container">
          <Toolbar />
          <Canvas />
        </div>
        <div className="result-container">
          <VisualizationSelector />
          {visualizationType === 'grid' ? <GridResult /> : <ListResult />}
        </div>
      </main>
    </div>
  );
}

export default App;
