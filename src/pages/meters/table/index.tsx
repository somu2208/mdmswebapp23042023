import {Visibility} from '@mui/icons-material'
import {CircularProgress, Pagination} from '@mui/material'
import {exportMeterData, getMeters} from 'api/services/meters'
import CsvExport from 'components/CsvExport'
import ExportToExcel from 'components/ExportToExcel'
import {PowerOff, PowerOn} from 'components/icons'
import Table from 'components/NewTable/meterTable'
import {add, format} from 'date-fns'
import {useEffect, useState} from 'react'
import {useMutation} from 'react-query'
import {Link, useNavigate} from 'react-router-dom'
import {getCSVHeaderLabels} from 'utils'
import LookUpFilters from './LookUpFilters'
// import {Pageview} from '@mui/icons-material'
import {RemoveRedEye} from '@mui/icons-material'
import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
  Chip,
} from "@mui/material";
import styled from "styled-components/macro";
import { spacing } from "@mui/system";



const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const MetersTable = () => {
	const {data, isLoading, mutate} = useMutation(getMeters)
	const [page, setPage] = useState<number>(1)
	const [limit, setLimit] = useState<number>(101)
	const navigate = useNavigate()

	const handleChange = (event, value) => {
		setPage(value)
		return mutate({page: value, limit})
	}
	useEffect(() => {
		mutate({limit, page})
	}, [])
	

	const handleExport = async () => {
		const data = await exportMeterData()
		return data.data
	}
	// console.log("datatatatat",data)

	return (
		<Grid justifyContent="space-between" container spacing={6}>			
			<Grid item xs={12} lg={12}>			
				<Typography variant="h3" gutterBottom>
					Meters
				</Typography>
				<Divider my={3} />
				<Grid container spacing={6}>
				<Grid item xs={12} lg={12} spacing={6} >
					{!isLoading ? (
					<section className='bg-white rounded-xl shadow-md p-3 min-h-[500px]'>
						<div className=''>
							<div className='text-sm-count text-right'>
								<Typography>Total Count: {data?.data?.meta?.filter_count}</Typography>
							</div>
							<Table
								columns={columns}
								tableData={data?.data?.data || []}
								loading={isLoading}								
							/>
							
						</div>
						</section>
					) : (
						<div className='flex justify-center mt-8'>
							<CircularProgress />
						</div>
					)}
				</Grid>
			</Grid>
			</Grid>
		</Grid>
	)
}

//add 5hr30min to date and format
export const add5Hr30Min = (date) => {
	return format(
		add(new Date(date), {
			hours: 5,
			minutes: 30,
		}),
		'dd/MM/yyyy hh:mm:ss a'
	)
}

