import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchYearlyPowerConsumptionOfACustomer} from 'api/services/customers'
import {CHART_HEIGHT} from 'constants/index'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useSearchParams} from 'react-router-dom'

const Yearly = () => {
	const [search] = useSearchParams()
	const phase = search.get('meter_type')
	const meterId = search.get('meterId')

	const {data, error, isLoading} = useQuery(
		'yearlyPowerConsumptionOfACustomer',
		() => fetchYearlyPowerConsumptionOfACustomer({phase, meterId})
	)

    const allMonths=["Jan","Feb","Mar","Apr","May","Jun","jul","Aug","Sep","Oct","Nov","Dec"];
	var currentYear= new Date().getFullYear();
	var monthYear=allMonths.map((month)=> `${month} ${currentYear}`)

	const months = new Array(12).fill(0).map((_, index) => index + 1)

	const thisYearChartData =
		data?.thisYear &&
		months
			?.map((date) =>
				data.thisYear.find((item) => item.date === date)
					? data.thisYear.find((item) => item.date === date)
					: {date, value: 0}
			)
			.map((item) => item.value)

	const lastYearChartData =
		data?.thisYear &&
		months
			.map((date) =>
				data.lastYear.find((item) => item.date === date)
					? data.lastYear.find((item) => item.date === date)
					: {date, value: 0}
			)
			.map((item) => item.value)

	const noData = data?.thisYear?.length === 0 && data?.lastYear?.length === 0

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
										name: 'Last Year',
										data: lastYearChartData,
									},
									{
										type: 'column',
										name: 'This Year',
										data: thisYearChartData,
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
										title: {text: 'Date'},
										type: 'category',
										categories:monthYear,
										labels: {
											show: true,
											rotate: -45,
											rotateAlways: true,
											style: {
												fontSize: '12px',
											},
										},
									},
									yaxis: {
										title:{text: 'KWh'},
										labels: {
											show: true,
											style: {
												fontSize: '12px',
											},
										},
									},
									colors:['#407ddd','#dee2e6'],
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

export default Yearly

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
	dataLabels: {
		enabled: true,
		style: {
			fontSize: '12px',
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

//get the dates of last 30 days
