import {Outlet, Route, Routes} from 'react-router-dom'
import AddCustomer from './AddCustomer'
import CustomerDetails from './details'
import EditCustomer from './edit-customer'
import Provider from './Provider'
import CustomersTable from './table'
import ViewCustomer from './ViewCustomer'

const Customers = () => {
	return (
		<Provider>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<CustomersTable />} />
					<Route path='add' element={<AddCustomer />} />
					{/* <Route path=':consumerId' element={<CustomerDetails />} /> */}
					<Route path=':consumerId' element={<ViewCustomer />} />
					<Route path=':consumerId/view' element={<ViewCustomer />} />
					<Route path=':consumerId/edit' element={<EditCustomer />} />
				</Route>
			</Routes>
		</Provider>
	)
}

export default Customers
Customers.title = 'Customers'

const Layout = () => {
	return (
		<>
			<main className=''>
				<Outlet />
			</main>
		</>
	)
}
