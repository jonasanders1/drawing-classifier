import placeholder from "../assets/images/placeholder.png";
import '../styles/result.css'

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

const Result = () => {
  return (
    <div className="reference-images">
      <div className="image-wrapper">
        <img src={placeholder} className="reference-image" alt="reference-image"  />
        <div 
          className="result-percentage"
          style={{ 
            height: `${10}%`,
            backgroundColor: getColorForPercentage(10)
          }}
        >
          10%
        </div>
      </div>
      <div className="image-wrapper">
        <img src={placeholder} className="reference-image" alt="reference-image"  />
        <div 
          className="result-percentage"
          style={{ 
            height: `${30}%`,
            backgroundColor: getColorForPercentage(30)
          }}
        >
          30%
        </div>
      </div>
      <div className="image-wrapper">
        <img src={placeholder} className="reference-image" alt="reference-image"  />
        <div 
          className="result-percentage"
          style={{ 
            height: `${100}%`,
            backgroundColor: getColorForPercentage(100)
          }}
        >
          100%
        </div>
      </div>
      <div className="image-wrapper">
        <img src={placeholder} className="reference-image" alt="reference-image"  />
        <div 
          className="result-percentage"
          style={{ 
            height: `${70}%`,
            backgroundColor: getColorForPercentage(70)
          }}
        >
          70%
        </div>
      </div>
      <div className="image-wrapper">
        <img src={placeholder} className="reference-image" alt="reference-image"  />
        <div 
          className="result-percentage"
          style={{ 
            height: `${90}%`,
            backgroundColor: getColorForPercentage(90)
          }}
        >
          90%
        </div>
      </div>
    </div>
  );
};

export default Result;
