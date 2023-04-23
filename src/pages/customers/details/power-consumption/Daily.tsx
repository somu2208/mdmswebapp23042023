import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchDailyPowerConsumptionOfACustomer} from 'api/services/customers'
import {CHART_HEIGHT} from 'constants/index'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useSearchParams} from 'react-router-dom'
import {format, sub} from 'date-fns'

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
						{/* {!noData ? ( */}
					    {data?.y?.length ? (
							<Chart
								height={CHART_HEIGHT}
								series={[
									{
										type: 'line',
										name: 'Today',
										data: thisMonthChartData,
									},
									{
										type: 'column',
										name: 'Yesterday',
										data: lastMonthChartData,
									},
								]}
								options={{
									chart: {
										toolbar: {
											show: false,
										},
										zoom: {
											enabled: false,
										},
									},
									xaxis: {
										overwriteCategories: data?.x?.map((item, index) =>
											format(sub(new Date(), {hours: index}) as any, 'dd-MM hh:mm:a')
										),
										title: {text: "Date",style: {fontSize: '12px'}},
										type: 'category',
										categories: xaxis,
										labels: {
											show: true,
											rotate: -45,
											rotateAlways: true,
											hideOverlappingLabels: true,
											showDuplicates: false,
											trim: false,
											minHeight: 100,
											maxHeight: 120,
											style: {
												colors: [],
												fontSize: '12px',
												fontFamily: 'Helvetica, Arial, sans-serif',
												fontWeight: 400,
												cssClass: 'apexcharts-xaxis-label',
											},
										},
									},
									yaxis: {
										title: {text: 'KWh'},
										labels: {
											style: {
												fontSize: '12px',
											},
										},
									},
									dataLabels: {
										enabled: true,
										style: {
											fontSize: '12px',
										},
									},
									colors:['#407ddd','#dee2e6'],
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
		// curve: 'smooth',
	},
	tooltip: {
		enabled: true,
		style: {
			fontSize: '12px',
		},
		x: {
			show: true,
		},
	},
	chart: {
		toolbar: {
			show:false,
			tools: {
				download: false,
			},
		},
	},
}
