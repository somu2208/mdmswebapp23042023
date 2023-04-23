import { CircularProgress } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import { fetchTodaysDataSyncInstant } from 'api/services/dashboard'
import { CHART_HEIGHT } from 'constants/index'
import Chart from 'react-apexcharts'
import { useQuery } from 'react-query'

const DataSyncInstant = () => {
	const { data, isLoading, error } = useQuery('dataSyncInstant', () =>
		fetchTodaysDataSyncInstant()
	)
	// console.log("Instantaneous Data: ",data)
	
	// const {data} = useQuery('dataSyncInstant', () =>
	// 	fetchTimeInstant()
	// )

	if (isLoading) {
		return <CircularProgress />
	}

	if (error) return <div>Server Error</div>
	return (
		<div className='max-h-[500px]'>
			{data?.length ? (
				<Chart
					height={CHART_HEIGHT}
					series={[
						{
							type: 'line',
							name: 'Active',
							data: data?.map((item) => item.value),
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
							size: 5,
						},
						dataLabels: {
							enabled: true,
							style: {
								fontSize: '12px',
							},
						},
						xaxis: {
							type: 'category',
							categories: data?.map((item) => item.timeStamp),
							labels: {
								rotate: -45,
								rotateAlways: false,
								style: {
									fontSize: '12px',
								},
							},
						},
						yaxis: {
							labels: {
								style: {
									fontSize: '12px',
								},
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

export default DataSyncInstant

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