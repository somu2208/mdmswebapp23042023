import { KeyboardBackspace } from '@mui/icons-material'
import { Button, Typography, Grid, Divider, Breadcrumbs } from '@mui/material'
import {
	Outlet,
	Routes,
	Route,
	NavLink,
	useResolvedPath,
	useMatch,
	useSearchParams,
	useNavigate,
	useParams,
} from 'react-router-dom'
import Billing from './Billing'
import BlockLoad from './BlockLoad'
import ConsumerDetails from './ConsumerDetails'
import DailyLoad from './DailyLoad'
import Events from './Events'
import Instantaneous from './Instantaneous'
import NamePlateDetails from './NamePlateDetails'
import _DataProvider from './_DataProvider'

const Meters360 = () => {
	return (
		<_DataProvider>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<ConsumerDetails />} />
					{routes.map(({ path, component: Component }) => (
						<Route path={path} element={<Component />} />
					))}
				</Route>
			</Routes>
		</_DataProvider>
	)
}

export default Meters360

const Layout = () => {
	const navigate = useNavigate()
	const params = useParams()
	return (
		<>

			<Grid justifyContent="space-between" container>
				<Grid md={6} mb={2} mt={2}>
					<Typography variant="h3" gutterBottom sx={{ color: "black"}} >
						Meter serial number : {params?.meterId}
					</Typography>
					<Breadcrumbs aria-label="breadcrumb" className='breadcrumbtext'>
						<NavLink to="/meters">Meter</NavLink>
						<NavLink to="/meters">Deployed Meters</NavLink>
						<Typography variant="caption">Meter serial number : {params?.meterId}</Typography>
					</Breadcrumbs>
				</Grid>
				
				{/*<Grid md={6} className="text-right">
					<Button
						size='small'
						variant='outlined'
						color='secondary'
						startIcon={<KeyboardBackspace />}
						onClick={() => navigate(`/meters`)}
					>
						Back
					</Button>
				</Grid>*/}
			</Grid>

			<Divider />
			<nav className='flex items-center list-none mt-5 meternavigation'>
				{routes.map((item) => (
					 <NavItem key={item.name} label={item.name} to={item.path} /> 
				))}
			</nav>
			<Grid className="tab-box">
				{/*<nav className='flex items-center list-none mt-5 meternavigation'>
					<Breadcrumbs aria-label="breadcrumb" className='meternavigation'>{routes.map((item) => (
						 <NavItem key={item.name} label={item.name} to={item.path} /> 
					))}</Breadcrumbs>
				</nav>*/}
				
				<Grid>
					<Outlet/>
				</Grid>
			</Grid>
		</>
	)
}

const NavItem = ({ label, to }) => {
	let mypath = to
	let resolved = useResolvedPath(mypath)
	let match = useMatch({ path: resolved.pathname, end: true })
	const [search] = useSearchParams()

	return (
		<NavLink
			to={{ pathname: to, search: search.toString() }}
			className={`p-1.5 px-3 cursor-pointer hover:bg-gray-100 ${match
				? 'activemeternav'
				: ''
				}`}
		>
			{label}
		</NavLink>
	)
}

const routes = [
	{
		path: 'instantaneous',
		name: 'Instantaneous',
		component: Instantaneous,
	},
	{
		path: 'block-load',
		name: 'Block Load',
		component: BlockLoad,
	},
	{
		path: 'daily-load',
		name: 'Daily Load',
		component: DailyLoad,
	},
	{
		path: 'billing',
		name: 'Billing',
		component: Billing,
	},
	{
		path: 'events',
		name: 'Events',
		component: Events,
	},
	{
		path: 'customer-details',
		name: 'Consumer Details',
		component: ConsumerDetails,
	},
	{
		path: 'name-plate-details',
		name: 'Name Plate Details',
		component: NamePlateDetails,
	},
]
