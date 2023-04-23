import {fetchMeterDataOfMonth} from 'api/services/hes-dashboard'
import {useMutation} from 'react-query'
import Chart from 'react-apexcharts'
import {ApexOptions} from 'apexcharts'
import {Button, CircularProgress, MenuItem, TextField} from '@mui/material'
import {CHART_HEIGHT} from 'constants/index'
import {getDaysOfMonth, getListOfMonths} from 'utils'
import {useEffect, useState} from 'react'

const Monthly = () => {
	const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
	const {data, error, isLoading, mutate} = useMutation(
		'meterDataOfMonth',
		fetchMeterDataOfMonth
	)

	useEffect(() => {
		mutate({month: new Date().getMonth() + 1})
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({month})
	}

	if (error) {
		return <div>Server Error</div>
	}

	return (
		<div>
			<form className='flex gap-2' onSubmit={handleSubmit}>
				<TextField
					select
					size='small'
					variant='outlined'
					value={month}
					onChange={(e: any) => setMonth(parseInt(e.target.value))}
				>
					{getListOfMonths(new Date().getFullYear()).map((item) => (
						<MenuItem value={item.value}>{item.name}</MenuItem>
					))}
				</TextField>
				<Button type='submit' color='primary' variant='contained' size='small'>
					Submit
				</Button>
			</form>
			{!isLoading ? (
				<>
					<Chart
						height={CHART_HEIGHT}
						type='bar'
						series={[
							{
								type: 'column',
								name: 'Active',
								data: data?.active,
							},
							{
								type: 'column',
								name: 'Inactive',
								data: data?.inactive,
							},
							{
								type: 'column',
								name: 'Disconnected',
								data: data?.disc,
							},
							{
								name: 'Installed',
								data: data?.total,
								type: 'line',
							},
						]}
						options={{
							chart: {
								stacked: true,
								toolbar: {
									show: true,
								},
								zoom: {
									enabled: true,
								},
							},
							plotOptions: {
								bar: {
									horizontal: false,
								},
							},
							xaxis: {
								type: 'category',
								overwriteCategories: getDaysOfMonth(month).map((item) =>
									item.toString()
								),
							},
							...chartOptions,
						}}
					/>
				</>
			) : (
				<div style={{height: 500}}>
					<CircularProgress />
				</div>
			)}
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
	plotOptions: {
		bar: {},
	},
	chart: {
		toolbar: {
			tools: {
				download: false,
			},
		},
	},
}
