import { Button, CircularProgress, Typography, Grid } from '@mui/material'
import http, { access_token } from 'api/http'
import CsvExport from 'components/CsvExport'
import ExportToExcel from 'components/ExportToExcel'
import Table from 'components/table'
import { format, getDaysInMonth, subMonths } from 'date-fns'
import { addMonths } from 'date-fns/esm'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { add5Hr30Min, captureTimeFormat } from 'utils'

export const fetchBillingData = async ({
	key,
	meterId,
	page,
	date,
}: {
	key: string
	meterId: string
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
				meter_serial_number: { _eq: meterId },
				[timeStampKey]: { _between: [startDate, endDate] },
			},
			sort: '-' + timeStampKey,
			meta: 'filter_count',
			access_token,
			fields: '*',
			limit: 10,
			page: page,
		},
	})
	return res.data
}

export const fetchBillingDataExport = async ({
	key,
	meterId,
}: {
	key: string
	meterId: string
}) => {
	const res = await http.get(`/items/${key}`, {
		params: {
			filter: { meter_serial_number: { _eq: meterId } },
			sort:
				key === 'meter_billing_profile_single_phase_new'
					? '-source_time_stamp'
					: '-source_timestamp',
			meta: 'filter_count',
			access_token,
			fields: '*',
		},
	})
	return res.data
}

const Billing = () => {
	const [currentDate, setCurrentDate] = useState(new Date())

	const [search] = useSearchParams()
	const phaseId = search.get('phase')
	const [page, setPage] = useState(1)
	const params = useParams()
	const meterId = params.meterId

	const {
		data,
		error,
		isLoading: loading,
		mutate,
	} = useMutation('meter360DataBilling', fetchBillingData)

	const key =
		phaseId === '1'
			? 'meter_billing_profile_single_phase_new'
			: 'meter_billing_profile_three_phase'

	const handleExport = async () => {
		const data = await fetchBillingDataExport({ key, meterId })
		return data
	}

	useEffect(() => {
		mutate({
			key,
			meterId: params.meterId,
			page,
			date: currentDate,
		})
	}, [])

	const handlePrev = () => {
		mutate({
			key,
			meterId: params.meterId,
			page,
			date: subMonths(currentDate, 1),
		})
		setCurrentDate(subMonths(currentDate, 1))
	}
	const handleNext = () => {
		mutate({
			key,
			meterId: params.meterId,
			page,
			date: addMonths(currentDate, 1),
		})
		setCurrentDate(addMonths(currentDate, 1))
	}

	if (error) return <Typography>Server Error</Typography>
	return (
		<>
			<Grid className='pb-2 flex justify-end items-center gap-2 innnerbox'>
				<Grid md={12} py={1} ml={1} sx={{ display: "flex" }}>					
					<Typography variant="h5"> Billing </Typography>					
					<Grid sx={{ display: "flex", textAlign: "right" }} className='gap-2 items-center border border-gray-300 rounded-md filter_data_by_date_instant' >
						<Button size='small' color='secondary' onClick={handlePrev}>
							Prev
						</Button>
						{/* <Typography>{new Date(currentDate).toLocaleString('en-us',{day: 'numeric', month:'short', year:'numeric'})}</Typography> */}
						<Typography>{new Date(currentDate).toLocaleString('en-us',{month:'short', year:'numeric'})}</Typography>
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
				
			</Grid>
			{loading ? (
				<Grid sx={{textAlign:"center", mt:5}}> <CircularProgress /> </Grid>
			) : (
				<Grid sx={{ backgroundColor: "white", p: 2 }} className="rounded-lg" mt={1}>
					<Grid className='text-sm-count text-right'>
						<Typography>Total Count: {data?.meta?.filter_count}</Typography>
					</Grid>
					{data?.data?.length ? (
						<>
							{phaseId === '1' && (
								<Grid>
									<Table
										tableData={data.data}
										columns={billingPhase1columns}
										loading={loading}
									/>
								</Grid>
							)}
							{phaseId === '2' && (
								<Table
									tableData={data.data}
									columns={billingPhase2columns}
									loading={loading}
								/>
							)}
						</>
					) : (
						<Typography mt={8} className='text-center'>No records found</Typography>
					)}
				</Grid>
			)}
		</>
	)
}

