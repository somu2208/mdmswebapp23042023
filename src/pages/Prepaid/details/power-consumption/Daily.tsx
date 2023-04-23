import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchDailyPowerConsumptionOfACustomer} from 'api/services/customers'
import {CHART_HEIGHT} from 'constants/index'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useSearchParams} from 'react-router-dom'

const Daily = () => {
	const [search] = useSearchParams()
	const phase = search.get('meter_type')
	const meterId = search.get('meterId')

	const {data, error, isLoading} = useQuery(
		'dailyPowerConsumptionOfACustomer',
		() => fetchDailyPowerConsumptionOfACustomer({phase, meterId})
	)

	const xaxis = new Array(24).fill('').map((_, i) => i + 1)

	const thisMonthChartData =
		data?.today &&
		xaxis
			?.map((date) =>
				data.today.find((item) => item.date === date)
					? data.today.find((item) => item.date === date)
					: {date, value: 0}
			)
			.map((item) => item.value)

	const lastMonthChartData =
		data?.yesterday &&
		xaxis
			.map((date) =>
				data.yesterday.find((item) => item.date === date)
					? data.yesterday.find((item) => item.date === date)
					: {date, value: 0}
			)
			.map((item) => item.value)

	const noData = data?.today?.length === 0 && data?.yesterday?.length === 0

	if (error) return <p>Server Error</p>
	return (
		<div>
			<div className='min-h-[500px]'>
				{!isLoading ? (
					<>
						{!noData ? (
							<Chart
								height={CHART_HEIGHT}
								series={[
									{
										type: 'line',
										name: 'Yesterday',
										data: thisMonthChartData,
									},
									{
										type: 'column',
										name: 'Today',
										data: lastMonthChartData,
									},
								]}
								options={{
									chart: {
										toolbar: {
											show: true,
										},
										zoom: {
											enabled: true,
										},
									},
									xaxis: {
										type: 'category',
										categories: xaxis,
										labels: {
											show: true,
										},
									},
									dataLabels: {
										enabled: true,
									},
									...chartOptions,
								}}
							/>
						) : (
							<p>No data avilable</p>
						)}
					</>
				) : (
					<div style={{height: 500}}>
						<CircularProgress />
					</div>
				)}
			</div>
		</div>
	)
}

export default Daily

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		width: 2.5,
	},
	tooltip: {
		enabled: true,
		x: {
			show: true,
		},
	},
	chart: {
		toolbar: {
			tools: {
				download: false,
			},
		},
	},
}
