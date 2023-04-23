import { KeyboardBackspace } from '@mui/icons-material'
import { Button, Grid, MenuItem, TextField, Divider, Typography, Box } from '@mui/material'
import http, { access_token } from 'api/http'
import ExcelImport from 'components/Excelmport'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { NavLink, Link, useParams } from 'react-router-dom'


export const addCustomersExcelImport = async (jsonData) => {
	return await http({
		url: '/items/consumer',
		method: 'POST',
		params: {
			access_token,
		},
		data: jsonData,
	})
}

function AddCustomer() {
	const navigate = useNavigate()
	return (
		<>

			<Grid md={12} justifyContent="space-between"  >

				<Grid md={6} mb={2} mt={2}>
					<Typography variant="h3" gutterBottom sx={{ color: "black" }} >
						Add Customer
					</Typography>
					<Breadcrumbs aria-label="breadcrumb" className='breadcrumbtext'>
						<NavLink to="/customers">Customers </NavLink>
						<Typography variant="caption">Add Customer</Typography>
					</Breadcrumbs>
				</Grid>

				{/* <Typography variant="h3" gutterBottom sx={{ color: "black" }}>
					Add Customer
				</Typography>

				<Breadcrumbs aria-label='breadcrumb'>
					<Link to='/customers'>
						<Typography color="inherit">Customers</Typography>
					</Link>
					<Typography color="text.primary"> Add Customer </Typography>
				</Breadcrumbs> */}

				{/* <Grid md={6}>
					<Typography variant="h3" gutterBottom sx={{ color: "black"}}>
						Add Customer
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
				</Grid> */}
			</Grid>

			<Divider />

			{/* <div className='space-y-7 pb-16 px-5 pt-5'> */}
			<Grid md={12} sx={{ mt: 3 }}>
				<Grid sx={{ backgroundColor: "white", p: 5 }} className="rounded-xl">
					{/* <div className='bg-white rounded-xl p-5'> */}

					{/* <h4 className='text-xl text-secondary py-5 font-semibold'>
						Add Customer
					</h4> */}
					{/* <CustomerDetails /> */}
					{/* <HierarchyDetails /> */}
					<ExcelImport
						postTo={addCustomersExcelImport}
						redirectPath='/customers'
					/>
					{/* </div> */}
				</Grid>
			</Grid>
			{/* </div> */}
		</>
	)
}

const CustomerDetails = () => {
	return (
		<div className='p-2'>
			<div className='border mt-3 pb-5 rounded-md'>
				<div className='bg-gray-200'>
					<h5 className='text-md text-gray-600 p-2 mb-5'>Consumer Details</h5>
				</div>
				<Grid container spacing={3} className='px-5 py-2'>
					<Grid item xs={6}>
						<TextField
							size='small'
							variant='outlined'
							label='Customer Service Number'
							fullWidth
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							variant='outlined'
							label='Customer Service Name'
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							variant='outlined'
							label='Customer Phone Number'
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							variant='outlined'
							label='Customer Address'
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							variant='outlined'
							label='State'
							select
						>
							<MenuItem>Telangana</MenuItem>
							<MenuItem>Adhra Pradesh</MenuItem>
							<MenuItem>Tamilndadu</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={6}>
						<TextField fullWidth size='small' variant='outlined' label='City' />
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							type='number'
							variant='outlined'
							label='PinCode'
						/>
					</Grid>
				</Grid>
			</div>
		</div>
	)
}

const HierarchyDetails = () => {
	return (
		<div className='p-2'>
			<div className='border mt-3 pb-5 rounded-md'>
				<div className='bg-gray-200'>
					<h5 className='text-md text-gray-600 p-2 mb-5'>Hierarchy details</h5>
				</div>
				<Grid container spacing={3} className='px-5 py-2'>
					<Grid item xs={6}>
						<TextField
							size='small'
							variant='outlined'
							label='Customer Utility'
							fullWidth
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							variant='outlined'
							label='Customer Section'
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							variant='outlined'
							label='Customer Area'
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							variant='outlined'
							label='Customer ERO'
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField fullWidth size='small' variant='outlined' label='City' />
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							type='number'
							variant='outlined'
							label='Customer SubGroup'
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							fullWidth
							size='small'
							type='number'
							variant='outlined'
							label='Customer Category'
						/>
					</Grid>
				</Grid>
			</div>
		</div>
	)
}

export default AddCustomer