export default Billing

export const billingPhase1columns = [
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 155,
		// key: 'meter_serial_number',
		// title: 'Meter Serial Number',
	},
	{
		field: 'source_time_stamp',
		headerName: 'Source time stamp',
		width: 170,
		renderCell: (item) => {
			if (item?.row?.source_time_stamp) {
				const value = item?.row?.source_time_stamp && add5Hr30Min(item?.row?.source_time_stamp);
				// console.log(value);
				return (value);
			}
		}
		// key: 'source_time_stamp',
		// title: 'Source Time Stamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'server_time_stamp',
		headerName: 'Server time stamp',
		width: 170,
		renderCell: (item) => {
			if (item?.row?.server_time_stamp) {
				const value = item?.row?.server_time_stamp && add5Hr30Min(item?.row?.server_time_stamp);
				// console.log(value);
				return (value);
			}
		}
		// key: 'server_time_stamp',
		// title: 'Server Time Stamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'average_pf_for_billing',
		headerName: 'Average PF for billing',
		width: 160,
		// key: 'average_pf_for_billing',
		// title: 'Average PF for Billing',
	},
	{
		field: 'cumulative_energy_kWh_import',
		headerName: 'Cumulative energy KWh import',
		width: 220,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh_import) {
				const value = Number((item?.row?.cumulative_energy_kWh_import / 1000).toFixed(2));
				// console.log("itemvalue",value);
				return (value);
			}
		}
		// key: 'cumulative_energy_kWh_import',
		// title: 'Cumulative Energy KWh Import',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kWh_TZ1',
		headerName: 'Cumulative energy KWh TZ1',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh_TZ1) {
				const value = Number((item?.row?.cumulative_energy_kWh_TZ1 / 1000).toFixed(2));
				return (value);
			}
		}
		// key: 'cumulative_energy_kWh_TZ1',
		// title: 'Cumulative Energy KWh TZ1',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kWh_TZ2',
		headerName: 'Cumulative energy KWh TZ2',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh_TZ2) {
				const value = Number((item?.row?.cumulative_energy_kWh_TZ2 / 1000).toFixed(2));
				return (value);
			}
		}
		// key: 'cumulative_energy_kWh_TZ2',
		// title: 'Cumulative Energy KWh TZ2',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kWh_TZ3',
		headerName: 'Cumulative energy KWh TZ3',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh_TZ3) {
				const value = Number((item?.row?.cumulative_energy_kWh_TZ3 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kWh_TZ3',
		// title: 'Cumulative Energy KWh TZ3',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kWh_TZ4',
		headerName: 'Cumulative energy KWh TZ4',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh_TZ4) {
				const value = Number((item?.row?.cumulative_energy_kWh_TZ4 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kWh_TZ4',
		// title: 'Cumulative Energy KWh TZ4',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kVAh_import',
		headerName: 'Cumulative energy KVAh import',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kVAh_import) {
				const value = Number((item?.row?.cumulative_energy_kVAh_import / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kVAh_import',
		// title: 'Cumulative Energy KVAh Import',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kVAh_TZ1',
		headerName: 'Cumulative energy KVAh TZ1',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kVAh_TZ1) {
				const value = Number((item?.row?.cumulative_energy_kVAh_TZ1 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kVAh_TZ1',
		// title: 'Cumulative Energy KVAh TZ1',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kVAh_TZ2',
		headerName: 'Cumulative energy KVAh TZ2',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kVAh_TZ2) {
				const value = Number((item?.row?.cumulative_energy_kVAh_TZ2 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kVAh_TZ2',
		// title: 'Cumulative Energy KVAh TZ2',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kVAh_TZ3',
		headerName: 'Cumulative energy KVAh TZ3',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kVAh_TZ3) {
				const value = Number((item?.row?.cumulative_energy_kVAh_TZ3 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kVAh_TZ3',
		// title: 'Cumulative Energy KVAh TZ3',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_kVAh_TZ4',
		headerName: 'Cumulative energy KVAh TZ4',
		width: 210,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kVAh_TZ4) {
				const value = Number((item?.row?.cumulative_energy_kVAh_TZ4 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kVAh_TZ4',
		// title: 'Cumulative Energy KVAh TZ4',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_kW',
		headerName: 'Maximum demand kW',
		width: 175,
		renderCell: (item) => {
			if (item?.row?.md_kW) {
				const value = Number((item?.row?.md_kW / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_kW',
		// title: 'Maximum Demand kW',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maximum_demand_kW_capture_time',
		headerName: 'Maximum demand KW capture time',
		width: 260,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_kW_capture_time) {
				const value = item?.row?.maximum_demand_kW_capture_time && captureTimeFormat(item?.row?.maximum_demand_kW_capture_time);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_kW_capture_time',
		// title: 'Maximum Demand KW Capture Time',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'md_kVA',
		headerName: 'Maximum demand kVA',
		width: 175,
		renderCell: (item) => {
			if (item?.row?.md_kVA) {
				const value = Number((item?.row?.md_kVA / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_kVA',
		// title: 'Maximum Demand kVA',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maximum_demand_kVA_capture_time',
		headerName: 'Maximum demand KVA capture time',
		width: 260,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_kVA_capture_time) {
				const value = item?.row?.maximum_demand_kVA_capture_time && captureTimeFormat(item?.row?.maximum_demand_kVA_capture_time);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_kVA_capture_time',
		// title: 'Maximum Demand KVA Capture Time',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'total_billing_power_on_duration',
		headerName: 'Total billing power on duration(hours)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.total_billing_power_on_duration) {
				const value = Number(item?.row?.total_billing_power_on_duration / 60).toFixed(2);
				return (value);
			}
		},
		hide: 'true',
		// key: 'total_billing_power_on_duration',
		// title: 'Total Billing Power On Duration(Hours)',
		// render: (value) => (value / 60).toFixed(2),
	},
	{
		field: 'cumulative_energy_kWh_export',
		headerName: 'Cumulative energy KWh export',
		width: 220,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_kWh_export) {
				const value = Number((item?.row?.cumulative_energy_kWh_export / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_kWh_export',
		// title: 'Cumulative Energy KWh Export',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_KVAh_export',
		headerName: 'Cumulative energy KVAh export',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_KVAh_export) {
				const value = Number((item?.row?.cumulative_energy_KVAh_export / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_KVAh_export',
		// title: 'Cumulative Energy KVAh Export',
		// render: (value) => (value / 1000).toFixed(2),
	},
	// {
	// 	key: 'Month',
	// 	title: 'Month',
	// },
	// {
	// 	key: 'Year',
	// 	title: 'Year',
	// },
	// {
	// 	key: 'utility_id',
	// 	title: 'Utility ID',
	// },
]

export const billingPhase2columns = [
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 155,
		// key: 'meter_serial_number',
		// title: 'Meter Serial Number',
	},
	{
		field: 'source_timestamp',
		headerName: 'Meter timestamp',
		width: 150,
		renderCell: (item) => {
			if (item?.row?.source_timestamp) {
				const value = item?.row?.source_timestamp && add5Hr30Min(item?.row?.source_timestamp);
				// console.log(value);
				return (value);
			}
		}
		// key: 'source_timestamp',
		// title: 'Meter Timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'server_timestamp',
		headerName: 'Server timestamp',
		width: 160,
		renderCell: (item) => {
			if (item?.row?.server_timestamp) {
				const value = item?.row?.server_timestamp && add5Hr30Min(item?.row?.server_timestamp);
				// console.log(value);
				return (value);
			}
		}
		// key: 'server_timestamp',
		// title: 'Server Timestamp',
		// render: (value) => value && add5Hr30Min(value),
	},
	{
		field: 'system_pf_for_billing_period_import',
		headerName: 'System PF for billing period import',
		width: 250,
		// key: 'system_pf_for_billing_period_import',
		// title: 'System PF For Billing Period Import',
	},
	{
		field: 'cumulative_energy_Wh_import',
		headerName: 'Cumulative energy import(Wh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_import) {
				const value = Number((item?.row?.cumulative_energy_Wh_import / 1000).toFixed(2));
				return (value);
			}
		},
		// key: 'cumulative_energy_Wh_import',
		// title: 'Cumulative Energy Import(Wh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ1',
		headerName: 'Cumulative energy TZ1(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ1) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ1 / 1000).toFixed(2));
				return (value);
			}
		},
		// key: 'cumulative_energy_Wh_TZ1',
		// title: 'Cumulative Energy TZ1(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ2',
		headerName: 'Cumulative energy TZ2(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ2) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ2 / 1000).toFixed(2));
				return (value);
			}
		},
		// key: 'cumulative_energy_Wh_TZ2',
		// title: 'Cumulative Energy TZ2(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ3',
		headerName: 'Cumulative energy TZ3(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ3) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ3 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_Wh_TZ3',
		// title: 'Cumulative Energy TZ3(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ4',
		headerName: 'Cumulative energy TZ4(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ4) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ4 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_Wh_TZ4',
		// title: 'Cumulative Energy TZ4(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ5',
		headerName: 'Cumulative energy TZ5(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ5) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ5 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_Wh_TZ5',
		// title: 'Cumulative Energy TZ5(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ6',
		headerName: 'Cumulative energy TZ6(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ6) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ6 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_Wh_TZ6',
		// title: 'Cumulative Energy TZ6(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ7',
		headerName: 'Cumulative energy TZ7(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ7) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ7 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_Wh_TZ7',
		// title: 'Cumulative Energy TZ7(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_Wh_TZ8',
		headerName: 'Cumulative energy TZ8(KWh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_Wh_TZ8) {
				const value = Number((item?.row?.cumulative_energy_Wh_TZ8 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_Wh_TZ8',
		// title: 'Cumulative Energy TZ8(KWh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_import',
		headerName: 'Cumulative energy import(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_import) {
				const value = Number((item?.row?.cumulative_energy_VAh_import / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_import',
		// title: 'Cumulative Energy Import(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ1',
		headerName: 'Cumulative energy TZ1(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ1) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ1 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ1',
		// title: 'Cumulative Energy TZ1(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ2',
		headerName: 'Cumulative energy TZ2(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ2) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ2 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ2',
		// title: 'Cumulative Energy TZ2(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ3',
		headerName: 'Cumulative energy TZ3(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ3) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ3 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ3',
		// title: 'Cumulative Energy TZ3(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ4',
		headerName: 'Cumulative energy TZ4(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ4) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ4 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ4',
		// title: 'Cumulative Energy TZ4(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ5',
		headerName: 'Cumulative energy TZ5(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ5) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ5 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ5',
		// title: 'Cumulative Energy TZ5(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ6',
		headerName: 'Cumulative energy TZ6(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ6) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ6 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ6',
		// title: 'Cumulative Energy TZ6(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ7',
		headerName: 'Cumulative energy TZ7(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ7) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ7 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ7',
		// title: 'Cumulative Energy TZ7(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'cumulative_energy_VAh_TZ8',
		headerName: 'Cumulative energy TZ8(KVAh)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.cumulative_energy_VAh_TZ8) {
				const value = Number((item?.row?.cumulative_energy_VAh_TZ8 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'cumulative_energy_VAh_TZ8',
		// title: 'Cumulative Energy TZ8(KVAh)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_W_import',
		headerName: 'Maximum demand import(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import) {
				const value = Number((item?.row?.md_W_import / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import',
		// title: 'Maximum Demand Import(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	// {
	// 	key: 'maximum_demand_W_capture_time_import',
	// 	title: 'Maximum Demand KW Capture Time Import',
	// 	render: (value) => value && captureTimeFormat(value),
	// },
	{
		field: 'md_W_import_TZ1',
		headerName: 'Maximum import TZ1(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ1) {
				const value = Number((item?.row?.md_W_import_TZ1 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ1',
		// title: 'Maximum Import TZ1(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	// {
	// 	key: 'maximum_demand_TZ1_W_capture_time_import',
	// 	title: 'Maximum Demand TZ1 W Capture Time Import',
	// 	render: (value) => value && captureTimeFormat(value),
	// },
	{
		field: 'md_W_import_TZ2',
		headerName: 'Maximum demand import TZ2(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ2) {
				const value = Number((item?.row?.md_W_import_TZ2 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ2',
		// title: 'Maximum Demand Import TZ2(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_W_import_TZ3',
		headerName: 'Maximum import TZ3(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ3) {
				const value = Number((item?.row?.md_W_import_TZ3 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ3',
		// title: 'Maximum Import TZ3(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_W_import_TZ4',
		headerName: 'Maximum import TZ4(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ4) {
				const value = Number((item?.row?.md_W_import_TZ4 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ4',
		// title: 'Maximum Import TZ4(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_W_import_TZ5',
		headerName: 'Maximum import TZ5(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ5) {
				const value = Number((item?.row?.md_W_import_TZ5 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ5',
		// title: 'Maximum Import TZ5(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_W_import_TZ6',
		headerName: 'Maximum import TZ6(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ6) {
				const value = Number((item?.row?.md_W_import_TZ6 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ6',
		// title: 'Maximum Import TZ6(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_W_import_TZ7',
		headerName: 'Maximum import TZ7(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ7) {
				const value = Number((item?.row?.md_W_import_TZ7 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ7',
		// title: 'Maximum Import TZ7(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_W_import_TZ8',
		headerName: 'Maximum import TZ8(KW)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_W_import_TZ8) {
				const value = Number((item?.row?.md_W_import_TZ8 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_W_import_TZ8',
		// title: 'Maximum Import TZ8(KW)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	// {
	// 	key: 'maximum_demand_TZ2_W_capture_time_import',
	// 	title: 'Maximum Demand TZ2 Capture Time Import(KW)',
	// 	render: (value) => value && captureTimeFormat(value),
	// },
	// {
	// 	key: 'maximum_demand_TZ3_W_capture_time_import',
	// 	title: 'Maximum Demand TZ3 Capture Time Import(KW)',
	// 	render: (value) => value && add5Hr30Min(value),
	// },
	// {
	// 	key: 'maximum_demand_TZ4_W_capture_time_import',
	// 	title: 'Maximum Demand TZ4 Capture Time Import(KW)',
	// 	render: (value) => value && add5Hr30Min(value),
	// },
	// {
	// 	key: 'maximum_demand_TZ5_W_capture_time_import',
	// 	title: 'Maximum Demand TZ5 Capture Time Import(KW)',
	// 	render: (value) => value && add5Hr30Min(value),
	// },
	// {
	// 	key: 'maximum_demand_TZ6_W_capture_time_import',
	// 	title: 'Maximum Demand TZ6 Capture Time Import(KW)',
	// 	render: (value) => value && add5Hr30Min(value),
	// },
	// {
	// 	key: 'maximum_demand_TZ7_W_capture_time_import',
	// 	title: 'Maximum Demand TZ7 Capture Time Import(KW)',
	// 	render: (value) => value && add5Hr30Min(value),
	// },
	// {
	// 	key: 'maximum_demand_TZ8_W_capture_time_import',
	// 	title: 'Maximum Demand TZ8 Capture Time Import(KW)',
	// 	render: (value) => value && add5Hr30Min(value),
	// },
	// {
	// 	key: 'meter_billing_profile_three_phasecol',
	// 	title: 'Meter billing profile three phasecol',
	// },
	{
		field: 'md_VA_import',
		headerName: 'Maximum demand import(KVA)',
		width: 225,
		renderCell: (item) => {
			if (item?.row?.md_VA_import) {
				const value = Number((item?.row?.md_VA_import / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import',
		// title: 'Maximum Demand Import(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maximum_demand_VA_capture_time_import',
		headerName: 'Maximum demand (KVA) capture time import',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_VA_capture_time_import) {
				const value = item?.row?.maximum_demand_VA_capture_time_import && captureTimeFormat(item?.row?.maximum_demand_VA_capture_time_import);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_VA_capture_time_import',
		// title: 'Maximum Demand (KVA) Capture Time Import',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'md_VA_import_TZ1',
		headerName: 'Maximum demand import TZ1(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ1) {
				const value = Number((item?.row?.md_VA_import_TZ1 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import_TZ1',
		// title: 'Maximum Demand Import TZ1(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_VA_import_TZ2',
		headerName: 'Maximum demand import TZ2(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ2) {
				const value = Number((item?.row?.md_VA_import_TZ2 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import_TZ2',
		// title: 'Maximum Demand Import TZ2(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_VA_import_TZ3',
		headerName: 'Maximum demand import TZ3(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ3) {
				const value = Number((item?.row?.md_VA_import_TZ3 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import_TZ3',
		// title: 'Maximum Demand Import TZ3(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_VA_import_TZ4',
		headerName: 'Maximum demand import TZ4(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ4) {
				const value = Number((item?.row?.md_VA_import_TZ4 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// render: (value) => (value / 1000).toFixed(2),
		// key: 'md_VA_import_TZ4',
		// title: 'Maximum Demand Import TZ4(KVA)',
	},
	{
		field: 'md_VA_import_TZ5',
		headerName: 'Maximum demand import TZ5(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ5) {
				const value = Number((item?.row?.md_VA_import_TZ5 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import_TZ5',
		// title: 'Maximum Demand Import TZ5(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_VA_import_TZ6',
		headerName: 'Maximum demand import TZ6(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ6) {
				const value = Number((item?.row?.md_VA_import_TZ6 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import_TZ6',
		// title: 'Maximum Demand Import TZ6(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_VA_import_TZ7',
		headerName: 'Maximum demand import TZ7(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ7) {
				const value = Number((item?.row?.md_VA_import_TZ7 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import_TZ7',
		// title: 'Maximum Demand Import TZ7(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'md_VA_import_TZ8',
		headerName: 'Maximum demand import TZ8(KVA)',
		width: 275,
		renderCell: (item) => {
			if (item?.row?.md_VA_import_TZ8) {
				const value = Number((item?.row?.md_VA_import_TZ8 / 1000).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'md_VA_import_TZ8',
		// title: 'Maximum Demand Import TZ8(KVA)',
		// render: (value) => (value / 1000).toFixed(2),
	},
	{
		field: 'maximum_demand_TZ1_VA_capture_time_import',
		headerName: 'Maximum demand TZ1 (KVA) capture time import',
		width: 350,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_TZ1_VA_capture_time_import) {
				const value = item?.row?.maximum_demand_TZ1_VA_capture_time_import && captureTimeFormat(item?.row?.maximum_demand_TZ1_VA_capture_time_import);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_TZ1_VA_capture_time_import',
		// title: 'Maximum Demand TZ1 (KVA) Capture Time Import',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'maximum_demand_TZ2_VA_capture_time_import',
		headerName: 'Maximum demand TZ2 (KVA) capture time import',
		width: 350,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_TZ2_VA_capture_time_import) {
				const value = item?.row?.maximum_demand_TZ2_VA_capture_time_import && captureTimeFormat(item?.row?.maximum_demand_TZ2_VA_capture_time_import);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_TZ2_VA_capture_time_import',
		// title: 'Maximum Demand TZ2 (KVA) Capture Time Import',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'maximum_demand_TZ3_VA_capture_time_import',
		headerName: 'Maximum demand TZ3 (KVA) capture time import',
		width: 350,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_TZ3_VA_capture_time_import) {
				const value = item?.row?.maximum_demand_TZ3_VA_capture_time_import && captureTimeFormat(item?.row?.maximum_demand_TZ3_VA_capture_time_import);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_TZ3_VA_capture_time_import',
		// title: 'Maximum Demand TZ3 (KVA) Capture Time Import',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'maximum_demand_TZ4_VA_capture_time_import',
		headerName: 'Maximum demand TZ4 (KVA) capture time import',
		width: 350,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_TZ4_VA_capture_time_import) {
				const value = item?.row?.maximum_demand_TZ4_VA_capture_time_import && captureTimeFormat(item?.row?.maximum_demand_TZ4_VA_capture_time_import);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_TZ4_VA_capture_time_import',
		// title: 'Maximum Demand TZ4 (KVA) Capture Time Import',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'maximum_demand_TZ5_VA_capture_time_import',
		headerName: 'Maximum demand TZ5 (KVA) capture time import',
		width: 350,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_TZ5_VA_capture_time_import) {
				const value = item?.row?.maximum_demand_TZ5_VA_capture_time_import && captureTimeFormat(item?.row?.maximum_demand_TZ5_VA_capture_time_import);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_TZ5_VA_capture_time_import',
		// title: 'Maximum Demand TZ5 (KVA) Capture Time Import',
		// render: (value) => value && captureTimeFormat(value),
	},
	{
		field: 'maximum_demand_TZ6_VA_capture_time_import',
		headerName: 'Maximum demand TZ6 (KVA) capture time import',
		width: 350,
		renderCell: (item) => {
			if (item?.row?.maximum_demand_TZ6_VA_capture_time_import) {
				const value = item?.row?.maximum_demand_TZ6_VA_capture_time_import && captureTimeFormat(item?.row?.maximum_demand_TZ6_VA_capture_time_import);
				return (value);
			}
		},
		hide: 'true',
		// key: 'maximum_demand_TZ6_VA_capture_time_import',
		// title: 'Maximum Demand TZ6 (KVA) Capture Time Import',
		// render: (value) => value && captureTimeFormat(value),
	},
	// {
	// 	key: 'maximum_demand_TZ7_VA_capture_time_import',
	// 	title: 'Maximum Demand TZ7 (KVA) Capture Time Import',
	// 	render: (value) => value && captureTimeFormat(value),
	// },
	// {
	// 	key: 'maximum_demand_TZ8_VA_capture_time_import',
	// 	title: 'Maximum Demand TZ8 (kVA) Capture Time Import',
	// 	render: (value) => value && captureTimeFormat(value),
	// },
	{
		field: 'total_billing_power_on_duration',
		headerName: 'Total billing power on duration(hours)',
		width: 280,
		renderCell: (item) => {
			if (item?.row?.total_billing_power_on_duration) {
				const value = Number((item?.row?.total_billing_power_on_duration / 60).toFixed(2));
				return (value);
			}
		},
		hide: 'true',
		// key: 'total_billing_power_on_duration',
		// title: 'Total Billing Power On Duration(Hours)',
		// render: (value) => (value / 60).toFixed(2),
	},
	// {
	// 	key: 'cumulative_energy_Wh_export',
	// 	title: 'Cumulative Energy Export(KWh)',
	// 	render: (value) => (value / 1000).toFixed(2),
	// },
	// {
	// 	key: 'cumulative_energy_VAh_export',
	// 	title: 'Cumulative Energy Export(KVAh)',
	// 	render: (value) => (value / 1000).toFixed(2),
	// },
	// {
	// 	key: 'cumulative_energy_VArh_Q1',
	// 	title: 'Cumulative Energy Q1(KVArh)',
	// 	render: (value) => (value / 1000).toFixed(2),
	// },
	// {
	// 	key: 'cumulative_energy_VArh_Q2',
	// 	title: 'Cumulative Energy Q2(KVArh)',
	// 	render: (value) => (value / 1000).toFixed(2),
	// },
	// {
	// 	key: 'cumulative_energy_VArh_Q3',
	// 	title: 'Cumulative Energy Q3(KVArh)',
	// 	render: (value) => (value / 1000).toFixed(2),
	// },
	// {
	// 	key: 'cumulative_energy_VArh_Q4',
	// 	title: 'Cumulative Energy Q4(KVArh)',
	// 	render: (value) => (value / 1000).toFixed(2),
	// },
	// {
	// 	key: 'Month',
	// 	title: 'Month',
	// },
	// {
	// 	key: 'Year',
	// 	title: 'Year',
	// },
	// {
	// 	key: 'utility_id',
	// 	title: 'Utility id',
	// },
]
