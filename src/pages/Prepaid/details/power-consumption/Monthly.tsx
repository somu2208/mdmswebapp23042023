import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchMonthlyPowerConsumptionOfACustomer} from 'api/services/customers'
import {CHART_HEIGHT} from 'constants/index'
import {getDaysInMonth, intervalToDuration, set, format} from 'date-fns'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useSearchParams} from 'react-router-dom'

const Monthly = () => {
	const [search] = useSearchParams()
	const phase = search.get('meter_type')
	const meterId = search.get('meterId')

	const {data, error, isLoading} = useQuery(
		'monthlyPowerConsumptionOfACustomer',
		() => fetchMonthlyPowerConsumptionOfACustomer({phase, meterId})
	)

	const dates = new Array(30).fill(0).map((_, i) => i + 1)

	const thisMonthdates = new Array(
		intervalToDuration({
			start: set(new Date(), {date: 0}),
			end: new Date(),
		}).days
	)
		.fill(0)
		.map((_, i) => i + 1)

	//find dates till today of this month
	const thisMonthChartData =
		data?.thisM &&
		thisMonthdates
			?.map((date) =>
				data.thisM.find((item) => item.date === date)
					? data.thisM.find((item) => item.date === date)
					: {date, value: 0}
			)
			.map((item) => item.value)

	const lastMonthChartData =
		data?.thisM &&
		dates
			.map((date) =>
				data.lastM.find((item) => item.date === date)
					? data.lastM.find((item) => item.date === date)
					: {date, value: 0}
			)
			.map((item) => item.value)

	const noData = data?.thisM?.length === 0 && data?.lastM?.length === 0

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
										name: 'Last Month',
										data: lastMonthChartData,
									},
									{
										type: 'column',
										name: 'This Month',
										data: thisMonthChartData,
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
										categories: dates,
										labels: {
											show: true,
										},
									},
									...chartOptions,
								}}
							/>
						) : (
							<p>No data available</p>
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

export default Monthly

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
	yaxis: {},
	dataLabels: {
		enabled: true,
	},
	chart: {
		toolbar: {
			tools: {
				download: false,
			},
		},
	},
}
