import {KeyboardBackspace} from '@mui/icons-material'
import {Button, CircularProgress, IconButton, TextField} from '@mui/material'
import {
	fetchAccessTokenDetails,
	fetchAdminEmails,
	fetchLoginStatus,
	fetchTokenDetails,
	fetchUserDetails,
	verifyUserName,
} from 'api/services/user'
import {PlayIcon} from 'assets/icons/PlayIcon'
import {useEffect, useRef, useState} from 'react'
import {useMutation, useQuery} from 'react-query'
import QRCode from 'qrcode.react'
import Replay from '@mui/icons-material/Replay'
import {v4 as uuidv4} from 'uuid'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

require('dotenv').config();
const QrLogin = () => {
	return (
		<div className='bg-secondary w-screen h-screen'>
			<div className='bg-primary pb-56 w-screen'></div>
			<div className='space-y-6 pt-20 mt-[-240px]'>
				<div className='text-center'>
					<h2 className='text-white text-2xl font-bold mb-2'>Welcome!</h2>
					
					<h2 className='text-white text-xl  mb-3'>
						iBot Energy Meter Data Management System
					</h2>
				</div>
				<div className='mx-auto'>
		<div className='mx-auto grid grid-cols-2 justify-center w-[800px] h-[420px]'>
			<section className='bg-gray-100 rounded-l-lg p-6 pl-8 pt-14 flex flex-col'>
				<div className='flex-grow'>
					<h2 className='text-lg font-bold'>To Login into your MDMS web app</h2>
					<ol className='list-decimal list-inside space-y-5 text-gray-700 text-sm mt-6'>
						<li>Open the Authenticator App</li>
						<li>Tap the button "Scan QR Code"</li>
						<li>Enter your Username and Generate QR Code</li>
						<li>Scan QR Code </li>
					</ol>
				</div>
				<div className=''>
					<p className='text-sm mb-4'>
						To create an account download Authenticator App
					</p>
					<Button
						variant='outlined'
						color='secondary'
						className='text-gray-500 border-gray-300'
						startIcon={<PlayIcon />}
					>
						Google Play
					</Button>
				</div>
			</section>
			<section className='p-6 bg-white rounded-r-lg'>
				<QrCodeSection />{' '}
			</section>
		</div>
		</div>
			</div>
		</div>
	)
}

export default QrLogin

