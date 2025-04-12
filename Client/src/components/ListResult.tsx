import '../styles/result.css'
import { usePredictions } from '../context/predictionContext';

const ListResult = () => {
  const { predictions } = usePredictions();

  return (
    <div className="score-container">
      <table>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((score, index) => (
            <tr key={index}>
              <td className='score-class-name'>{score.className}</td>
              <td className='score-percentage'>{score.percentage.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListResult;