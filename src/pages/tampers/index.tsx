import Meters360 from 'pages/meters/meters360'
import MetersTable from 'pages/meters/table'
import ViewMeterDetails from 'pages/meters/ViewMeter'
import {Outlet, Route, Routes} from 'react-router-dom'

const TampersHome = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<MetersTable />} />
				<Route path=':meterId/*' element={<ViewMeterDetails />} />
				<Route path='add' element={<>Add Meters Page</>} />
				<Route path=':meterId/meter360/*' element={<Meters360 />} />
				<Route path='*' element={<h1>Page Not Found</h1>} />
			</Route>
		</Routes>
	)
}

export default TampersHome
TampersHome.title = 'Tampers'

const Layout = () => {
	return (
		<>
			<main className=''>
				<Outlet />
			</main>
		</>
	)
}
