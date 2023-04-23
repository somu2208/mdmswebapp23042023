import { Button, CircularProgress, Pagination, Grid, Typography } from '@mui/material'
import { fetchMeter360DataLoad } from 'api/services/meters'
import Table from 'components/table'
import { addDays, format, subDays } from 'date-fns'
import { SetStateAction, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { add5Hr30Min } from 'utils'
import {
	blockLoadPhase1columns,
	blockLoadPhase2columns,
} from '../meters360/BlockLoad'

const BlockLoad = () => {
	const [page, setPage] = useState(1)
	const [currentDate, setCurrentDate] = useState(new Date())

	const [search] = useSearchParams()
	const phaseId = search.get('phase')
	const params = useParams()
	const key =
		phaseId === 'single-phase'
			? 'meter_block_load_profile_single_phase_synctime'
			: 'meter_block_load_profile_three_phase_synctime'
	const {
		data,
		error,
		isLoading: loading,
		mutate,
	} = useMutation('meter360DataInstantaneous', fetchMeter360DataLoad)

	useEffect(() => {
		mutate({
			key,
			meterId: params.meterId,
			page,
			date: new Date(),
		})
	}, [])

	const handlePrev = () => {
		mutate({
			key,
			meterId: params.meterId,
			page,
			date: subDays(currentDate, 1),
		})
		setCurrentDate(subDays(currentDate, 1))
	}
	const handleNext = () => {
		mutate({
			key,
			meterId: params.meterId,
			page,
			date: addDays(currentDate, 1),
		})
		setCurrentDate(addDays(currentDate, 1))
	}

	const handleChange = (_event: any, value: any) => {
		setPage(value)
		mutate({
			page: value,
			date: currentDate,
			meterId: params.meterId,
			key,
		})
	}

	if (error) return <Typography>Server Error</Typography>

	return (
		<>
			<Grid md={12} py={1} ml={1} sx={{ display: "flex" }}>
				{/* <div className='flex gap-2 items-center border border-gray-300 rounded-md'> */}

				<Typography variant="h5"> Block Load</Typography>

				<Grid sx={{ display: "flex", textAlign: "center" }} className="gap-2 border border-gray-300 rounded-md filter_data_by_date_instant">
					<Button size='small' color='secondary' onClick={handlePrev}>
						Prev
					</Button>
					<Typography mt={1.1}>{new Date(currentDate).toLocaleString('en-us',{day: 'numeric', month:'short', year:'numeric'})}</Typography>
					<Button
						disabled={addDays(currentDate, 1) > new Date()}
						size='small'
						color='secondary'
						onClick={handleNext}
					>
						Next
					</Button>
				</Grid>
				{/* </div> */}
			</Grid>
			{loading ? (
				<CircularProgress />
			) : (
				<Grid mt={1} md={12} sx={{ backgroundColor: "white", p: 1 }} className="rounded-xl instant_table_m" >
					{data?.data?.length ? (
						<>
							{/* <div className='text-sm text-right'> */}
							<Grid className='text-sm-count text-right'>
								<p>Total Count: {data?.meta?.filter_count}</p>
							</Grid>
							{/* </div> */}
							{phaseId === 'single-phase' && (
								<Grid>
									<Table
										tableData={data?.data}
										columns={blockLoadPhase1columns}
										loading={loading}
									/>
								</Grid>
							)}
							{phaseId === 'three-phase' && (
								<Table
									tableData={data?.data}
									columns={blockLoadPhase2columns}
									loading={loading}
								/>
							)}

							{/* <div className='flex justify-between mt-5'>
								<p className='text-gray-600'>{`Page : ${page}/${Math.ceil(
									data?.meta?.filter_count / 10
								)}`}</p>
								<Pagination
									variant='outlined'
									shape='rounded'
									count={Math.ceil(data?.meta?.filter_count / 10)}
									page={page}
									onChange={handleChange}
								/>
							</div> */}
						</>
					) : (
						<Typography sx={{ textAlign: "center" }}> No Data </Typography>
					)}
				</Grid>
			)}
		</>
	)
}

export default BlockLoad
