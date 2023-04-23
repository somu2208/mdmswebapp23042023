import KeyboardBackspace from '@mui/icons-material/KeyboardBackspace'
import { Button, CircularProgress, Grid, Typography, Divider, Breadcrumbs } from '@mui/material'
import { fetchCustomerDetails } from 'api/services/customers'
import { useQuery } from 'react-query'
import { useNavigate, useParams, useSearchParams, NavLink } from 'react-router-dom'
import InstantaneousData from './InstantaneousData'
import MeterCommunication from './MeterCommunication'
import PersonalDetails from './PersonalDetails'
import CustomerPowerConsumption from './power-consumption'
import PowerOutageCount from './power-outage-count'

const CustomerDetails = () => {
	const { consumerId } = useParams()
	const navigate = useNavigate()

	const {
		data: customerDetails,
		error: error2,
		isLoading: detailsLoading,
	} = useQuery('customerDetails', () =>
		fetchCustomerDetails({ uscNumber: consumerId })
	)

	if (detailsLoading) {
		return (
			// <div className='flex items-center justify-center w-full h-screen'>
			<Grid sx={{textAlign:"center"}}>
				<CircularProgress />
			</Grid>
		)
	}

	return (
		<>

			{/* <Grid md={12} justifyContent="space-between" container >
				<Grid md={6}>
					<Typography variant="h3" gutterBottom sx={{ color: "black" }}>
						Customer Details
					</Typography>
				</Grid>
				<Grid md={6} sx={{textAlign:"right"}}>
					<Button
						size='small'
						variant='outlined'
						color='secondary'
						startIcon={<KeyboardBackspace />}
						onClick={() => navigate('/customers')}
					>
						Back
					</Button>
				</Grid>
			</Grid> */}

			<Grid md={6} mb={2} mt={2}>
				<Typography variant="h3" gutterBottom sx={{ color: "black" }} >
					Customer Details
				</Typography>
				<Breadcrumbs aria-label="breadcrumb" className='breadcrumbtext'>
					<NavLink to="/customers">Customers </NavLink>
					<Typography variant="caption">Customer Details</Typography>
				</Breadcrumbs>
			</Grid>

			<Divider />


			{/* <div className='px-5 pt-5'>
				<Button
					color='secondary'
					startIcon={<KeyboardBackspace />}
					onClick={() => navigate('/customers')}
				>
					Back
				</Button>
			</div> */}

			{/* <div className='px-5 rounded-lg space-y-6 pb-32'> */}
			<Grid md={12} className='rounded-lg'>
				<PersonalDetails c={customerDetails} />
				<MeterCommunication />
				<InstantaneousData />
				<CustomerPowerConsumption />
				{/* <PowerOutageCount /> */}
			</Grid>
			{/* </div> */}
		</>
	)
}

export default CustomerDetails
