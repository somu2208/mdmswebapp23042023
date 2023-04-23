import {ApexOptions} from 'apexcharts'
import Chart from 'react-apexcharts'

const LineChart = ({chartTitle, id, xaxis, series, type}) => {
	const chartOptions: ApexOptions = {
		// colors: [],
		chart: {id},
		xaxis: {categories: xaxis},
		legend: {
			position: 'top',
			offsetY: 0,
		},
		markers: {
			size: 4,
			colors: undefined,
			strokeColors: '#fff',
			strokeWidth: 0,
			strokeOpacity: 0.9,
			strokeDashArray: 0,
			fillOpacity: 1,
			discrete: [],
			shape: 'circle',
			radius: 3,
			offsetX: 0,
			offsetY: 0,
			onClick: undefined,
			onDblClick: undefined,
			showNullDataPoints: true,
			hover: {
				size: undefined,
				sizeOffset: 3,
			},
		},
		stroke: {
			width: 2.5,
		},
	}

	return (
		<div className='w-full'>
			<div>
				<div className=''>
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

export default LineChart
