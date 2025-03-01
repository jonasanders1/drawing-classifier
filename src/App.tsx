import './App.css'
import Canvas from './components/Canvas'
import { ColorProvider, useColor } from './context/colorContext'

function ColorPicker() {
  const { selectedColor, setSelectedColor } = useColor();
  
  const handleColorClick = (color: string) => {
    console.log('color', color)
    setSelectedColor(color) 
  }
  return (
    <div className="color-box-container">       
      <button className={`color-box color-box-green ${selectedColor === '#4CAF50' ? 'color-box-selected' : ''}`} onClick={() => handleColorClick('#4CAF50')}></button>
      <button className={`color-box color-box-blue ${selectedColor === '#2196F3' ? 'color-box-selected' : ''}`} onClick={() => handleColorClick('#2196F3')}></button>
      <button className={`color-box color-box-red ${selectedColor === '#F44336' ? 'color-box-selected' : ''}`} onClick={() => handleColorClick('#F44336')}></button>
      <button className={`color-box color-box-yellow ${selectedColor === '#FFC107' ? 'color-box-selected' : ''}`} onClick={() => handleColorClick('#FFC107')}></button>
    </div>
  );
}

function App() {
  return (
    <ColorProvider>
      <div>
        <ColorPicker />
        <Canvas/>
      </div>
    </ColorProvider>
  );
}

export default App;
