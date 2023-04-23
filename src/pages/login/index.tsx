import {Routes, Route, Outlet} from 'react-router-dom'
import Credentials from './Credentials'
import QrLogin from './QrLogin'

const Login = () => {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Credentials />} />
				<Route path='credentials' element={<QrLogin />} />
			</Route>
		</Routes>
	)
}

export default Login

const Layout = () => {
	return (
		<div className='bg-secondary w-screen h-screen'>
			<div className='bg-primary pb-56 w-screen'></div>
			<div className='space-y-6 pt-20 mt-[-240px]'>
				<div className='text-center'>
					<h2 className='text-white text-2xl font-bold mb-2'>Welcome!</h2>
					<h2 className='text-white text-xl  mb-3'>
						iBot Meter Data Management System
					</h2>
				</div>
				<div className='mx-auto'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}
