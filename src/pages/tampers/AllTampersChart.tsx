import { CircularProgress,Grid } from '@mui/material'
import { fetchCumulativeTampers } from 'api/services/tampers'
import Card from 'pages/customers/details/components/DetailsCard'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
const AllTampersChart = () => {
	const params = useParams()
	const meterId = params.meterId
	const { data, isLoading, error } = useQuery('tampersCumulative', () =>
		fetchCumulativeTampers({ meterId })
	)

	return (
		<Card
			title='Tampers of each meter count'
			subtitle={`Latest Update Time: ${data?.latestUpdateTime}`}
		>
			{isLoading ? (
				// <div className='flex items-center justify-center pt-10'>
				<Grid sx={{textAlign:"center",pt:5}}>
					<CircularProgress />
				</Grid>
			) : (
				<Grid>
					<Chart
						type='bar'
						height={540}
						id='last30DaysActiveMeters'
						series={[
							{
								data: data?.series1.map((item) => item.count),
								name: 'Occurrence',
							},
							{
								data: data?.series2.map((item) => item.count),
								name: 'Restore',
							},
						]}
						options={{
							xaxis: {
								categories: data?.xaxis,
								title: { text: 'Event Type' },
								labels: {
									style: {
										fontSize: '12px',
									},
								},
							},
							yaxis: {
								title: { text: 'count' },
								labels: {
									style: {
										fontSize: '12px',
									},
								},
							},
							dataLabels: {
								enabled: true,
								style: {
									fontSize: '14px',
								},
							},
							legend: {
								position: 'top',
								offsetY: 0,
							},
							colors: ['#407ddd', '#dee2e6'],
							...chartOptions,
						}}
					/>
				</Grid>
			)}
		</Card>
	)
}

export default AllTampersChart
const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		width: 2.5,
	},
	plotOptions: {
		bar: {
			columnWidth: '50%',

		},
	},
	chart: {
		toolbar: {
			tools: {
				download: false,
			},
		},
	},
}