import {FlashAutoOutlined} from '@mui/icons-material'
import {CircularProgress} from '@mui/material'
import {fetchConsumerMeterCommunication} from 'api/services/customers'
import {useQuery, UseQueryResult} from 'react-query'
import {useSearchParams} from 'react-router-dom'
import Card from './components/DetailsCard'
import AccessTime from '@mui/icons-material/AccessTime'
import format from 'date-fns/format'

const MeterCommunication = () => {
	const [search] = useSearchParams()
	const phase = search.get('meter_type')

	const {data, isLoading, error}: UseQueryResult<any, Error> = useQuery(
		'consumerMeterCommunication',
		() =>
			fetchConsumerMeterCommunication({
				phaseType: phase as '1' | '2',
				meterId: search.get('meterId'),
			})
	)

	const formatdate = (date: any) => {
		return data ? format(new Date(date), 'dd/MM/yyyy HH:mm:ss') : '-'
	}

	if (error) return <div>Server Error</div>
	return (
		<div className='h-full'>
			<Card icon={FlashAutoOutlined} title='Meter Communication'>
				{!isLoading ? (
					<div className='space-y-5'>
						<MeterCard
							label='Latest instantaneous data sync time'
							value={formatdate(data?.dailyLoad)}
						/>
						<MeterCard
							label='Latest block load data sync time'
							value={formatdate(data?.blockLoad)}
						/>
						<MeterCard
							label='Latest billing data sync time'
							value={formatdate(data?.blockLoad)}
						/>
						<MeterCard
							label='Latest event data sync time'
							value={formatdate(data?.blockLoad)}
						/>
					</div>
				) : (
					<div className='flex justify-center items-center min-h-[300px]'>
						<CircularProgress />
					</div>
				)}
			</Card>
		</div>
	)
}

export default MeterCommunication

const MeterCard = ({label, value}) => {
	return (
		<div className='flex items-center px-4'>
			<div className='flex gap-1 w-1/3'>
				<AccessTime className='text-gray-500' />
				<span className=''>{label}</span>
			</div>
			<p className='text-gray-700 font-semibold py-1 px-4 rounded-2xl'>
				{value}
			</p>
		</div>
	)
}
