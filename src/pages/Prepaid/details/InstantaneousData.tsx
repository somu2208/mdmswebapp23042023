import {CircularProgress} from '@mui/material'
import {fetchLatestDateTimeForDataSync} from 'api/services/time-labels'
import {useQuery, UseQueryResult} from 'react-query'
import Card from './components/DetailsCard'
import {format} from 'date-fns'
import {fetchCustomerInstantaneousDetails} from 'api/services/customers'
import {useSearchParams} from 'react-router-dom'

const InstantaneousData = () => {
	const {data, isLoading}: UseQueryResult<any, Error> = useQuery(
		['latest-date-time-sync'],
		fetchLatestDateTimeForDataSync
	)
	const [search] = useSearchParams()
	const meterId = search.get('meterId')
	const meterTypeKey = search.get('meter_type') as '1' | '2'

	const {
		data: details,
		error: detailsError,
		isLoading: detailsLoading,
	} = useQuery('customerDetailsInstantaneous', () =>
		fetchCustomerInstantaneousDetails({meterId, meterTypeKey})
	)

	const fields =
		details &&
		Object.entries(details).map((item) => ({
			label: (item[0].charAt(0).toUpperCase() + item[0].slice(1))
				.split('_')
				.join(' '),
			value: getFormattedValue(item[0], item[1]),
		}))

	if (isLoading || detailsLoading) {
		return (
			<div className='flex justify-center py-10'>
				<CircularProgress />
			</div>
		)
	}

	if (detailsError) return <p>There is no meter for this customer</p>

	return (
		<Card
			title='Instantaneous Data'
			subtitle={`Latest Updated Time: ${format(
				new Date(data?.data?.data[0]?.server_date_time),
				'dd/MM/yyyy HH:mm:ss'
			)}`}
		>
			<div className='grid gap-4 grid-cols-3 gap-y-8'>
				{fields?.map((item, index) => (
					<Card.Item key={index} value={item.value} label={item.label} />
				))}
			</div>
		</Card>
	)
}

export default InstantaneousData

const getFormattedValue = (key: any, value: any) => {
	switch (key) {
		case 'cumulative_energy_kWh_import':
		case 'cumulative_energy_kVAh_import':
		case 'maximum_demand_kW':
		case 'maximum_demand_kVA':
		case 'cumulative_energy_kWh_export':
		case 'cumulative_energy_kVAh_export':
		case 'load_limit_value_kw':
			return value / 1000

		case 'cumulative_power_on_duration':
		case 'cumulative_power_off_duration':
			return value / 60

		case 'server_timestamp':
		case 'source_timestamp':
			return value ? format(new Date(value), 'dd/MM/yyyy HH:mm:ss') : null
		default:
			return value
	}
}
