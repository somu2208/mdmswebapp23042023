import { CircularProgress, Grid, Typography } from '@mui/material'
import { fetchInstantaneousLasteDateTimeForDataSync } from 'api/services/time-labels'
import { useQuery, UseQueryResult } from 'react-query'
import Card from './components/DetailsCard'
import { format } from 'date-fns'
import { fetchCustomerInstantaneousDetails } from 'api/services/customers'
import { useSearchParams } from 'react-router-dom'
import { add5Hr30Min } from 'utils'

const InstantaneousData = () => {
	
	const [search] = useSearchParams()
	const meterId = search.get('meterId')
	const meterTypeKey = search.get('meter_type') as '1' | '2'
	
	const { data, isLoading }: UseQueryResult<any, Error> = useQuery(
		'latest-date-time-sync', () =>
		fetchInstantaneousLasteDateTimeForDataSync({ meterId, meterTypeKey })
	)	
	
	
	const {
		data: details,
		error: detailsError,
		isLoading: detailsLoading,
	} = useQuery('customerDetailsInstantaneous', () =>
		fetchCustomerInstantaneousDetails({ meterId, meterTypeKey })
	)
// console.log("dddddddddddddddddddddddddddddddddddddddd",details)
	const fields =
		details &&
		Object.entries(details).map((item) => ({
			label: (item[0].charAt(0).toUpperCase() + item[0].slice(1))
				.split('_')
				.join(' '),
			value: getFormattedValue(item[0], item[1]),
		}))
	// console.log("dddddddddddddddddddddddddddddddddddddddd",fields)

if(fields){
	const indexVoltage=fields.findIndex((data)=>data.label==="Voltage")
	const indexPhase = fields.findIndex((data)=>data.label==="Phase current")
	const indexNeutral = fields.findIndex((data)=>data.label==="Neutral current")
	const indexFreq = fields.findIndex((data)=>data.label==="Frequency")
	const indexApparent = fields.findIndex((data)=>data.label==="Apparent power")
	const indexActive = fields.findIndex((data)=>data.label==="Active power")
	const indexCumm = fields.findIndex((data)=>data.label==="Cumulative power on duration")


	if(indexVoltage){
		fields[indexVoltage].label="Voltage(V)";
	}

	if(indexPhase){
		fields[indexPhase].label="Phase current(A)";
	}

	if(indexNeutral){
		fields[indexNeutral].label="Neutral current(A)";
	}

	if(indexFreq){
		fields[indexFreq].label="Frequency(Hz)";
	}

	if(indexApparent){
		fields[indexApparent].label="Apparent power(VA)";
	}

	if(indexActive){
		fields[indexActive].label="Active power(W)";
	}

	if(indexCumm){
		fields[indexCumm].label="Cumulative power on duration(Hours)";
	}
}
	

	const filtered = fields?.filter(
		(item) =>
			item.label !== 'Maximum demand kW capture time' &&
			item.label !== 'Maximum demand kVA capture time' &&
			item.label !== 'Cumulative power off duration' &&
			item.label !== 'Last billing date' &&
			item.label !== 'Cumulative no of power failures' &&
			item.label !== 'Utility id'
	)


	// console.log("fields",fields)
	// console.log("filtered",filtered)
	
	const formatdate = (date: any) => {
		return data ? add5Hr30Min(date) : '-'
	}
	
	if (isLoading || detailsLoading) {
		return (
			// <div className='flex justify-center py-10'>
			<Grid sx={{textAlign:"center",mt:5}}>
				<CircularProgress />
			</Grid>
		)
	}

	if (detailsError) return <Typography>There is no meter for this customer</Typography>

	return (
		<Card
			title='Instantaneous data'
			subtitle={`Latest Updated Time: ${formatdate(data?.lastSyncTime)}`}
		>
			<div className='grid gap-4 grid-cols-3 gap-y-8'>
				{filtered?.map((item, index) => (
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
			return value.toFixed(2)
		case 'cumulative_power_off_duration':
			return value / 60

		case 'server_timestamp':
		case 'source_timestamp':
			return value ? add5Hr30Min(value) : null
		default:
			return value
	}
}
