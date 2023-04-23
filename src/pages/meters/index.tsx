import {Outlet, Route, Routes} from 'react-router-dom'
import AddMeters from './add-meters'
import MeterDataPage from './meter-data'
import Meters360 from './meters360'
import MetersTable from './table'
import ViewMeterDetails from './ViewMeter'
import { Typography, Grid } from '@mui/material'

const Meters = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<MetersTable />} />
				<Route path=':meterId/*' element={<ViewMeterDetails />} />
				<Route path='/data/*' element={<MeterDataPage />} />
				<Route path='add' element={<AddMeters />} />
				<Route path=':meterId/meter360/*' element={<Meters360 />} />
				<Route path='*' element={<Typography variant="h1">Page Not Found</Typography>} />
			</Route>
		</Routes>
	)
}

export default Meters
Meters.title = 'Meters'

const Layout = () => {
	return (
		<>
			<Grid>
				<Outlet />
			</Grid>
		</>
	)
}