const QrCodeSection = () => {
	const navigate = useNavigate()
	const ref = useRef()
	const directusEmailRef = useRef()
	useEffect(() => {
		ref.current = uuidv4()
	}, [])

	const [show, setShow] = useState(false)
	const [username, setUsername] = useState('')
	const [refetchCount, setRefetchCount] = useState(0)
	const {
		data: userDetails,
		error,
		mutate,
		isLoading,
	} = useMutation('submitUserId', verifyUserName, {
		onSuccess: (data) => {
			directusEmailRef.current = data[0].directus_username
			data.length
				? mutateToken({user_name: username, uuid: ref.current})
				: toast.error('Error validating username')
		},
	})

	const {
		data: tokenDetails,
		error: tokenError,
		mutate: mutateToken,
		isLoading: isTokenLoading,
	} = useMutation('tokenDetails', fetchTokenDetails, {
		onSuccess: () => {
			setRefetchCount(0)
			setShow(true)
		},
		onError: () => {
			toast.error('Error Generating Token')
		},
	})
	const REACT_APP_UTILITY_ID =33;
	const {
		error: accessError,
		mutate: mutateAccessToken,
		isLoading: isLoadingAccessToken,
	} = useMutation('accessToken', fetchAccessTokenDetails, {
		onSuccess: async (data) => {
			const userRes = await fetchUserDetails(userDetails[0]?.directus_username)
			const directusEmails = await fetchAdminEmails()
			const isAdmin = directusEmails
				.map((email) => email.emailid)
				.includes(directusEmailRef.current)
			localStorage.setItem(
				'access_token',
				JSON.stringify({
					...data,
					expires: data.expires + Date.now(),
				})
			)
			localStorage.setItem('userDetails', JSON.stringify(userRes.data.data))
			if (isAdmin) {
				// localStorage.setItem('utilityId', JSON.stringify(process.env.REACT_APP_UTILITY_ID))
				localStorage.setItem('utilityId', JSON.stringify(REACT_APP_UTILITY_ID))
				window.location.href = '/'
				// return navigate('/select-role', {
				// 	state: 'from-qr-login',
				// })
			} else {
				localStorage.setItem('utilityId', JSON.stringify(3))
				window.location.href = '/'
			}
		},
	})

	const {} = useQuery(
		'checkLoginStatus',
		() => fetchLoginStatus({userToken: tokenDetails?.uuid}),
		{
			enabled: !!userDetails && !!tokenDetails && refetchCount <= 2,
			refetchInterval: 5000,
			onSuccess: (data) => {
				setRefetchCount((prev) => prev + 1)
				if (data[0]?.status === 1) {
					mutateAccessToken({
						email: userDetails[0]?.directus_username,
						password: userDetails[0]?.password,
					})
				}
			},
			onError: () => {
				toast.error('Server Error')
			},
		}
	)

	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({user_name: username})
	}

	return (
		<div className='login_logo mx-auto'>
			<img src='/logo.png' className='w-1/2 block mx-auto' alt='' />
			{!show ? (
				<form
					onSubmit={handleSubmit}
					className='flex items-center flex-col gap-5 justify-center h-full'
				>
					<TextField
						className='login_credentials'
						id='outlined-basic'
						variant='outlined'
						label='Enter Username'
						sx={{
							textAlign: 'center',
						}}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						name='username'
						required
						placeholder='Enter Username'
						size='small'
						fullWidth
					/>
					<Button
						type='submit'
						className='px-10'
						variant='contained'
						size='small'
						endIcon={
							isLoading || isTokenLoading ? (
								<CircularProgress className='text-white' size={20} />
							) : null
						}
					>
						Generate QR Code
					</Button>
				</form>
			) : (
				<section className='max-w-[300px] mx-auto'>
					<div className='flex justify-end'>
						<Button
							onClick={() => {
								setShow(false)
								setRefetchCount(15)
								ref.current = uuidv4()
							}}
							size='small'
							variant='outlined'
							className='text-sm'
							startIcon={<KeyboardBackspace />}
						>
							Change Username
						</Button>
					</div>

					<div className='mt-5 flex justify-center'>
						{tokenDetails && userDetails && (
							<QrCodeCanvas
								data={`${ref.current}:${username}:${userDetails[0]?.UUID}:${tokenDetails?.uuid}`}
								isDisabled={refetchCount > 2}
								accessError={accessError}
								refetch={() => {
									ref.current = uuidv4()
									mutateToken({
										user_name: username,
										uuid: ref.current,
									})
								}}
							/>
						)}
					</div>
				</section>
			)}
		</div>
	)
}

const QrCodeCanvas = ({data, isDisabled, accessError, refetch}) => {
	const refreshQrCode = () => {
		refetch()
	}
	return (
		<div className='relative'>
			{isDisabled && (
				<div className='absolute top-0 right-0 h-[300px] w-[300px] flex items-center justify-center bg-white bg-opacity-60'>
					<div className='bg-primary rounded-full p-4 text-center w-32'>
						<IconButton
							className='text-white'
							size='large'
							onClick={refreshQrCode}
						>
							<Replay fontSize='large' />
						</IconButton>
						<p className='text-white text-xs'>
							Refresh QR <br /> Code
						</p>
					</div>
				</div>
			)}
			{accessError && <p>Invalid Credential</p>}
			<QRCode value={data} size={300} height='300px' width='300px' />
			<p className='text-xs text-gray-600 text-center mt-3'>
				Scan QR code with Authenticator App to login
			</p>
		</div>
	)
}
