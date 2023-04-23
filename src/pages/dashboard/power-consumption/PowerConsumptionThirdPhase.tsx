import {CircularProgress} from '@mui/material'
import {fetchPower24third} from 'api/services/dashboard'
import {CHART_HEIGHT} from 'constants/index'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import { ApexOptions } from 'apexcharts'
const PowerConsumptionThirdPhase = () => {
	const {data, error, isLoading} = useQuery('fetchPower24third', fetchPower24third)
	const xaxis = data?.map((item) => item?.timestamp)
	const chartData = data?.map((item) => (item?.value / 1000)?.toFixed(2))
	
	if (isLoading) return <CircularProgress />
	if (error) return <div>Server Error</div>

	return (
		<div className=''>
			<Chart
				id='24hrPowerConsumption'
				height={CHART_HEIGHT}
				type='line'
				series={[{data: chartData, name: 'KWh'}]}
				xaxis={xaxis}
				options={{
					chart: {
						toolbar: {
							show: false,
							tools: {
								download: false,
							},
						},
					},
					xaxis: {
						tooltip: {
							enabled: false,
						},
						categories: xaxis,
						title: {text: 'Hour'},
						labels: {
							style: {
								fontSize: '12px',
							},
						},
					},
					markers: {
						size: 5,
					},
					yaxis: {
						title: {text: 'kWh'},
						labels: {
							style: {
								fontSize: '12px',
							},
						},
					},
					...chartOptions,
				}}
			/>
		</div>
	)
}

export default PowerConsumptionThirdPhase

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		curve: 'smooth',
	},
	tooltip: {
		enabled: true,
		x: {
			show: true,
		},
	},
	dataLabels: {
		enabled: true,
		// offsetY: -20,
		offsetY: 0,
		style: {
			colors: ['#2297e5'],
			fontSize: '14px',
		},
	},
	chart: {
		toolbar: {
			show: false
		},
	},
	plotOptions: {
		bar: {
			dataLabels: {
				position: 'top',
			},
		},
	},
}