import { Button, CircularProgress, Pagination, Grid, Typography } from '@mui/material'
import http, { access_token, utilityId } from 'api/http'
import Table from 'components/table'
import {
	addDays,
	addMonths,
	format,
	getDaysInMonth,
	subDays,
	subMonths,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { billingPhase1columns, billingPhase2columns } from '../meters360/Billing'

export const fetchBillingData = async ({
	key,
	page,
	date,
}: {
	key: string
	page: number
	date: Date
}) => {
	const year = date.getFullYear()
	const month = date.getMonth()
	const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd') + ' 00:00:00'
	const endDate =
		format(
			new Date(year, month, getDaysInMonth(new Date(year, month))),
			'yyyy-MM-dd'
		) + ' 23:59:59'

	const timeStampKey =
		key === 'meter_billing_profile_single_phase_new'
			? 'source_time_stamp'
			: 'source_timestamp'

	const res = await http.get(`/items/${key}`, {
		params: {
			filter: {
				_and: [
					{ [timeStampKey]: { _between: [startDate, endDate] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			access_token,
			fields: '*',
		},
	})
	return res?.data
}

const Billing = () => {
	const [page, setPage] = useState(1)
	const [currentDate, setCurrentDate] = useState(new Date())

	const [search] = useSearchParams()
	const phaseId = search.get('phase')
	const params = useParams()
	const key =
		phaseId === 'single-phase'
			? 'meter_billing_profile_single_phase_new'
			: 'meter_billing_profile_three_phase'

	const {
		data,
		error,
		isLoading: loading,
		mutate,
	} = useMutation('meter360DataInstantaneous', fetchBillingData)


	const handlePrev = () => {
		mutate({
			key,
			page,
			date: subMonths(currentDate, 1),
		})
		setCurrentDate(subMonths(currentDate, 1))
	}
	const handleNext = () => {
		mutate({
			key,
			page,
			date: addMonths(currentDate, 1),
		})
		setCurrentDate(addMonths(currentDate, 1))
	}

	useEffect(() => {
		mutate({
			key,
			page,
			date: new Date(),
		})
	}, [])
	if (error) return <Typography>Server Error</Typography>

	return (
		<>
			<Grid md={12} py={1} ml={1} sx={{ display: "flex" }}>
				{/* <div className='flex gap-2 items-center border border-gray-300 rounded-md'> */}

				<Typography variant="h5"> Billing </Typography>

				<Grid sx={{ display: "flex", textAlign: "center" }} className="gap-2 border border-gray-300 rounded-md filter_data_by_date_instant">
					<Button size='small' color='secondary' onClick={handlePrev}>
						Prev
					</Button>
					<Typography mt={1.1}>{new Date(currentDate).toLocaleString('en-us',{month:'long', year:'numeric'})}</Typography>
					<Button
						disabled={addMonths(currentDate, 1) > new Date()}
						size='small'
						color='secondary'
						onClick={handleNext}
					>
						Next
					</Button>
				</Grid>
			</Grid>
			{loading ? (
				<CircularProgress />
			) : (
				<Grid mt={2} md={12} sx={{ backgroundColor: "white", p: 1 }} className="rounded-xl instant_table_m" >
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
										columns={billingPhase1columns}
										loading={loading}
									/>
								</Grid>
							)}
							{phaseId === 'three-phase' && (
								<Table
									tableData={data?.data}
									columns={billingPhase2columns}
									loading={loading}
								/>
							)}
						</>
					) : (
						<Typography sx={{ textAlign: "center" }}>No Data</Typography>
					)}
				</Grid>
			)}
		</>
	)
}

export default Billing
