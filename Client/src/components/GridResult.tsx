import { usePredictions } from "../context/predictionContext";
import "../styles/result.css";

const getColorForPercentage = (percentage: number) => {
  // Convert percentage to a 0-1 scale
  const value = percentage / 100;

  // Calculate RGB components
  let red, green;

  if (value < 0.5) {
    // From red to orange (first half)
    red = 255;
    green = Math.round(128 * (value * 2));
  } else {
    // From orange to green (second half)
    red = Math.round(255 * (2 - value * 2));
    green = Math.round(128 * value);
  }

  return `rgba(${red}, ${green}, 0, 0.7)`;
};

const GridResult = () => {
  const { predictions } = usePredictions();
  return (
    <div className="reference-images">
      {predictions.map((prediction) => (
        <div className="card" key={prediction.className}>
          <div className="header">
            <h3>{prediction.className}</h3>
          </div>
          <div className="image-wrapper">
            <span className="material-symbols-rounded icon">
              {prediction.image}
            </span>
            <div
              className="result-percentage"
              style={{
                height: `${prediction.percentage}%`,
                backgroundColor: getColorForPercentage(prediction.percentage),
              }}
            >
              {prediction.percentage}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridResult;
