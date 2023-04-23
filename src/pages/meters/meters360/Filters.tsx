import { Button, TextField, Typography, Grid } from '@mui/material'
import { intervalToDuration } from 'date-fns'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { useMeterData } from './_DataProvider'

const Filters = ({ mutate, page, key }) => {
	const params = useParams()
	const meterId = params.meterId

	const { fromDate, toDate, setState } = useMeterData()

	const handleSubmit = (e) => {
		e.preventDefault()

		const interval =
			fromDate &&
			toDate &&
			intervalToDuration({
				start: new Date(fromDate),
				end: new Date(toDate),
			})

		if (!fromDate || !toDate) return toast.warn('Please select a date range')
		if (interval.days > 30 || interval.months > 0)
			return toast.warn('Select a date range less than 30 days')

		mutate({
			fromDate,
			toDate,
			key,
			page,
			meterId,
		})
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className='flex items-center gap-5 justify-end'
			>
				<Grid className='flex gap-3'>
					{/* <div className='flex items-center'> */}
					<Grid className='flex items-center'>
						<TextField
							size='small'
							type='date'
							required
							variant='outlined'
							value={fromDate}
							onChange={(e) =>
								setState((prev) => ({ ...prev, fromDate: e.target.value }))
							}
						/>
						{/* <div className='px-4'>to</div> */}
						<Typography sx={{ pl: 2, pr: 2 }}> to </Typography>
						<TextField
							type='date'
							variant='outlined'
							size='small'
							required
							value={toDate}
							onChange={(e) =>
								setState((prev) => ({ ...prev, toDate: e.target.value }))
							}
						/>
					</Grid>
					{/* </div> */}
					<Grid>
						<Button
							type='submit'
							size='small'
							variant='contained'
							color='primary'
						>
							Submit
						</Button>
					</Grid>
				</Grid>
			</form>
		</>
	)
}

export default Filters
