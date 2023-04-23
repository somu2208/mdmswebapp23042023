import { CircularProgress, Pagination, Grid, Typography, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import Filters from './Filters'
import { useMeterData } from './_DataProvider'
import Table from 'components/table'
import { exportMeter360Data, fetchMeter360Data } from 'api/services/meters'
import { useMutation } from 'react-query'
import { format } from 'date-fns'
import { add5Hr30Min, captureTimeFormat } from 'utils'
import CsvExport from 'components/CsvExport'
import ExportToExcel from 'components/ExportToExcel'

const DailyLoad = () => {
	const {
		data,
		error,
		isLoading: loading,
		mutate,
	} = useMutation('meter360DataDailyLoad', fetchMeter360Data)

	const params = useParams()
	const meterId = params.meterId

	const { fromDate, toDate } = useMeterData()
	const [page, setPage] = useState(1)

	const [search] = useSearchParams()
	const phaseId = search.get('phase')
	const key =
		phaseId === '1'
			? 'meter_dailyload_profile_single_phase'
			: 'meter_dailyload_profile_three_phase'

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

	return (
		<>
			<Grid className='pb-2 flex justify-end items-center gap-2 innnerbox'>
				{/* <div className='pb-2 flex justify-end items-center gap-2'> */}
				{/* <ExportToExcel
					asyncExportMethod={handleExport}
					labels={
						phaseId === '1' ? dailyLoadPhase1columns : dailyLoadPhase2columns
					}
				/> */}
				<Grid md={12} container>
					<Grid md={3}>
						<Typography variant="h5" mt={1}> Daily Load </Typography>
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

				{/* </div> */}
			</Grid>
			{loading ? (
				<Grid sx={{ textAlign: "center", mt: 5 }}> <CircularProgress /> </Grid>
			) : (
				<Grid mt={1}>
					{data ? (
						<>
							<TableComponent
								data={data}
								page={page}
								toDate={toDate}
								fromDate={fromDate}
								meterId={params?.meterId}
								mutate={mutate}
								phaseId={phaseId}
								setPage={setPage}
								key={key}
								loading={loading}
								error={error}
							/>
						</>
					) : (
						<Typography className='text-center mt-8'>No records found</Typography>
					)}
				</Grid>
			)}
		</>
	)
}

const TableComponent = ({
	setPage,
	mutate,
	fromDate,
	toDate,
	meterId,
	key,
	phaseId,
	data,
	page,
	loading,
	error,
}) => {
	const handleChange = (event, value) => {
		setPage(value)
		return mutate({
			page: value,
			fromDate,
			toDate,
			meterId,
			key,
		})
	}

	if (error) return <Grid>Server Error</Grid>
	if (data?.data?.length === 0)
		return <Typography className='text-center'>No data</Typography>
	return (
		<>
			<Grid sx={{ backgroundColor: "white", p: 2 }} className="rounded-lg" mt={1}>
				<Grid className='text-sm-count text-right'>
					<Typography>Total Count: {data?.meta?.filter_count}</Typography>
				</Grid>
				{phaseId === '1' && (
					<Grid>
						<Table
							tableData={data?.data}
							columns={dailyLoadPhase1columns}
							loading={loading}
						/>
					</Grid>
				)}
				{phaseId === '2' && (
					<Table
						tableData={data?.data}
						columns={dailyLoadPhase2columns}
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
			</Grid>
		</>
	)
}
export default DailyLoad

export const dailyLoadPhase1columns = [
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 170,
		// key: 'meter_serial_number', 
		// title: 'Meter Serial Number'
	},
	{
		field: 'cons_id',
		headerName: 'Network type',
		width: 120
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
		},
		// key: 'server_timestamp',
		// title: 'Server Timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'cumilative_energy_kWh_export',
		headerName: 'Cumulative energy export(KWh)',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_kWh_export) {
				const value = (item?.row?.cumilative_energy_kWh_export / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_kWh_export',
		// title: 'Cumulative Energy Export(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumilative_energy_kWh_import',
		headerName: 'Cumulative energy import(KWh)',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_kWh_import) {
				const value = (item?.row?.cumilative_energy_kWh_import / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_kWh_import',
		// title: 'Cumulative Energy Import(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumilative_energy_kVAh_export',
		headerName: 'Cumulative energy export(KVAh)',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_kVAh_export) {
				const value = (item?.row?.cumilative_energy_kVAh_export / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_kVAh_export',
		// title: 'Cumulative Energy Export(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumilative_energy_kVAh_import',
		headerName: 'Cumulative energy import(KVAh)',
		width: 270,
		hide: 'true',
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_kVAh_import) {
				const value = (item?.row?.cumilative_energy_kVAh_import / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_kVAh_import',
		// title: 'Cumulative Energy Import(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maxmimum_demand_kW',
		headerName: 'Maximum demand (kW)',
		hide: 'true',
		width: 175,
		renderCell: (item) => {
			if (item?.row?.maxmimum_demand_kW) {
				const value = (item?.row?.maxmimum_demand_kW / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'maxmimum_demand_kW',
		// title: 'Maximum Demand (kW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maximum_demand_kW_capture_time',
		headerName: 'Maximum demand KW capture time',
		hide: 'true',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_kW_capture_time) {
				const value = item?.row?.maximum_demand_kW_capture_time && captureTimeFormat(item?.row?.maximum_demand_kW_capture_time);
				return (value);
			}
		},
		// key: 'maximum_demand_kW_capture_time',
		// title: 'Maximum Demand KW Capture Time',
		// render: (value) => value && captureTimeFormat(value),
	},

	{
		field: 'maxmimum_demand_kVA',
		headerName: 'Maximum demand (KVA)',
		hide: 'true',
		width: 200,
		renderCell: (item) => {
			if (item?.row?.maxmimum_demand_kVA) {
				const value = (item?.row?.maxmimum_demand_kVA / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'maxmimum_demand_kVA',
		// title: 'Maximum Demand (KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maximum_demand_kVA_capture_time',
		headerName: 'Maximum demand kVA capture time',
		hide: 'true',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_kVA_capture_time) {
				const value = item?.row?.maximum_demand_kVA_capture_time && captureTimeFormat(item?.row?.maximum_demand_kVA_capture_time);
				return (value);
			}
		},
		// key: 'maximum_demand_kVA_capture_time',
		// title: 'Maximum demand kVA capture time',
		// render: (value) => value && captureTimeFormat(value),
	},
	// {key: 'utility_id', title: 'Utility id'},
]

export const dailyLoadPhase2columns = [
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 200,
		// key: 'meter_serial_number', 
		// title: 'Meter serial number'
	},
	{
		field: 'cons_id',
		headerName: 'Network type',
		width: 120
	},
	{
		field: 'source_timestamp',
		headerName: 'Source timestamp',
		width: 150,
		renderCell: (item) => {
			if (item?.row?.source_timestamp) {
				const value = item?.row?.source_timestamp && add5Hr30Min(item?.row?.source_timestamp);
				return (value);
			}
		},
		// key: 'source_timestamp',
		// title: 'Source timestamp',
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
		},
		// key: 'server_timestamp',
		// title: 'Server timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'cumilative_energy_Wh_export',
		headerName: 'Cumulative energy export(KWh)',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_Wh_export) {
				const value = (item?.row?.cumilative_energy_Wh_export / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_Wh_export',
		// title: 'Cumulative Energy Export(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumilative_energy_Wh_import',
		headerName: 'Cumulative energy import(KWh)',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_Wh_import) {
				const value = (item?.row?.cumilative_energy_Wh_import / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_Wh_import',
		// title: 'Cumulative Energy Import(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumilative_energy_VAh_export',
		headerName: 'Cumulative energy export(KVAh)',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_VAh_export) {
				const value = (item?.row?.cumilative_energy_VAh_export / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_VAh_export',
		// title: 'Cumulative Energy Export(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumilative_energy_VAh_import',
		headerName: 'Cumulative energy import(KVAh)',
		width: 270,
		renderCell: (item) => {
			if (item?.row?.cumilative_energy_VAh_import) {
				const value = (item?.row?.cumilative_energy_VAh_import / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'cumilative_energy_VAh_import',
		// title: 'Cumulative Energy Import(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maxmimum_demand_W',
		headerName: 'Maximum demand (kW)',
		width: 200,
		hide: 'true',
		renderCell: (item) => {
			if (item?.row?.maxmimum_demand_W) {
				const value = (item?.row?.maxmimum_demand_W / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'maxmimum_demand_W',
		// title: 'Maximum Demand (kW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	// {
	// 	key: 'maximum_demand_W_capture_time',
	// 	title: 'Maximum Demand KW Capture Time',
	// 	// render: (value) => value && captureTimeFormat(value),
	// },

	// {
	// 	key: 'maxmimum_demand_VA',
	// 	title: 'Maximum Demand (KVA)',
	// 	render: (value) => (value / 1000).toFixed(2),
	// },
	{
		field: 'maximum_demand_VA_capture_time',
		headerName: 'Maximum demand KVA capture time',
		width: 270,
		hide: 'true',
		renderCell: (item) => {
			if (item?.row?.maximum_demand_VA_capture_time) {
				const value = item?.row?.maximum_demand_VA_capture_time && add5Hr30Min(item?.row?.maximum_demand_VA_capture_time);
				return (value);
			}
		},
		// key: 'maximum_demand_VA_capture_time',
		// title: 'Maximum demand KVA capture time',
		// render: (value) => value && add5Hr30Min(value),
	},
]
