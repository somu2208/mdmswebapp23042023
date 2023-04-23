import { format } from 'date-fns'
import { add5Hr30Min } from 'utils'

export function getData(data: any) {
	let result = [
		{
			title: 'Meter details',
			values: [
				{
					label: 'Meter Serial Number',
					value: data?.meter_serial_number || 'NA',
				},
				{
					label: 'Consumer Service Number ',
					value: data?.usc_number || 'NA',
				},
				{
					label: 'Meter Protocol',
					value: data?.meter_protocol_classification_id?.name || 'NA',
				},
				{
					label: 'Meter Connection Type',
					value: data?.meter_connection_type?.phase_name || 'NA',
				},
				//	{
				//		label: 'Meter Port Number',
				//		value: data?.meter_port_number || 'NA',
				//	},
				{
					label: 'Meter Category',
					value: data?.meter_category_id?.name || 'NA',
				},
				{
					label: 'Meter Type',
					value: data?.type_id?.type_name || 'NA',
				},
				{
					label: 'Meter Group',
					value: data?.meter_group_id?.name || 'NA',
				},
				{
					label: 'Meter Classification',
					value: data?.preorpostpaid?.meter_type_name || 'NA',
				},
				{
					label: 'Latest Power On date time',
					value: data?.latest_poweron_datetime
						? add5Hr30Min(data.latest_poweron_datetime)
						: 'NA',
				},
				{
					label: 'Latest Power off date time',
					value: getFormattedDate(data?.latest_poweroff_datetime),
				},
				{
					label: 'Power Consumption KWH',
					//value: data?.latest_powerconsumption_kwh || 'NA',
					value: (data?.latest_reading_kWh / 1000).toFixed(2) || 'NA',
				},
				//{
				//	label: 'Latest Relay disconnected date time',
				//	value:
				//		getFormattedDate(data?.latest_relay_disconnected_datetime) || 'NA',
				//	},
				{
					label: 'Latest Relay connected date time',
					value:
						getFormattedDate(data?.latest_relay_connected_datetime) || 'NA',
				},
				//{
				//	label: 'Latest Power consumption updated date time',
				//	value:
				//		getFormattedDate(data?.latest_powerconsumption_updated_time) ||
				//		'NA',
				//	},
			],
		},
		// {
		// 	title: 'Meter manufacturing details',
		// 	values: [
		// 		{
		// 			label: 'Meter Make',
		// 			value: data?.meter_make || 'NA',
		// 		},
		// 		{
		// 			label: 'Meter Model',
		// 			value: data?.meter_model || 'NA',
		// 		},
		// 		{
		// 			label: 'Meter Manufacture',
		// 			value: data?.area_id?.area_name || 'NA',
		// 		},
		// 		{
		// 			label: 'Meter Manufacturing Date',
		// 			value: data?.meter_manufacture_year_month || 'NA',
		// 		},
		// 		{
		// 			label: 'Meter Occuracy',
		// 			value: data?.sub_group?.sub_group_name || 'NA',
		// 		},
		// 		{
		// 			label: 'Meter Current Rating',
		// 			value: data?.meter_current_rating || 'NA',
		// 		},
		// 		{
		// 			label: 'Meter Voltage Rating',
		// 			value: data?.meter_voltage_rating || 'NA',
		// 		},
		// 	],
		// },
		{
			title: 'Hierarchy details',
			values: [
				{
					label: 'Utility Id and Name',
					value: data?.utility_id?.utility_name || 'NA',
				},
			],
		},
		{
			title: 'Meter status and installation details',
			values: [
				{
					label: 'Meter Status',
					value: data?.meter_status || 'NA',
				},
				{
					label: 'Installation Date',
					value: getFormattedDate(data?.installation_date) || 'NA',
				},
				{
					label: 'Decommission Date',
					value: data?.decommissioning_date || 'NA',
				},
				{
					label: 'Meter IP address',
					value: data?.meter_ipaddress || 'NA',
				},
				{
					label: 'IMEI Number',
					value: data?.meter_imei_number || 'NA',
				},
				{
					label: 'Sim number',
					value: data?.meter_sim_number || 'NA',
				},
				{
					label: 'Power off/On',
					value: data?.power_status || 'NA',
				},
				{
					label: 'Relay status',
					value: data?.relay_status || 'NA',
				},
				{
					label: 'Latest Sync date time',
					value: getFormattedDate(data?.latest_sync_date),
				},
			],
		},
	]
	return result
}

const getFormattedDate = (value) => {
	return value ? add5Hr30Min(value) : 'NA'
}
