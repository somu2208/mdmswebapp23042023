import {fetchMeterDataOfDay} from 'api/services/hes-dashboard'
import {useQuery} from 'react-query'
import Chart from 'react-apexcharts'
import format from 'date-fns/format'
import {ApexOptions} from 'apexcharts'
import {CircularProgress} from '@mui/material'
import {CHART_HEIGHT} from 'constants/index'

const Daily = () => {
	const {data, error, isLoading} = useQuery('dailyMeter', fetchMeterDataOfDay)

	return (
		<div className='max-h-[500px]'>
			{!isLoading ? (
				<Chart
					height={CHART_HEIGHT}
					series={[
						{
							name: 'Active',
							data: [data?.active],
						},
						{
							name: 'Inactive',
							data: [data?.inactive],
						},
						{
							name: 'Disconnected',
							data: [data?.disc],
						},
					]}
					options={{
						chart: {
							type: 'bar',
							stacked: true,
							toolbar: {
								show: true,
								tools: {
									download: false,
								},
							},
							zoom: {
								enabled: true,
							},
						},
						plotOptions: {
							bar: {
								columnWidth: '5%',
								horizontal: false,
							},
						},
						yaxis: {
							title: {text: 'Date'},
						},
						xaxis: {
							type: 'category',
							categories: [format(new Date(), 'yyy-MM-dd')],
						},
						legend: {
							position: 'top',
							offsetY: 0,
						},
						stroke: {
							width: 2.5,
						},
					}}
				/>
			) : (
				<div style={{height: 500}}>
					<CircularProgress />
				</div>
			)}
		</div>
	)
}

export default Daily

const chartOptions: ApexOptions = {}
