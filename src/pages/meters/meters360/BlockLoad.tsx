import { CircularProgress, Pagination, Typography, Grid, Divider } from '@mui/material'
import { exportMeter360Data, fetchMeter360Data } from 'api/services/meters'
import CsvExport from 'components/CsvExport'
import ExportToExcel from 'components/ExportToExcel'
import Table from 'components/table'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { add5Hr30Min } from 'utils'
import Filters from './Filters'
import { useMeterData } from './_DataProvider'

const BlockLoad = () => {
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
	} = useMutation('meter360DataInstantaneous', fetchMeter360Data)
	console.log("data :- ", data);
	

	const key =
		phaseId === '1'
			? 'meter_block_load_profile_single_phase'
			: 'meter_block_load_profile_three_phase'

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

	if (error) return <Grid>Server Error</Grid>
	return (
		<>
			<Grid className='pb-2 flex justify-end items-center gap-2 innnerbox'>
				{/* <ExportToExcel
					asyncExportMethod={handleExport}
					labels={
						phaseId === '1' ? blockLoadPhase1columns : blockLoadPhase2columns
					}
					/> */}
				<Grid md={12} container>
					<Grid md={3} >
						<Typography variant="h5" mt={1}> Block Load </Typography>
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
				<Grid sx={{ textAlign: "center", mt: 5 }}> <CircularProgress /> </Grid>
			) : (
				<Grid sx={{ backgroundColor: "white", p: 2 }} className="rounded-lg" mt={1}>
					<Grid className='text-sm-count text-right'>
						<Typography>Total Count: {data?.meta?.filter_count}</Typography>
					</Grid>
					{data ? (
						<>
							{phaseId === '1' && (
								<Grid>
									<Table
										tableData={data?.data}
										columns={blockLoadPhase1columns}
										loading={loading}
									/>
								</Grid>
							)}
							{phaseId === '2' && (
								<Table
									tableData={data.data}
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
						<Typography className='text-center mt-8'>No records found</Typography>
					)}
				</Grid>
			)}

		</>
	)
}

export default BlockLoad

