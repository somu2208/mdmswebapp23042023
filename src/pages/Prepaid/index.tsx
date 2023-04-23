import {Outlet, Route, Routes} from 'react-router-dom'
// import AddCustomer from './AddCustomer'
import PrepaidDetails from './details'
// import EditCustomer from './edit-customer'
import Provider from './Provider'
import PrepaidTable from './table'
// import ViewCustomer from './ViewCustomer'

const Prepaid = () => {
	return (
		<Provider>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<PrepaidTable />} />
					<Route path='meterdetails' element={<PrepaidDetails />} />
					{/* <Route path='add' element={<AddCustomer />} /> */}
					{/* <Route path=':consumerId/view' element={<ViewCustomer />} />
					<Route path=':consumerId/edit' element={<EditCustomer />} /> */}
				</Route>
			</Routes>
		</Provider>
	)
}

export default Prepaid
Prepaid.title = 'Prepaid'

const Layout = () => {
	return (
		<>
			<main className=''>
				<Outlet />
			</main>
		</>
	)
}
