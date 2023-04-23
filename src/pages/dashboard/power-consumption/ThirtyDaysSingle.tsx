import {Button, CircularProgress, TextField} from '@mui/material'
import {fetchPowerConsumptionOf30DaysSingle} from 'api/services/dashboard'
//import {fetchPowerConsumptionOf30DaysSingleTimeStamp } from 'api/services/dashboard'
import {useQuery} from 'react-query'
import Chart from 'react-apexcharts'
import ChartWrapper from 'components/ChartWrapper'
import {ApexOptions} from 'apexcharts'
import format from 'date-fns/format'
import add from 'date-fns/add'
import {CHART_HEIGHT} from 'constants/index'
import { useEffect, useState } from 'react'
import {useMutation} from 'react-query'
import { exit } from 'process'
const ThirtyDaysSingle = () => {
	
	const {data, isLoading, error} = useQuery(
		'consumptionInOfThirtyDaysSingle',
		fetchPowerConsumptionOf30DaysSingle
	)
	
	
	const [latestTime, setLatestTime] = useState('')
	
	const values = data?.data?.data?.map((item) =>
		(item.sum.energy_kwh_import/1000).toFixed(2)
	)
	/* const values1 = data?.data?.map((item) =>
		(item.sum.energy_wh_import / 1000).toFixed(2)
	) */
	
	// console.log('Monthly 30Days	'+values);
/* 	useEffect(() => {
		getLatestTime()		
	}, []) */
	
	 /* const time_array =async() => {
		 await fetchPowerConsumptionOf30DaysSingleTimeStamp()
		
	} 
 */
	const time_array=[];
	const xaxis = data?.data?.data?.map((item) =>{
	  time_array.push(`${item.source_timestamp_day}/${item.source_timestamp_month}/${item.source_timestamp_year}`);
	})
	//console.log(time_array);
	
	if (isLoading) return <CircularProgress />

	return (
		<>
			<Chart
				height={CHART_HEIGHT}
				type='line'
				id='month-wise-consumption'
				options={{
					chart: {id: 'monthly-consumption'},
					xaxis: {
						categories: time_array,
						title: {text: 'Date'},
						labels: {
							rotate:-45,
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
				series={[
					{
						name: 'KWh',
						data: values,
					},
				]}
			/>
		</>
	)
}

export default ThirtyDaysSingle

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		curve: 'smooth',
	},
	dataLabels: {
		enabled: true,
		// offsetY: -20,
		offsetY: 0,
		style: {
			colors: ['#2297e5'],
			fontSize: '12px',
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
