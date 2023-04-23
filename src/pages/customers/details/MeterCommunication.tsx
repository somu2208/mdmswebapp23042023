import {FlashAutoOutlined} from '@mui/icons-material'
import {CircularProgress,Typography, Grid} from '@mui/material'
import {fetchConsumerMeterCommunication} from 'api/services/customers'
import {useQuery, UseQueryResult} from 'react-query'
import {useSearchParams} from 'react-router-dom'
import Card from './components/DetailsCard'
import AccessTime from '@mui/icons-material/AccessTime'
import {format} from 'date-fns'
import {add5Hr30Min} from 'utils'

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
	console.log("xdfdvghghjhghh",data)

	const formatdate = (date: any) => {
		return data ? add5Hr30Min(date) : '-'
	}

	if (error) return <Typography>Server Error</Typography>

	return (
		// className='h-full'
		<Grid md={12}>
			<Card icon={FlashAutoOutlined} title='Meter communication'>
				{!isLoading ? (
					<Grid className='space-y-5'>
						<MeterCard
							label='Latest instantaneous data sync time'
							value={formatdate(data?.lastSyncTime)}
						/>
						<MeterCard
							label='Latest block load data sync time'
							value={formatdate(data?.blockLoad)}
						/>
						<MeterCard
							label='Latest billing data sync time'
							value={formatdate(data?.billing)}
						/>
						<MeterCard
							label='Latest event data sync time'
							value={formatdate(data?.events)}
						/>
						<MeterCard
							label='Latest daily load data sync time'
							value={formatdate(data?.dailyLoad)}
						/>
					</Grid>
				) : (
					<Grid className='flex justify-center items-center min-h-[300px]'>
						<CircularProgress />
					</Grid>
				)}
			</Card>
		</Grid>
	)
}

export default MeterCommunication

const MeterCard = ({label, value}) => {
	return (
		// <div className='flex items-center px-4'>
		<Grid className='flex items-center px-4'>
			<Grid className='flex gap-1 w-1/3'>
				<AccessTime className='text-gray-500' />
				{/* <span className=''>{label}</span>  */}
				<Typography> {label} </Typography>
			</Grid>
			{/* <p className='text-gray-700 font-semibold py-1 px-4 rounded-2xl'>
				{value}
			</p> */}
			<Typography className='text-gray-700 font-semibold py-1 px-4 rounded-2xl'> {value} </Typography>
		</Grid>	
		// </div>
	)
}
