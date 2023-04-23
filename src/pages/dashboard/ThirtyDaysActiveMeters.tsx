import {CircularProgress} from '@mui/material'
import {fetchLast30DaysActiveMeters} from 'api/services/dashboard'
import {useQuery} from 'react-query'
import Chart from 'react-apexcharts'
import ChartWrapper from 'components/ChartWrapper'
import {fetchLatestDateTimeForDataSync} from 'api/services/time-labels'
import {add, eachDayOfInterval, sub} from 'date-fns'
import format from 'date-fns/format'

const ThirtyDaysActiveMeters = () => {
	const {data, isLoading, error} = useQuery(
		['last30DaysActiveMeters'],
		fetchLast30DaysActiveMeters
	)
console.log(data);
	const {
		data: latestTime,
		error: error4,
		isLoading: loading4,
	} = useQuery('datetime', fetchLatestDateTimeForDataSync)

	const date = latestTime?.data?.data[0].server_date_time
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})

	const xaxis = eachDayOfInterval({
		start: sub(new Date(), {days: 29}),
		end: new Date(),
	}).map((item) => format(item, 'yyyy-MM-dd'))

	const meter1 = data?.data?.data
		.filter((item) => item.meter_connection_type_id == 1)
		.map((item) => ({
			...item,
			date: format(add(new Date(item.date), {days: 1}), 'yyyy-MM-dd'),
		}))

	const meter2 = data?.data?.data
		.filter((item) => item.meter_connection_type_id == 2)
		.map((item) => ({
			...item,
			date: format(add(new Date(item.date), {days: 1}), 'yyyy-MM-dd'),
		}))

	const meter1ChartData =
		meter1 &&
		xaxis
			.map((date) =>
				meter1.find((item2) => item2.date == date)
					? meter1.find((item2) => item2.date == date)
					: {
							meter_connection_type_id: '1',
							date: date,
							countDistinct: {
								meter_serial_number: 0,
							},
					  }
			)
			.map((item) => item.countDistinct.meter_serial_number)

	const meter2ChartData =
		meter2 &&
		xaxis
			.map((date) =>
				meter2.find((item2) => item2.date == date)
					? meter2.find((item2) => item2.date == date)
					: {
							meter_connection_type_id: '1',
							date: date,
							countDistinct: {
								meter_serial_number: 0,
							},
					  }
			)
			.map((item) => item.countDistinct.meter_serial_number)

	if (isLoading) return <CircularProgress />
	return (
		<ChartWrapper
			title='Active Meters in Last 30 days'
			time={date && format(addedDate, 'dd/MM/yyyy HH:mm:ss')}
		>
			<Chart
				type='bar'
				height={540}
				id='last30DaysActiveMeters'
				series={[
					{name: '1 Phase', data: meter1ChartData},
					{name: '3 Phase', data: meter2ChartData},
				]}
				options={{
					xaxis: {
						categories: xaxis,
						title: {text: '', style: {fontSize: '11px'}},
						labels: {
							style: {
								fontSize: '11px',
							},
						},
					},
					yaxis: {
						title: {text: '', style: {fontSize: '14px'}},
						labels: {
							style: {
								fontSize: '11px',
							},
						},
					},
					fill: {
						colors: ['#407ddd', '#dee2e6']
					},
					chart: {
						toolbar: {
							tools: {
								download: false,
							},
						},
					},
					legend: {
						show: false,
						position: 'top',
						offsetY: 0,
					},
					dataLabels: {
						enabled: true,
						offsetY: -20,
						style: {
							colors: ['#000'],
							fontSize: '11px',
						},
					},
					plotOptions: {
						bar: {
							columnWidth: '40%',
							dataLabels: {
								position: 'top',
							},
							
						},
					},
				}}
			/>
		</ChartWrapper>
	)
}

export default ThirtyDaysActiveMeters

// chartTitle='Last 30 days active meters'
