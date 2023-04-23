import {Button, CircularProgress, MenuItem, TextField} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {
	fetchLatestTimeForPowerConsumptionMonthlyAndYearly,
	fetchPowerConsumptionByYear,
} from 'api/services/dashboard'
import ChartWrapper from 'components/ChartWrapper'
import {CHART_HEIGHT} from 'constants/index'
import format from 'date-fns/format'
import {useEffect, useState} from 'react'
import Chart from 'react-apexcharts'
import {useMutation} from 'react-query'
import {getListOfLast10Years} from 'utils'

const Yearly = () => {
	const [state, setState] = useState<{year: number | string}>({
		year: new Date().getFullYear(),
	})
	const [latestTime, setLatestTime] = useState('')

	const {
		data: res,
		isLoading,
		mutate,
	} = useMutation('powerConsumptionTillEndOfYear', fetchPowerConsumptionByYear)

	useEffect(() => {
		getLatestTime()
		mutate({
			year: state.year,
		})
	}, [])

	const getLatestTime = async () => {
		const res = await fetchLatestTimeForPowerConsumptionMonthlyAndYearly()
		setLatestTime(res)
	}

	const data = res?.data?.data

	const values = data?.map((item) =>
		(item.sum.energy_wh_import / 1000).toFixed(2)
	)
	const xaxis = data?.map((item) => item.date_month)

	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({year: state.year})
	}

	return (
		<div>
			<ChartWrapper
				title='Power consumption of each month in a year'
				time={latestTime}
			>
				<form className='flex gap-2' onSubmit={handleSubmit}>
					<TextField
						select
						size='small'
						variant='outlined'
						value={state.year}
						onChange={(e: any) => setState({year: e.target.value})}
					>
						{getListOfLast10Years().map((item) => (
							<MenuItem value={item}>{item}</MenuItem>
						))}
					</TextField>
					<Button
						type='submit'
						color='primary'
						variant='contained'
						size='small'
					>
						Submit
					</Button>
				</form>
				{!isLoading ? (
					<Chart
						height={CHART_HEIGHT}
						type='bar'
						id='year-wise-consumption'
						options={{
							chart: {id: 'year-wise-consumption'},
							xaxis: {
								categories: xaxis?.map((item) =>
									format(new Date(0, item, 0), 'MMMM')
								),
								title: {
									text: 'Month',
									style: {fontSize: '14px'},
								},
								labels: {
									style: {
										fontSize: '14px',
									},
								},
							},
							yaxis: {
								title: {
									text: 'kWh',
									style: {fontSize: '14px'},
								},
								labels: {
									style: {
										fontSize: '14px',
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
				) : (
					<div style={{height: 500}}>
						<CircularProgress />
					</div>
				)}
			</ChartWrapper>
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
	chart: {
		toolbar: {
			tools: {
				download: false,
			},
		},
	},
	dataLabels: {
		enabled: true,
		offsetY: -20,
		style: {
			colors: ['#2297e5'],
			fontSize: '14px',
		},
	},
	plotOptions: {
		bar: {
			dataLabels: {
				position: 'top',
			},
			columnWidth: '25%',
		},
	},
}
