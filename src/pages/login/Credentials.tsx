import { Alert, Button, CircularProgress } from '@mui/material'
import http from 'api/http'
import { fetchAdminEmails, fetchUserDetails } from 'api/services/user'
import Input from 'components/input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';

interface IState {
	email: string
	password: string
}
const initialState: IState = {
	email: '',
	password: '',
}

const Credentials = () => {
	const navigate = useNavigate()
	const [state, setState] = useState<IState>(initialState)
	const [error, setError] = useState<any[]>([])

	const [loading, setLoading] = useState<boolean>(false)

	const handleChange = (name: string, value: any) => {
		setState({ ...state, [name]: value })
	}

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		try {
			setLoading(true)
			const res = await http.post('/auth/login', state)
			const userRes = await fetchUserDetails(state.email)
			// console.log(userRes)
			localStorage.setItem(
				'access_token',
				JSON.stringify({
					...res.data.data,
					expires: res.data.data.expires + Date.now(),
				})
			)
			localStorage.setItem('userDetails', JSON.stringify(userRes.data.data))

			const directusEmails = await fetchAdminEmails()

			const isAdmin = directusEmails
				.map((email) => email.emailid)
				.includes(userRes.data.data[0].email)

			if (isAdmin) {
				// localStorage.setItem('user_role', 'admin')
				return navigate('/select-role', {
					state: 'from-qr-login',
				})
			} else {
				localStorage.setItem('utilityId', JSON.stringify(3))
				window.location.href = '/'
			}
			setLoading(false)
		} catch (err) {
			setError(err.response.data.errors)
			setLoading(false)
		}
	}
	return (
		<div className='login_logo bg-gray-50 p-6 rounded-lg shadow-lg w-[440px] mx-auto'>
			<img src='/logo.png' className='w-1/2 block mx-auto' alt='' />
			<p className='text-gray-400 mb-5 text-center'>Sign In With Credentials</p>
			<form onSubmit={handleSubmit} className='space-y-5'>
				{/* <Input
					placeholder='Username'
					value={state.email}
					onChange={(e) => {
						handleChange('email', e.target.value)
						setError([])
					}}
				/>
				<Input
					placeholder='Password'
					type='password'
					value={state.password}
					onChange={(e) => {
						handleChange('password', e.target.value)
						setError([])
					}}
				/> */}

				<TextField
					className='login_credentials'
					placeholder='Username'
					value={state.email}
					onChange={(e) => {
						handleChange('email', e.target.value)
						setError([])
					}}
					id="outlined-basic"
					label="Username"
					variant="outlined"
				/>

				<TextField
					className='login_credentials'
					placeholder='Password'
					type='password'
					value={state.password}
					onChange={(e) => {
						handleChange('password', e.target.value)
						setError([])
					}}
					id="outlined-basic"
					label="Password"
					variant="outlined"
				/>

				<div className=''>
					{error.map((err, index) => (
						<Alert severity='error' key={index}>
							{err?.message}
						</Alert>
					))}
				</div>
				<div className='py-2 text-center'>
					<Button
						type='submit'
						variant='contained'
						className='px-10 py-1.5'
						disabled={loading}
						endIcon={
							loading ? (
								<CircularProgress className='text-white' size={20} />
							) : null
						}
					>
						Sign In
					</Button>
				</div>
			</form>
		</div>
	)
}
export default Credentials
