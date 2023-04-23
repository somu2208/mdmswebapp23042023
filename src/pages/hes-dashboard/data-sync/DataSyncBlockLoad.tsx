import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchTodaysDataSyncBlockLoad} from 'api/services/dashboard'
import {CHART_HEIGHT} from 'constants/index'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'

const DataSync2 = () => {
	const {data, isLoading, error} = useQuery(
		'dataSyncInstantBlockLoad',
		fetchTodaysDataSyncBlockLoad
	)
	// console.log("Block Load Data: ",data)

	if (isLoading) return <CircularProgress />

	return (
		<div className='max-h-[500px]'>
			{data?.length ? (
				<Chart
					height={CHART_HEIGHT}
					series={[
						{
							type: 'line',
							name: 'Block Load',
							data: data?.map((item) => item?.value),
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
						dataLabels: {
							enabled: true,
							style: {
								fontSize: '12px',
							},
						},
						tooltip: {
							x: {},
						},
						xaxis: {
							type: 'category',
							categories: data?.map((item) => item?.timeStamp),
							labels: {
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
				<div className=''>No data available</div>
			)}
		</div>
	)
}

export default DataSync2

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
