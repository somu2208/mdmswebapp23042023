import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchTodaysDataSyncDailyLoadThree} from 'api/services/dashboard'
import {CHART_HEIGHT} from 'constants/index'
import format from 'date-fns/format'
import Chart from 'react-apexcharts'
import {useQuery} from 'react-query'

const DataSyncDailyThree = () => {
	const {data, isLoading, error} = useQuery(
		'dataSyncInstantDailyLoadThree',
		fetchTodaysDataSyncDailyLoadThree
	)

    	// console.log("Daily Load Three Phase Data: ",data)

	if (isLoading) return <CircularProgress />
	return (
		<div className='max-h-[500px]'>
			{data ? (
				<Chart
					height={CHART_HEIGHT}
					series={[
						{
							type: 'column',
							name: 'Daily load',
							data: [data?.value],
						},
					]}
					options={{
						chart: {
							type: 'bar',
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
						xaxis: {
							type: 'category',
							title: {text: 'Date'},
							overwriteCategories: [format(new Date(), 'MMM dd')],
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
						tooltip: {
							enabled: false,
							x: {
								show: true,
								formatter: (data) => {
									console.log('formatter', data)
									return 'HEllo'
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

export default DataSyncDailyThree

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		curve: 'smooth',
	},
	plotOptions: {
		bar: {
			columnWidth: '4%',
		},
	},
}
