import { CircularProgress, Grid, Typography, Box } from '@mui/material'
import { fetchNamePlateDetails } from 'api/services/meters'
import Card from 'pages/customers/details/components/DetailsCard'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import {add5Hr30Min} from 'utils'

const NamePlateDetails = () => {
	const params = useParams()

	const { data, isLoading, error } = useQuery('namePlateDetails', () =>
		fetchNamePlateDetails({ meterId: params.meterId })
	)

	if (isLoading)
		return (
			// <div className='flex items-center justify-center pt-10'>
			<Grid sx={{textAlign:"center", pt:5}}>
				<CircularProgress />
			</Grid>
		)

	if (error) return <div>Server Error</div>

	return (
		<>
			{/*<Card title='Name Plate Details'>
		<div className='grid grid-cols-2 gap-3 gap-y-8'>*/}

			<Box sx={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius:3 }} mt={0} pb={5}>
				<Grid  sx={{borderBottom: "1px solid #eee"}}>
					<Typography variant="h6" p={2} sx={{color:"black",fontWeight:500}}> Name plate details </Typography>
				</Grid>
				<Grid container className='px-5' mt={1}>
					{data?.data?.data?.length ? (
						getFormattedData(data?.data?.data[0])?.map((item, index) => (
							<Grid item xs={4} key={index}>
								<Grid mb={1} p={1}>
									<Typography variant="h6" mb={1}> {item.label} </Typography>
									<Typography> {item.value ? item.value : 'NA'} </Typography>
								</Grid>
							</Grid>
						))
					) : (
						<Typography>
							There is no customer service number associated with this meter
							serial number
						</Typography>
					)}
				</Grid>
			</Box>
			{/*</Card>*/}
		</>
	)
}

export default NamePlateDetails

const getFormattedData = (data) => {
const dateFields = ['server_timestamp', 'source_timestamp']
const filterFields = ['utility_id']
	if (data) {
		
		//return Object.entries(data).map(([key, value]) => {
		//	return {
		//		label: (key.charAt(0).toUpperCase() + key.slice(1))
		//			.split('_')
		//			.join(' '),
		//		value: value,
		//	}
		//})

		return Object.entries(data)
			.map(([key, value]) => {
				return {
					key: key,
					label: (key.charAt(0).toUpperCase() + key.slice(1))
						.split('_')
						.join(' '),
					value: dateFields.includes(key) ? add5Hr30Min(value) : value,
				}
			})
			.filter((item) => !filterFields.includes(item.key))
	}
}
