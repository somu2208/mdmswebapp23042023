import {fetchMeterDataOfAYear} from 'api/services/hes-dashboard'
import {useMutation} from 'react-query'
import Chart from 'react-apexcharts'
import {ApexOptions} from 'apexcharts'
import {Button, CircularProgress, MenuItem, TextField} from '@mui/material'
import {CHART_HEIGHT} from 'constants/index'
import {getListOfLast10Years, getListOfMonths} from 'utils'
import {useEffect, useState} from 'react'

const Yearly = () => {
	const [year, setYear] = useState<number>(new Date().getFullYear())
	const {data, error, isLoading, mutate} = useMutation(
		'meterDataOfYear',
		fetchMeterDataOfAYear
	)

	useEffect(() => {
		mutate({year: new Date().getFullYear()})
	}, [])

	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({year})
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
					value={year}
					onChange={(e: any) => setYear(parseInt(e.target.value))}
				>
					{getListOfLast10Years().map((item) => (
						<MenuItem value={item}>{item}</MenuItem>
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
							{type: 'column', name: 'Active', data: data?.active},
							{type: 'column', name: 'Inactive', data: data?.installed},
							{type: 'column', name: 'Disconnected', data: data?.disc},
						]}
						options={{
							chart: {
								type: 'bar',
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
								overwriteCategories: getListOfMonths(
									new Date().getFullYear()
								).map((item) => item.name.toString()),
							},
							...chartOptions,
						}}
					/>
					<div className=''>
						<pre>{JSON.stringify(data, null, 2)}</pre>
					</div>
				</>
			) : (
				<div style={{height: 500}}>
					<CircularProgress />
				</div>
			)}
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
