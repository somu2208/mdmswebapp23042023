import {Button, CircularProgress, TextField} from '@mui/material'
import {fetchPowerConsumptionof30DaysAll9May} from 'api/services/dashboard'
import {fetchPowerConsumptionOf30DaysSingleTimeStamp } from 'api/services/dashboard'
import {useQuery} from 'react-query'
import Chart from 'react-apexcharts'
import ChartWrapper from 'components/ChartWrapper'
import {ApexOptions} from 'apexcharts'
import format from 'date-fns/format'
import add from 'date-fns/add'
import {CHART_HEIGHT} from 'constants/index'
import { useEffect, useState } from 'react'
import {useMutation} from 'react-query'


const ThirtyDaysAll = () => {
	
	const {data, isLoading, error} = useQuery(
		'consumptionInOfThirtyDaysAll',
		fetchPowerConsumptionof30DaysAll9May
	)
	// console.log("abchdfhsdfh",data)

	
	
	const [latestTime, setLatestTime] = useState('')

	const arr=[];

	/* const value=data['series'].map((item)=>{
		arr.push(item/1000);
	});
	console.log(arr); */
	/* useEffect(() => {
		getLatestTime()		
	}, [])
	 
	
/* 	const newdatatime = data?.data?.data
	const xaxis = newdatatime?.map((item) => item.source_date) */
	
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
						categories: data['category'],
						// categories: data,
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
						data: data['series'],
					},
				]}
			/>
		</>
	)
}

export default ThirtyDaysAll

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
