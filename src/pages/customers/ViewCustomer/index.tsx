import { Breadcrumbs, CircularProgress, Grid, Divider, Typography, Box, TextField as MuiTextField } from '@mui/material'
import { getData } from './getData'
import { useQuery, UseQueryResult } from 'react-query'
import { fetchCustomerViewDetails } from 'api/services/customers'
import { Link, useParams, NavLink } from 'react-router-dom'
import styled from "styled-components/macro";
import { spacing } from "@mui/system";

function ViewCustomer() {
	
	const TextFieldSpacing = styled(MuiTextField)(spacing);
	const TextField = styled(TextFieldSpacing)`width: 100%;background-color: #efefef8a`;
	
	const params = useParams()

	const { data, isLoading, error }: UseQueryResult<any, Error> = useQuery(
		['customer-view-details', params.consumerId],
		fetchCustomerViewDetails
	)

	if (isLoading) {
		return (
			<Grid className='flex items-center justify-center w-full h-screen'>
				<CircularProgress />
			</Grid>
		)
	}

	if (error) {
		return <Grid className='text-lg text-gray-700 p-4'>{error?.message}</Grid>
	}

	return (
		<>

			{/* <Breadcrumbs aria-label='breadcrumb'>
				<Link to='/customers'>
					<Typography variant="h5" sx={{ color: "black", pl: 3 }}>Customers</Typography>
				</Link>
				<Typography variant="h5" sx={{ color: "black" }}> {params?.consumerId} </Typography>
			</Breadcrumbs> */}

			<Grid md={6} mb={2} mt={2}>
				<Typography variant="h3" gutterBottom sx={{ color: "black" }} >
					Customer Details
				</Typography>
				<Breadcrumbs aria-label="breadcrumb" className='breadcrumbtext'>
					<NavLink to="/customers">Customers </NavLink>
					<Typography variant="caption">Customer Detail</Typography>
				</Breadcrumbs>
			</Grid>

			<Divider />

			<Box >
				<Box sx={{ borderRadius: 3 }}>
					{getData(data?.data?.data[0]).map((item, index) => (
						<Grid sx={{ backgroundColor: "white", border: "1px solid #e5e7eb", mt: 5, borderRadius: 3 }} key={index}>

							<Grid sx={{ borderBottom: '1px solid #eee' }}>
								<Typography variant="h6" p={2} sx={{ fontWeight: 500, color: "black" }}> {item.title} </Typography>
							</Grid>

							<Grid container>
								{item.values.map((item, index) => (
									<Grid item xs={4} key={index}>
										<Grid p={2} pl={3}>
											{/*<Typography variant="h6" sx={{ color: "gray", mb: 1, fontWeight: 500  }}> {item.label} </Typography>
											<Typography sx={{ fontSize: 14 }}> {item.value} </Typography>*/}
											
											<TextField						
												value={item.value}
												label={item.label}
												id="standard-read-only-input"
												variant="outlined"	
												InputLabelProps={{
													shrink: true,
												}}
												InputProps={{
													readOnly: true,
												}}
											/>
											
											
											{/*<Typography  sx={{ fontSize: 10 }}> {item.label} </Typography>
											<Typography variant="h6" sx={{ color: "gray", mb: 1, fontWeight: 500 }}> {item.value} </Typography>*/}
											
										</Grid>
									</Grid>
								))}
							</Grid>

						</Grid>
					))}
				</Box>
			</Box>
		</>
	)
}

export default ViewCustomer
