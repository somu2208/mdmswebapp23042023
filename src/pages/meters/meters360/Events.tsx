import { CircularProgress, Pagination, Typography, Grid } from '@mui/material'
import { exportMeter360Data, fetchMeter360Data } from 'api/services/meters'
import CsvExport from 'components/CsvExport'
import ExportToExcel from 'components/ExportToExcel'
import Table from 'components/table'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { add5Hr30Min } from 'utils'
import Filters from './Filters'
import { useMeterData } from './_DataProvider'

const Events = () => {
	const { fromDate, toDate } = useMeterData()
	const [search] = useSearchParams()
	const phaseId = search.get('phase')
	const [page, setPage] = useState(1)
	const params = useParams()
	const meterId = params.meterId

	const handleChange = (event, value) => {
		setPage(value)
		return mutate({
			page: value,
			fromDate,
			toDate,
			meterId: params.meterId,
			key,
		})
	}

	const {
		data,
		error,
		isLoading: loading,
		mutate,
	} = useMutation('meter360DataEvents', fetchMeter360Data)

	const key =
		phaseId === '1'
			? 'meter_event_log_single_phase'
			: 'meter_event_log_three_phase'

	const handleExport = async () => {
		if (!fromDate || !toDate) return
		const data = await exportMeter360Data({ key, fromDate, toDate, meterId })
		return data
	}

	useEffect(() => {
		mutate({
			fromDate,
			toDate,
			key,
			meterId: params.meterId,
			page,
		})
	}, [])

	if (error) return <Typography>Server Error</Typography>
	return (
		<>
			<Grid className='pb-2 flex justify-end items-center gap-2 innnerbox'>
				{/* <ExportToExcel
					asyncExportMethod={handleExport}
					labels={phaseId === '1' ? eventsPhase1columns : eventsPhase2columns}
				/> */}
				<Grid md={12} container>
					<Grid md={3}>
						<Typography variant="h5" mt={1}> Events </Typography>
					</Grid>
					<Grid md={9}>
						<Filters
							mutate={() =>
								mutate({
									fromDate,
									toDate,
									key,
									meterId: params.meterId,
									page,
								})
							}
							page={page}
							key={key}
						/>
					</Grid>
				</Grid>
			</Grid>
			{loading ? (
				<Grid sx={{textAlign:"center", mt:5}}> <CircularProgress /> </Grid>
			) : (
				<Grid mt={1} sx={{ backgroundColor: "white", p: 2 }} className="rounded-lg">
					{data?.data?.length ? (
						<>
							<Grid className='text-sm-count text-right'>
								<Typography>Total Count: {data?.meta?.filter_count}</Typography>
							</Grid>
							{phaseId === '1' && (
								<Grid>
									<Table
										tableData={data.data}
										columns={eventsPhase1columns}
										loading={loading}
									/>
								</Grid>
							)}
							{phaseId === '2' && (
								<Table
									tableData={data.data}
									columns={eventsPhase2columns}
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
						<Typography mt={3} mb={3} className='text-center'>No records found</Typography>
					)}
				</Grid>
			)}
		</>
	)
}

export default Events


export const eventsPhase2columns = [
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 200,
		// key: 'meter_serial_number',
		// title: 'Meter Serial Number',
	},
	{
		field: 'event_code',
		headerName: 'Event code',
		width: 150,
		// key: 'event_code',
		// title: 'Event Code',
	},
	{
		field: 'event_description',
		headerName: 'Event description',
		width: 150,
		// key: 'event_description',
		// title: 'Event Description',
	},
	{
		field: 'source_timestamp',
		headerName: 'Meter timestamp',
		width: 150,
		renderCell: (item) => {
			if (item?.row?.source_timestamp) {
				const value = item?.row?.source_timestamp && add5Hr30Min(item?.row?.source_timestamp);
				return (value);
			}
		},
		// key: 'source_timestamp',
		// title: 'Meter Timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'server_timestamp',
		headerName: 'Server timestamp',
		width: 150,
		renderCell: (item) => {
			if (item?.row?.server_timestamp) {
				const value = item?.row?.server_timestamp && add5Hr30Min(item?.row?.server_timestamp);
				return (value);
			}
		}
		// key: 'server_timestamp',
		// title: 'Server timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'current_ir',
		headerName: 'Current Ir(A) - L1',
		width: 150,
		// key: 'current_ir',
		// title: 'Current Ir(A)',
	},
	{
		field: 'current_iy',
		headerName: 'Current Iy(A) - L2',
		width: 150,
		// key: 'current_iy',
		// title: 'Current Iy(A)',
	},
	{
		field: 'current_ib',
		headerName: 'Current Ib(A) - L3',
		width: 150,
		// key: 'current_ib',
		// title: 'Current Ib(A)',
	},
	{
		field: 'voltage_vrn',
		headerName: 'Voltage Vrn(V) - L1',
		width: 150,
		// key: 'voltage_vrn',
		// title: 'Voltage Vrn(V)',
	},
	{
		field: 'voltage_vyn',
		headerName: 'Voltage Vyn(V) - L2',
		width: 150,
		// key: 'voltage_vyn',
		// title: 'Voltage Vyn(V)',
	},
	{
		field: 'voltage_vbn',
		headerName: 'Voltage Vbn(V) - L3',
		width: 150,
		// key: 'voltage_vbn',
		// title: 'Voltage Vbn(V)',
	},

	// {
	// 	field: 'voltage_vry',
	// 	headerName: 'Voltage Vry(V)',
	// 	width: 150,
	// 	// key: 'voltage_vry',
	// 	// title: 'Voltage Vry(V)',
	// },
	// {
	// 	field: 'voltage_vyb',
	// 	headerName: 'Voltage Vyb(V)',
	// 	width: 200,
	// 	// key: 'voltage_vyb',
	// 	// title: 'Voltage Vyb(V)',
	// },

	{
		field: 'powerfactor_r_phase',
		headerName: 'Power Factor R Phase - L1',
		width: 220,
		// key: 'powerfactor_r_phase',
		// title: 'Power Factor R Phase',
	},
	{
		field: 'powerfactor_y_phase',
		headerName: 'Power factor Y phase - L2',
		width: 220,
		// key: 'powerfactor_y_phase',
		// title: 'Power Factor Y Phase',
	},
	{
		field: 'powerfactor_b_phase',
		headerName: 'Power factor B phase - L3',
		width: 220,
		// key: 'powerfactor_b_phase',
		// title: 'Power Factor B Phase',
	},
	{
		field: 'cumulative_energy_kWh',
		headerName: 'Cumulative energy kWh',
		width: 200,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh) {
				const value = (item?.row?.cumulative_energy_kWh / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumulative_energy_kWh',
		// title: 'Cumulative energy kWh',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_tamper_count',
		headerName: 'Cumulative tamper count',
		width: 220,
		// key: 'cumulative_tamper_count',
		// title: 'Cumulative Tamper Count',
	},
	// {
	// 	key: 'generic_event_log_sequence_number',
	// 	title: 'Generic event log sequence number',
	// },
	// {
	// 	key: 'created_on',
	// 	title: 'Created on',
	// },
	// {
	// 	key: 'utility_id',
	// 	title: 'Utility id',
	// },
]
export const eventsPhase1columns = [
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 200,
		// key: 'meter_serial_number',
		// title: 'Meter Serial Number',
	},
	{
		field: 'event_code',
		headerName: 'Event code',
		width: 120,
		// key: 'event_code',
		// title: 'Event code',
	},
	{
		field: 'event_description',
		headerName: 'Event description',
		width: 150,
		// key: 'event_description',
		// title: 'Event Description',
	},
	{
		field: 'source_timestamp',
		headerName: 'Meter timestamp',
		width: 150,
		renderCell: (item) => {
			if (item?.row?.source_timestamp) {
				const value = item?.row?.source_timestamp && add5Hr30Min(item?.row?.source_timestamp);
				return (value);
			}
		}
		// key: 'source_timestamp',
		// title: 'Meter Timestamp',
		// render: (value) => value && add5Hr30Min(value),
		// renderCell: (value) => {
		// 	if (value?.row?.source_timestamp) {
		// 		return (value && add5Hr30Min(value));
		// 	}
		// }
	},
	{
		field: 'server_timestamp',
		headerName: 'Server timestamp',
		width: 150,
		renderCell: (item) => {
			if (item?.row?.server_timestamp) {
				const value = item?.row?.server_timestamp && add5Hr30Min(item?.row?.server_timestamp);
				return (value);
			}
		}
		// key: 'server_timestamp',
		// title: 'Server Timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'current',
		headerName: 'Current(A)',
		width: 120,
		// key: 'current',
		// title: 'Current(A)',
	},
	{
		field: 'voltage',
		headerName: 'Voltage(V)',
		width: 120,
		// key: 'voltage',
		// title: 'Voltage(V)',
	},
	{
		field: 'powerfactor',
		headerName: 'Power factor',
		width: 150,
		// key: 'powerfactor',
		// title: 'Power Factor',
	},
	{
		field: 'cumulative_energy_kWh',
		headerName: 'Cumulative energy kWh',
		width: 200,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh) {
				const value = (item?.row?.cumulative_energy_kWh / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumulative_energy_kWh',
		// title: 'Cumulative energy kWh',
		// render: (value) => (value / 1000).toFixed(2),

	},
	{
		field: 'cumulative_tamper_count',
		headerName: 'Cumulative tamper count',
		width: 200,
		// key: 'cumulative_tamper_count',
		// title: 'Cumulative tamper count',
	},
	// {
	// 	key: 'generic_event_log_sequence_number',
	// 	title: 'Generic event log sequence number',
	// },
	// {
	// 	key: 'created_on',
	// 	title: 'Created on',
	// },
	// {
	// 	key: 'utility_id',
	// 	title: 'Utility id',
	// },
]
