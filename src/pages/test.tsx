import {fetchTodaysDataSyncInstant} from 'api/services/dashboard'
import {useQuery} from 'react-query'
import DataSyncInstant from './hes-dashboard/data-sync/DataSyncInstant'

export default function TestPage() {
	const {data, isLoading, error} = useQuery('dataSyncInstant', () =>
		fetchTodaysDataSyncInstant()
	)
	return (
		<div className='px-5'>
			<DataSyncInstant />
			{/* <pre>{JSON.stringify(data.x.length, null, 2)}</pre> */}
			{/* <pre>{JSON.stringify(data.y.length, null, 2)}</pre> */}
		</div>
	)
}
