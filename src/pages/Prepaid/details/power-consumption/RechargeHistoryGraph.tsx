import { CircularProgress, Card, CardHeader } from '@mui/material'
import { fetchRechargeHistoryGraph, fetchRechargeHistoryGraphLastUpdated } from 'api/services/prepaid'
import { useQuery } from 'react-query'
import Chart from 'react-apexcharts'
import ChartWrapper from 'components/ChartWrapper'
import { add, eachDayOfInterval, sub } from 'date-fns'
import format from 'date-fns/format'
import { useSearchParams } from 'react-router-dom'
import { add5Hr30Min } from '../../../../utils';

const RechargeHistoryGraph = () => {

	const [search] = useSearchParams();

	const meterId = search.get('meterId')

	const data = useQuery('fetchRechargeHistoryGrapha', () => fetchRechargeHistoryGraph(meterId));
	const lastUpdateTime = useQuery('fetchRechargeHistoryGraphLastUpdated', () => fetchRechargeHistoryGraphLastUpdated(meterId))
	const meter1 = data?.data?.map((item) => (
		{
			...item,
			date: format(add(new Date(item?.date_time_year + '-' + item?.date_time_month + '-' + item?.date_time_day), { days: 1 }), 'yyyy-MM-dd'),
		}))
	const recharge_amounts =
		meter1?.map((item) => (
			((item?.sum?.recharge_amount)?.toFixed(2))
		))
	const balance_at_recharge = meter1?.map((item) => (
		item?.sum?.balance_at_recharge?.toFixed(2)
	))

	const xaxis = meter1?.map((item) => (
		item.date
	))

	return (
		// <ChartWrapper
		// 	title='Recharge history graph'
		// 	time={lastUpdateTime?.data && add5Hr30Min(lastUpdateTime?.data)}
		// >
		<Card sx={{borderRadius: 3}}>
			<CardHeader
				title='Recharge history graph'
				time={lastUpdateTime?.data && add5Hr30Min(lastUpdateTime?.data)}
				sx={{ fontSize: 14 }}
			/>
			<Chart className="apex_chart_override"
				type='bar'
				height={540}
				id='revenueGraph'
				series={[
					{ name: 'Recharge Amount', data: recharge_amounts, },
					// {name: 'Balance', data: balance_at_recharge},
				]}
				options={{
					xaxis: {
						categories: xaxis,
						title: { text: 'Date' },
						labels: {
							style: {
								fontSize: '12px',
							},
						},
					},
					yaxis: {
						decimalsInFloat: 2,
						title: { text: 'Amount in INR' },
						labels: {
							style: {
								fontSize: '12px',
							},
						},
					},
					chart: {
						toolbar: {
							tools: {
								download: false,
							},

						},
					},
					legend: {
						position: 'right',
						offsetY: 10,
					},
					dataLabels: {
						enabled: true,
						offsetY: -20,
						style: {
							fontSize: '12px',
						},
					},
					plotOptions: {
						bar: {
							dataLabels: {
								position: 'top',
							},
							columnWidth: '10%',
						},
					},
					tooltip: {
						style: {
							fontSize: '12px',
						},
					},
					colors:['#407ddd','#dee2e6'],
				}}
			/>
			{/* // </ChartWrapper> */}
		</Card>
	)
}

export default RechargeHistoryGraph;