import { CircularProgress } from '@mui/material'
import { fetchEventTamperData } from 'api/services/tampers'
import Card from 'pages/customers/details/components/DetailsCard'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const VoltageEventTampers = () => {
	const params = useParams()
	const meterId = params.meterId

	const { data, error, isLoading } = useQuery('voltageEventTampers', () =>
		fetchEventTamperData(meterId, '2')
	)

	return (
		<Card
			title='Voltage event tampers'
			subtitle={`Latest update time: ${data?.time}`}
		>
			{isLoading ? (
				<div className='flex items-center justify-center pt-10'>
					<CircularProgress />
				</div>
			) : (
				<div className=''>
					<Chart
						type='bar'
						height={740}
						id='voltage-event-tampers'
						series={[
							{
								data: data?.yaxis.map((item) => item.count),
								name: 'Count',
							},
						]}
						options={{
							xaxis: {
								categories: data?.xaxis,
								title: { text: 'Event Type', style: { fontSize: '12px' } },
								labels: {
									minHeight: 200,
									style: {
										fontSize: '12px',
									},
								},
							},
							yaxis: {
								title: { text: 'count', style: { fontSize: '12px' } },
								labels: {
									style: {
										fontSize: '12px',
									},
								},
							},
							dataLabels: {
								enabled: true,
								style: {
									fontSize: '12px',
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
				</div>
			)}
		</Card>
	)
}

export default VoltageEventTampers

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
			columnWidth: '35%',
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
