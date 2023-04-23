import {
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	CircularProgress,
	Button,
} from '@mui/material'
import {fetchUtilities} from 'api/services/user'
import {useEffect, useState} from 'react'
import {useQuery} from 'react-query'
import {useLocation, useNavigate} from 'react-router-dom'

const SelectRole = () => {
	const {data, error, isLoading} = useQuery('utilities', fetchUtilities)
	const [id, setId] = useState('1')
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		if (!(location.state === 'from-qr-login')) {
			window.location.href = '/'
		}
	}, [])

	const handleChange = (e) => {
		setId(e.target.value)
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		try {
			localStorage.setItem('utilityId', JSON.stringify(id))
			window.location.href = '/'
		} catch (err) {
			navigate(0)
		}
	}

	if (isLoading)
		return (
			<div className='flex justify-center pt-10'>
				<CircularProgress />
			</div>
		)
	return (
		<div>
			<header className='bg-primary text-white w-screen h-16 flex items-center'>
				<h1 className='text-lg font-semibold px-8'>Select Utility</h1>
			</header>
			<main className='flex justify-center pt-10'>
				<form className='flex flex-col gap-3' onSubmit={handleSubmit}>
					<h2 className='mb-2 text-xl'>Select Utility</h2>
					<div className=''>
						<FormControl component='fieldset'>
							<RadioGroup value={id} onChange={handleChange}>
								{data?.map((item) => (
									<FormControlLabel
										value={item?.utility_id}
										control={<Radio required />}
										label={item?.utility_name}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</div>
					<Button type='submit' variant='contained' color='primary'>
						Submit
					</Button>
				</form>
			</main>
		</div>
	)
}

export default SelectRole
