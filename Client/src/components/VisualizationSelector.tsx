import { useVisualization } from "../context/visualizationContext";
import "../styles/visualizationSelector.css";

const VisualizationSelector = () => {
  const { visualizationType, setVisualizationType } = useVisualization();

  return (
    <div className="visualization-selector">
      <button
        className={`selector-button ${visualizationType === 'grid' ? 'active' : ''}`}
        onClick={() => setVisualizationType('grid')}
      >
        <span className="selector-button-text">Grid</span>
        <span className="material-symbols-rounded">grid_view</span>
      </button>
      <button
        className={`selector-button ${visualizationType === 'list' ? 'active' : ''}`}
        onClick={() => setVisualizationType('list')}
      >
        <span className="selector-button-text">List</span>
        <span className="material-symbols-rounded">format_list_bulleted</span>
      </button>
    </div>
  );
};

export default VisualizationSelector; 