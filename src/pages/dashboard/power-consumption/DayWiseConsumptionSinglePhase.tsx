import {Button, CircularProgress, TextField} from '@mui/material'
import {fetchPowerConsumptionOfADaySingle} from 'api/services/dashboard'
import format from 'date-fns/format'
import {useEffect, useState} from 'react'
import {useMutation} from 'react-query'
import Chart from 'react-apexcharts'
import {ApexOptions} from 'apexcharts'
import {CHART_HEIGHT} from 'constants/index'

const DayWiseConsumptionSinglePhase = () => {
	
	const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
	
	const {data, isLoading, error, mutate} = useMutation(
		'powerConsumptionOfADaySingle',
		fetchPowerConsumptionOfADaySingle
	)


	// console.log(data);




	useEffect(() => {
		mutate({date: format(new Date(), 'yyyy-MM-dd'), range: false})
	}, [])

	const handleClick = () => {
		if (date === format(new Date(), 'yyyy-MM-dd')) {
			mutate({date: format(new Date(), 'yyyy-MM-dd'), range: false})
			return
		}
		mutate({date: format(new Date(date), 'yyyy-MM-dd'), range: true})
	}

	if (isLoading) return <CircularProgress />
	return (
		<div className=''>
			<div className='flex gap-2'>
				<TextField
					type='date'
					value={date}
					onChange={(e) => setDate(e.target.value)}
					size='small'
					variant='outlined'
					label='Date'
				/>
				<Button size='small' variant='contained' onClick={handleClick}>
					Submit
				</Button>
			</div>
			<Chart
				height={CHART_HEIGHT}
				type='bar'
				id='day-wise-consumption'
				options={{
					chart: {id: 'day-wise-consumption'},
					xaxis: {
						categories: [date],
						title: {text: 'Day'},
						labels: {
							// rotate:-45,
							style: {
								fontSize: '12px',
							},
						},
					},
					yaxis: {
						title: {
							text: 'kWh',
						},
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
						data: [(data?.data / 1000).toFixed(2)],
					},
				]}
			/>
		</div>
	)
}

export default DayWiseConsumptionSinglePhase

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		width: 2.5,
	},
	dataLabels: {
		enabled: true,
		offsetY: -20,
		style: {
			colors: ['#2297e5'],
			fontSize: '14px',
			
		},
	},
	chart: {
		toolbar: {
			tools: {
				download: false,
			},
		},
	},
	plotOptions: {
		bar: {
			dataLabels: {
				position: 'top',
			},
			columnWidth: '10%',
		},
	},
}
