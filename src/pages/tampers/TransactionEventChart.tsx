import { CircularProgress } from '@mui/material'
import { fetchEventTamperData } from 'api/services/tampers'
import Card from 'pages/customers/details/components/DetailsCard'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const TransactionEventChart = () => {
	const params = useParams()
	const meterId = params.meterId

	const { data, error, isLoading } = useQuery('transactionEventTampers', () =>
		fetchEventTamperData(meterId, '5')
	)

	return (
		<Card
			title='Transaction event tampers'
			subtitle={`Latest update time: ${data?.time || '-'}`}
		>
			{isLoading ? (
				<div className='flex items-center justify-center pt-10'>
					<CircularProgress />
				</div>
			) : (
				<div className=''>
					{data.yaxis?.length > 0 ? (
						<Chart
							type='bar'
							height={540}
							id='voltage-event-tampers'
							series={[
								{
									data: data?.yaxis.map((item) => item.count),
									name: 'Occurrence',
								},
							]}
							options={{
								xaxis: {
									categories: data?.xaxis,
									title: { text: 'Event Type', style: { fontSize: '12px' } },
									labels: {
										style: { fontSize: '12px' },
										minHeight: 200,
									},
								},
								yaxis: {
									title: { text: 'count', style: { fontSize: '12px' } },
									labels: {
										style: { fontSize: '12px' },
									},
								},
								legend: {
									position: 'top',
									offsetY: 0,
								},
								dataLabels: {
									enabled: true,
									style: { fontSize: '12px' },
								},
								colors: ['#407ddd', '#dee2e6'],
								...chartOptions,
							}}
						/>
					) : (
						<p className='text-center'>No Data</p>
					)}
				</div>
			)}
		</Card>
	)
}

export default TransactionEventChart

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
			columnWidth: '80%',
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
