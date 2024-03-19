import 'chart.js/auto'
import { ChartData } from 'chart.js'
import { Line } from 'react-chartjs-2'

interface GraphInterface {
  chartData: ChartData<'line', number[], string>
}

const Graph = ({ chartData }: GraphInterface) => {
  return (
    <div className="graph-container">
      <Line data={chartData} />
    </div>
  )
}

export { Graph }