const columns = [	
	{
		field: 'action',
		headerName: 'Action',
		width: 70,
		renderCell: (item) => {
			return (
				<>
					<Link
						to={`${item?.row?.meter_serial_number}`}
						className='hover:underline pl-3'
					>
						<RemoveRedEye />
					</Link>
				</>
			)
		}
	},
	{
		field:'meter_serial_number',
		headerName: 'Serial number',	
		width: 120,
		renderCell: (item) => {
			if (item?.row?.meter_serial_number) {
				return (
					<Link
						className='text-blue-500 hover:underline'
						to={{
							pathname: `${item?.row?.meter_serial_number}/meter360/instantaneous`,
							search: `phase=${item?.row?.meter_connection_type?.phase_id}&customerId=${item?.row?.usc_number}`,
						}}
					>
						{item?.row?.meter_serial_number}
					</Link>
				)
			}
		}
	},
	{
		field: 'meter_make',
		headerName: 'Make',
		width: 220,
	},
	{
		field: 'phase_name',
		headerName: 'Meter connection type',
		width: 175,
		valueGetter:(params) => {
			let result = [];
			if(params?.row?.meter_connection_type){
				if(params?.row?.meter_connection_type?.phase_name){
					result.push(params.row.meter_connection_type.phase_name);
				}
			}
			return result;
		}		
	},
	{
		field:'latest_sync_date',
		headerName:'Last sync date time',	
		width: 170,
		renderCell : (item) => {
			if(item?.row?.latest_sync_date){
				const value = item?.row?.latest_sync_date && add5Hr30Min(item?.row?.latest_sync_date);
				return(value);
			}
		}

		// render: (rowData) => (
		// 	<>
		// 		{rowData?.latest_sync_date &&
		// 			format(
		// 				add(new Date(rowData?.latest_sync_date), {hours: 5, minutes: 30}),
		// 				'dd/MM/yyyy, hh:mm:ss a'
		// 			)}
		// 	</>
		// ),
	},
	{
		field: 'dt_id',
		headerName: 'Transformer Id',
		width:120,
		valueGetter: (item) => {
			let result = [];
			if(item?.row?.transformer_id){
				if(item?.row?.transformer_id?.dt_id){
					result.push(item.row.transformer_id.dt_id)
				}
			}
			return result
		}
	},
	{
		field: 'dt_name',
		headerName: 'Transformer name',
		width: 200,
		valueGetter: (item) => {
			let result = [];
			if(item?.row?.transformer_id){
				if(item?.row?.transformer_id?.dt_name){
					result.push(item.row.transformer_id.dt_name)
				}
			}
			return result
		}
	},
	{
		field: 'network_configuration.name',
		headerName: 'NIC configuration',
		width: 175,
		valueGetter: (item) => {
			let result = [];
			if(item?.row?.network_configuration){
				if(item?.row?.network_configuration?.name){
					result.push(item.row.network_configuration.name)
				}
			}
			return result
		}
	},
	{
		field: 'meter_category_id.name',
		headerName: 'Network type',
		width: 120,
		valueGetter: (item) => {
			let result = [];
			if(item?.row?.meter_category_id){
				if(item?.row?.meter_category_id?.name){
					result.push(item.row.meter_category_id.name)
				}
			}
			return result
		}
	},
	{
		field: 'meter_type_name',
		headerName: 'Prepaid / Postpaid',
		width: 150,
		valueGetter: (item) => {
			let result = [];
			if(item?.row?.preorpostpaid){
				if(item?.row?.preorpostpaid?.meter_type_name){
					result.push(item.row.preorpostpaid.meter_type_name)
				}
			}
			return result
		}
	},
	{
		field:'feeder_name',
		headerName: 'Feeder name',
		width: 220,
		valueGetter:(item) => {
			let result = [];
			if(item?.row?.feeder_id){
				if(item?.row?.feeder_id?.feeder_name){
					result.push(item.row.feeder_id.feeder_name)
				}
			}
			return result
		}
	},
	{
		field: 'feeder_id',
		headerName : 'Feeder number',
		width: 120,
		valueGetter:(item) =>{
			let result = [];
			if(item?.row?.feeder_id){
				if(item?.row?.feeder_id?.feeder_id){
					result.push(item.row.feeder_id.feeder_id)
				}
			}
			return result;
		}
	},
	{
		field: 'type_description',
		headerName: 'Type',
		width: 120,
		valueGetter:(params) => {
			let result = [];
			if(params?.row?.type_id){
				if(params?.row?.type_id?.type_description){
					result.push(params.row.type_id.type_description);
				}
			}
			return result;
		}	
	},
	{
		field: 'meter_protocol_classification_id.name',
		headerName: 'Protocol',
		width: 100,
		valueGetter:(params) => {
			let result = [];
			if(params?.row?.meter_protocol_classification_id){
				if(params?.row?.meter_protocol_classification_id?.name){
					result.push(params.row.meter_protocol_classification_id.name);
				}
			}
			return result;
		}	
	},
	{
		field: 'current_balance_timestamp',
		headerName: 'Current balance time',
		renderCell: (item) => {
			if(item?.row?.current_balance_timestamp){
				const value = item?.row?.current_balance_timestamp && add5Hr30Min(item?.row?.current_balance_timestamp);
				return value;
			}
		},
		width: 175
	},
	{
		field: 'current_balance',
		headerName: 'Current balance',
		width: 120	
	},
	{
		field: 'firmware_version',
		headerName: 'Firmware Version',
		width: 140
	},
	{
		field: 'maximum_load_occured_date_time',
		headerName: 'Maximum load occured date time',
		renderCell:(item) => {
			if(item?.row?.maximum_load_occured_date_time){
				const value = item?.row?.maximum_load_occured_date_time && add5Hr30Min(item?.row?.maximum_load_occured_date_time);
				return value;
			}
		},
		width: 230
	},
	{
		field: 'maximum _load_occured',
		headerName: 'Maximum load occured',
		width: 175
	},
	{
		field: 'latest_relay_connected_datetime',
		headerName: 'Latest relay connected time',
		renderCell: (item) => {
			if(item?.row?.latest_relay_connected_datetime){
				const value = item?.row?.latest_relay_connected_datetime && add5Hr30Min(item?.row?.latest_relay_connected_datetime);
				return value;
			}
		},
		width: 210
	},
	{
		field: 'latest_relay_disconnected_datetime',
		headerName: 'Latest relay disconnected time',
		renderCell:(item) => {
			if(item?.row?.latest_relay_disconnected_datetime){
				const value = item?.row?.latest_relay_disconnected_datetime && add5Hr30Min(item?.row?.latest_relay_disconnected_datetime);
				return value;
			}
		},
		width: 230
	},
	{
		field: 'first_reading_after_installation_kWh',
		headerName: 'First reading after installation kwh',
		width: 230
	},
	{
		field: 'decommissioning_date',
		headerName: 'Decommissioning date',
		renderCell:(item) => {
			if(item?.row?.decommissioning_date){
				const value = item?.row?.decommissioning_date && add5Hr30Min(item?.row?.decommissioning_date);
				return value;
			}
		},
		width: 175
	},
	{
		field:'installation_date',
		headerName: 'Installation date',
		renderCell: (item) => {
			if(item?.row?.installation_date){
				const value = item?.row?.installation_date && add5Hr30Min(item?.row?.installation_date)
				return value
			}
		},
		width: 150
	},
	{
		field: 'meter_initial_reading',
		headerName: 'Meter initial reading',
		width: 150
	},
	{
		field: 'relay_status',
		headerName: 'Relay status'
	},
	{
		field: 'meter_voltage_rating',
		headerName: 'Voltage rating',
		width: 120
	},
	{
		field: 'meter_current_rating',
		headerName: 'Current rating',
		width: 120
	},
	{
		field: 'meter_accuracy_class',
		headerName: 'Accuracy class',
		width: 120
	},
	{
		field: 'pt_ratio',
		headerName: 'PT ratio',
	},
	{
		field: 'ct_ratio',
		headerName: 'CT ratio',
	},
	{
		field: 'usc_number',
		headerName: 'Customer service number',	
		width: 210,
	},	
	{
		field: 'meter_ipaddress',
		headerName: 'Meter IP address',	
		width: 145,
	},
	{
		field: 'meter_imei_number',
		headerName: 'IMEI number',	
		width: 150,
	},
	{
		field: 'meter_sim_number',
		headerName: 'SIM number',	
		width: 180,
	},
	{
		field: 'power_status',
		headerName: 'Power Off/On',
		width: 130,
		renderCell: (item) => {
			if (item?.row?.power_status) {
				if (item?.row?.power_status === 'On') {					
					return (
						<Chip label="Active" color="success" className="statusbox" />
					)
				} else {					
					return (
						<Chip label="Inactive" color="warning" className="statusbox" />
					)
				}
			}
		}
		
	},
	{
		field: 'latest_reading_kWh',
		headerName: ' Total power consumption (Kwh)',
		width: 220,
		renderCell: (item) => {
			if(item?.row?.latest_reading_kWh){
				const value = (item?.row?.latest_reading_kWh / 1000).toFixed(2);
				return(value);
			}
		},
	},
	{
		field: 'meter_capacity',
		headerName: 'Meter capacity',
		width: 130,
	},
	{
		field: 'latest_poweroff_datetime',
		headerName: 'Last power outage time',
		width: 170,
		renderCell: (item) => {
			if(item?.row?.latest_poweroff_datetime){
				const value = add5Hr30Min(item?.row?.latest_poweroff_datetime);
				return(value);
			}
		},
		// render: (rowData) => add5Hr30Min(rowData?.latest_poweroff_datetime),
		// excelRender: (value) => add5Hr30Min(value),
	},
	{
		field: 'meter_signal_strength',
		headerName: 'Average signal strength',
		width: 170,
	},
	{
		field: 'meter_health_indicator',
		headerName: 'Meter health',
		width: 120,
	}		
]

export default MetersTable