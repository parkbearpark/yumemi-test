import { useState } from 'react'
import 'chart.js/auto'
import { ChartData } from 'chart.js'
import { Line } from 'react-chartjs-2'

const Graph = () => {
  const [chartData, setChartData] = useState<
    ChartData<'line', number[], string>
  >({
    labels: [],
    datasets: [],
  })

  return (
    <div className="graph-container">
      <Line data={chartData} />
    </div>
  )
}

export { Graph }
