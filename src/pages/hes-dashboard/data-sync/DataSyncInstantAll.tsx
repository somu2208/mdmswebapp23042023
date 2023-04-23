import { CircularProgress } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { fetchTodaysDataSyncInstantAllPhase } from 'api/services/dashboard'
import { CHART_HEIGHT } from 'constants/index'
import Chart from 'react-apexcharts'
import { useQuery } from 'react-query'
import {format, sub} from 'date-fns'

const DataSyncInstantAll = () => {

	const {data, isLoading, error} = useQuery(
		'fetchTodaysDataSyncInstantAllPhase',
		fetchTodaysDataSyncInstantAllPhase
	)
	// const { data, isLoading, error } = useQuery('fetchTodaysDataSyncInstantAllPhase', () =>
    // fetchTodaysDataSyncInstantAllPhase()
	// )

	console.log("instantaneous", data);

	if (isLoading) {
		return <CircularProgress />
	}

	if (error) return <div> No data available</div>
	return (
		<div className='max-h-[500px]'>
			{data?.y?.length ? (
				<Chart
					height={CHART_HEIGHT}
					series={[
						{
							type: 'line',
							name: 'Active',
							data: data?.y,
						},
					]}
					options={{
						chart: {
							type: 'line',
							toolbar: {
								show: true,
								tools: {
									download: false,
								},
							},
							zoom: {
								enabled: false,
							},
						},
						markers: {
							size: 2,
						},
						dataLabels: {
							enabled: true,
							style: {
								fontSize: '12px',
							},
						},
						xaxis: {
							type: 'category',
							overwriteCategories: data?.x?.map((item, _index) =>
							item
							),
							title: {text: 'Time', style: {fontSize: '12px'}},
							labels: {
								rotate: -45,
								rotateAlways: true,
								style: {
									fontSize: '12px',
								},
								minHeight: 100,
							},
						},
						yaxis: {
							title: {text: 'Count', style: {fontSize: '12px'}},
							labels: {
								style: {
									fontSize: '12px',
								},
								minWidth: 40,
							},
						},
						...chartOptions,
					}}
				/>
			) : (
				<div className='text-center'>No data available</div>
			)}
		</div>
	)
}

export default DataSyncInstantAll

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		curve: 'smooth',
	},
	plotOptions: {
		bar: {},
	},
}