export const blockLoadPhase1columns = [
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
		renderCell: (item: { row: { source_timestamp: any } }) => {
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
		renderCell: (item: { row: { server_timestamp: any } }) => {
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
		field: 'average_voltage',
		headerName: 'Average voltage(V)',
		width: 150,
		renderCell: (item: { row: { average_voltage: number } }) => {
			if (item?.row?.average_voltage) {
				const value = (item?.row?.average_voltage / 100).toFixed(2);
				return (value);
			}
		},
		// key: 'average_voltage',
		// title: 'Average Voltage(V)',
		// render: (value) => (value / 100).toFixed(2),
	},

	{
		field: 'block_energy_kWh_import',
		headerName: 'Block energy kWh import',
		width: 180,
		renderCell: (item: { row: { block_energy_kWh_import: number } }) => {
			if (item?.row?.block_energy_kWh_import) {
				const value = (item?.row?.block_energy_kWh_import / 100).toFixed(2);
				return (value);
			}
		},
		// key: 'block_energy_kWh_import',
		// title: 'Block Energy kWh Import',
		// render: (value) => (value / 100).toFixed(2),
	},
	{
		field: 'block_energy_kWh_export',
		headerName: 'Block energy kWh export',
		width: 200,
		renderCell: (item: { row: { block_energy_kWh_export: number } }) => {
			if (item?.row?.block_energy_kWh_export) {
				const value = (item?.row?.block_energy_kWh_export / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'block_energy_kWh_export',
		// title: 'Block Energy kWh Export',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'block_energy_VAh_import',
		headerName: 'Block energy VAh import',
		width: 200,
		renderCell: (item: { row: { block_energy_VAh_import: number } }) => {
			if (item?.row?.block_energy_VAh_import) {
				const value = (item?.row?.block_energy_VAh_import / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'block_energy_VAh_import',
		// title: 'Block Energy VAh Import',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'block_energy_VAh_export',
		headerName: 'Block energy VAh export',
		width: 200,
		renderCell: (item: { row: { block_energy_VAh_export: number } }) => {
			if (item?.row?.block_energy_VAh_export) {
				const value = (item?.row?.block_energy_VAh_export / 1000).toFixed(2);
				return (value);
			}
		},
		hide: 'true',
		// key: 'block_energy_VAh_export',
		// title: 'Block Energy VAh Export',
		// render: (value) => (value / 1000).toFixed(2),
	},
	// {key: 'meter_health_indicator', title: 'Meter Health Indicator'},
	// {key: 'average_signal_strength', title: 'Average Signal Strength'},
	{
		field: 'average_current',
		headerName: 'Average current(A)',
		width: 150,
		renderCell: (item: { row: { average_current: number } }) => {
			if (item?.row?.average_current) {
				const value = (item?.row?.average_current / 100).toFixed(2);
				return (value);
			}
		},
		hide: 'true',
		// key: 'average_current',
		// title: 'Average Current(A)',
		// render: (value) => (value / 100).toFixed(2),
	},
]

export const blockLoadPhase2columns = [
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 200,
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
		renderCell: (item: { row: { source_timestamp: any } }) => {
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
		renderCell: (item: { row: { server_timestamp: any } }) => {
			if (item?.row?.server_timestamp) {
				const value = item?.row?.server_timestamp && add5Hr30Min(item?.row?.server_timestamp);
				return (value);
			}
		},
		// key: 'server_timestamp',
		// title: 'Server Timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	// {key: 'current_lr', title: 'Current Lr'},
	{
		field: 'average_voltage',
		headerName: 'Average voltage(V)',
		width: 150,
		renderCell: (item: { row: { average_voltage: number } }) => {
			if (item?.row?.average_voltage) {
				const value = (item?.row?.average_voltage / 100).toFixed(2);
				return (value);
			}
		},
		// key: 'average_voltage',
		// title: 'Average Voltage(V)',
		// render: (value) => (value / 100).toFixed(2),
	},
	{
		field: 'block_energy_Wh_import',
		headerName: 'Energy KWh import',
		width: 150,
		renderCell: (item: { row: { block_energy_Wh_import: number } }) => {
			if (item?.row?.block_energy_Wh_import) {
				const value = (item?.row?.block_energy_Wh_import / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'block_energy_Wh_import',
		// title: 'Energy KWh Import',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'block_energy_Wh_export',
		headerName: 'Energy KWh export',
		width: 150,
		renderCell: (item: { row: { block_energy_Wh_export: number } }) => {
			if (item?.row?.block_energy_Wh_export) {
				const value = (item?.row?.block_energy_Wh_export / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'block_energy_Wh_export',
		// title: 'Energy KWh Export',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'block_energy_VAh_import',
		headerName: 'Energy KVAh import',
		width: 200,
		renderCell: (item: { row: { block_energy_VAh_import: number } }) => {
			if (item?.row?.block_energy_VAh_import) {
				const value = (item?.row?.block_energy_VAh_import / 1000).toFixed(2);
				return (value);
			}
		},
		// key: 'block_energy_VAh_import',
		// title: 'Energy KVAh Import',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'block_energy_VAh_export',
		headerName: 'Energy KVAh export',
		width: 170,
		renderCell: (item: { row: { block_energy_VAh_export: number } }) => {
			if (item?.row?.block_energy_VAh_export) {
				const value = (item?.row?.block_energy_VAh_export / 1000).toFixed(2);
				return (value);
			}
		},
		hide: 'true',
		// key: 'block_energy_VAh_export',
		// title: 'Energy KVAh Export',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'current_ly',
		headerName: 'Current ly(A) - L2',
		width: 150,
		hide: 'true',
		renderCell: (item: { row: { current_ly: number } }) => {
			if (item?.row?.current_ly) {
				const value = (item?.row?.current_ly / 100).toFixed(2);
				return (value);
			}
		},
		// key: 'current_ly',
		// title: 'Current ly(A)',
		// render: (value) => (value / 100).toFixed(2),
	},
	{
		field: 'current_lb',
		headerName: 'Current lb(A) - L3',
		width: 150,
		hide: 'true',
		renderCell: (item: { row: { current_lb: number } }) => {
			if (item?.row?.current_lb) {
				const value = (item?.row?.current_lb / 100).toFixed(2);
				return (value);
			}
		},
		// key: 'current_lb',
		// title: 'Current lb(A)',
		// render: (value) => (value / 100).toFixed(2),
	},
	{
		field: 'current_lr',
		headerName: 'Current lr(A) - L1',
		width: 150,
		hide: 'true',
		renderCell: (item: { row: { current_lr: number } }) => {
			if (item?.row?.current_lr) {
				const value = (item?.row?.current_lr / 100).toFixed(2);
				return (value);
			}
		},
		// key: 'current_lr',
		// title: 'Current lr(A)',
		// render: (value) => (value / 100).toFixed(2),
	},
	{
		field: 'voltage_vrn',
		headerName: 'Voltage Vrn(V) - L1',
		width: 150,
		hide: 'true',
		renderCell: (item: { row: { voltage_vrn: number } }) => {
			if (item?.row?.voltage_vrn) {
				const value = (item?.row?.voltage_vrn / 10).toFixed(2);
				return (value);
			}
		},
		// key: 'voltage_vrn',
		// title: 'Voltage Vrn(V)',
		// render: (value) => (value / 10).toFixed(2),
	},
	{
		field: 'voltage_vyn',
		headerName: 'Voltage Vyn(V) - L2',
		width: 150,
		hide: 'true',
		renderCell: (item: { row: { voltage_vyn: number } }) => {
			if (item?.row?.voltage_vyn) {
				const value = (item?.row?.voltage_vyn / 10).toFixed(2);
				return (value);
			}
		},
		// key: 'voltage_vyn',
		// title: 'Voltage Vyn(V)',
		// render: (value) => (value / 10).toFixed(2),
	},
	{
		field: 'voltage_vbn',
		headerName: 'Voltage Vbn(V) -L3',
		width: 150,
		hide: 'true',
		renderCell: (item: { row: { voltage_vbn: number } }) => {
			if (item?.row?.voltage_vbn) {
				const value = (item?.row?.voltage_vbn / 10).toFixed(2);
				return (value);
			}
		},
		// key: 'voltage_vbn',
		// title: 'Voltage Vbn(V)',
		// render: (value) => (value / 10).toFixed(2),
	},
	// {key: 'meter_health_indicator', title: 'Meter Health Indicator'},
	// {key: 'average_signal_strength', title: 'Average Signal Strength'},
	// {key: 'status_byte', title: 'Status Byte'},
	// {key: 'utility_id', title: 'Utility ID'},
]
