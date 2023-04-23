import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchMonthlyPowerConsumptionOfACustomer} from 'api/services/customers'
import {CHART_HEIGHT} from 'constants/index'
import {getDaysInMonth, intervalToDuration, set} from 'date-fns'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'
import {useSearchParams} from 'react-router-dom'
import {format, sub} from 'date-fns'

const Monthly = () => {
	const [search] = useSearchParams()
	const phase = search.get('meter_type')
	const meterId = search.get('meterId')

	const {data, error, isLoading} = useQuery(
		'monthlyPowerConsumptionOfACustomer',
		() => fetchMonthlyPowerConsumptionOfACustomer({phase, meterId})
	)

	const dates = new Array(30).fill(0).map((_, i) => i + 1)

   var today = new Date();
   var lastDayOfMonth =  new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    var MyDateString;
    today.setDate(today.getDate() + 20);
	const datesArr=[];
	let currentMonth=today.getMonth()+1;
	if(currentMonth != 10 && currentMonth !=11 && currentMonth !=12)
	{
		currentMonth=Number("0"+today.getMonth()+1);
	}
	 for(var i=1 ; i<=lastDayOfMonth; i++){
		MyDateString = ('0' + i).slice(-2) + '-'
		+ ('0' + (today.getMonth())).slice(-2) + '-'
		+ today.getFullYear();
		datesArr.push(MyDateString)
	 }
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
								// id='month-wise-consumption'
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
										// overwriteCategories: data?.thisM?.map((item, index) =>
										// 	format(sub(new Date(30), {hours: index}) as any, 'dd-MM-yyyy')
										// ),
										title: {text: 'Date'},
										type: 'category',
										categories: datesArr,
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
										title: {text: 'KWh'},
										labels: {
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
