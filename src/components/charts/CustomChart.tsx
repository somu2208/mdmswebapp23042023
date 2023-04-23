import {ApexOptions} from 'apexcharts'
import Chart from 'react-apexcharts'

const CustomChart = ({chartTitle, id, xaxis, series, type}) => {
	const chartOptions: ApexOptions = {
		chart: {id},
		xaxis: {
			categories: xaxis,
		},
		legend: {
			position: 'top',
			offsetY: 0,
		},
		stroke: {
			width: 2.5,
		},
	}

	return (
		<div className='w-full'>
			<div>
				<div className='bg-white rounded-xl'>
					<div className='my-3 pt-4 px-5 mb-5'>
						<h1 className='text-secondary text-xl font-bold'>{chartTitle}</h1>
					</div>
					<Chart
						options={chartOptions}
						series={series}
						type={type}
						width='100%'
						height='500px'
					/>
				</div>
			</div>
		</div>
	)
}

export default CustomChart
