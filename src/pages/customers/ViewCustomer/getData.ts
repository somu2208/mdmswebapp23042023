export function getData(data: any) {
	let result = [
		{
			title: 'Customer details',
			values: [
				{
					label: 'Customer Service Number',
					value: data?.usc_number || 'NA',
				},
				{
					label: 'Customer Name',
					value: `${data?.first_name} ${data?.laste_name || ''}`,
				},
				{
					label: 'Customer Phone Number',
					value: data?.phone1 || 'NA',
				},
				{
					label: 'Customer Address',
					value: data?.address || 'NA',
				},
				{
					label: 'Customer State',
					value: data?.state || 'NA',
				},
				{
					label: 'Customer City',
					value: data?.city || 'NA',
				},
				{
					label: 'Customer Pincode',
					value: data?.pincode || 'NA',
				},
				{
					label: 'Customer Type',
					value: data?.consumer_type_id?.type_name || 'NA',
				},
				{
					label: 'Customer Category',
					value: data?.consumer_category?.consumer_category_name || 'NA',
				},
				{
					label: 'Customer Classification',
					value: data?.preorpostpaid?.meter_type_name || 'NA',
				},
				{
					label: 'Customer Phase',
					value: data?.consumer_phase_id?.phase_name || 'NA',
				},
			],
		},
		{
			title: 'Hierarchy details',
			values: [
				{
					label: 'Customer Utility',
					value: data?.utility_id?.utility_name || 'NA',
				},
				{
					label: 'Customer Section',
					value: data?.section_id?.section_name || 'NA',
				},
				{
					label: 'Customer Area',
					value: data?.area_id?.area_name || 'NA',
				},
				{
					label: 'Customer ERO',
					value: data?.ero_id?.ero_name || 'NA',
				},
				{
					label: 'Customer SubGroup',
					value: data?.sub_group?.sub_group_name || 'NA',
				},
				{
					label: 'Zone Id and  Name',
					value: data?.zone_id
						? `${data?.zone_id?.zone_id} - ${data?.zone_id?.zone_name}`
						: 'NA',
				},
				{
					label: 'Circle_Id and Name',
					value: data?.circle_id
						? `${data?.circle_id?.circle_id} - ${data?.circle_id?.circle_name}`
						: 'NA',
				},
				{
					label: 'Division_Id and Name',
					value: data?.division_id
						? `${data?.division_id?.division_id} - ${data?.division_id?.division_name}`
						: 'NA',
				},
				{
					label: 'Sub_Division_Id and Name',
					value: data?.sub_division_id
						? `${data?.sub_division_id?.sub_division_id} - ${data?.sub_division_id?.sub_division_name}`
						: 'NA',
				},
				{
					label: 'Sub_Station Id and Name',
					value: data?.sub_station_id
						? `${data?.sub_station_id?.sub_station_id} - ${data?.sub_station_id?.sub_station_name}`
						: 'NA',
				},
				{
					label: 'Feeder_Id and Name',
					value: data?.feeder_id
						? `${data?.feeder_id?.feeder_id} - ${data?.feeder_id?.feeder_name}`
						: 'NA',
				},
				{
					label: 'Transformer Id and Name',
					value: `${data?.dt_id?.dt_id} - ${data?.dt_id?.dt_name || 'NA'}`,
				},
			],
		},
		{
			title: 'Meter details',
			values: [
				{
					label: 'Merer Serial Number',
					value: data?.meter_serial_number?.meter_serial_number || 'NA',
				},
				{
					label: 'Old Meter Serial Number',
					value: data?.old_meterid || 'NA',
				},
				{
					label: 'Old Meter Reading',
					value: data?.old_meter_reading || 'NA',
				},
				//{
				//	label: 'New Meter Start Reading',
				//	value: data?.new_meter_start_Date || 'NA',
				//},
				//{
				//	label: 'Date disconnected old meter',
				//	value: data?.date_disconnected_old_meter || 'NA',
				//},
			],
		},
		{
			title: 'Survey details',
			values: [
				// {
				// 	label: 'Survey ID',
				// 	value: data?.survey_id?.survey_id || 'NA',
				// },
				{
					label: 'Surveyor  Name',
					value: data?.surveyor_name || 'NA',
				},
				{
					label: 'Surveyor phone number',
					value: data?.surveyor_name || 'NA',
				},
				{
					label: 'Survey Date',
					value: data?.serveyor_phone_number || 'NA',
				},
			],
		},
		{
			title: 'Meter installation details',
			values: [
				{
					label: 'Customer latitude',
					value: data?.latitude || 'NA',
				},
				{
					label: 'Customer longitude',
					value: data?.longitude || 'NA',
				},
				{
					label: 'Installation Date',
					value: data?.Installation_date || 'NA',
				},
				{
					label: 'Installation Latitude',
					value: data?.Installation_latitude || 'NA',
				},
				{
					label: 'Installation Longitude',
					value: data?.Installation_longitude || 'NA',
				},
				{
					label: 'Decommissioning Date',
					value: data?.decommissioning_date || 'NA',
				},
				{
					label: 'Customer Status',
					value: data?.consumer_status || 'NA',
				},
				//{
				//	label: 'Data sent to cloud first time (date and time)',
				//	value: data?.data_sent_first_time || 'NA',
				//},
				{
					label: 'Power On /Power off status',
					value: data?.meter_serial_number?.power_status || 'NA',
				},
				{
					label: 'Relay On/Off Status',
					value: data?.meter_serial_number?.relay_status || 'NA',
				},
			],
		},
		{
			title: 'Load details',
			values: [
				{
					label: 'Sanction Load',
					value: data?.sanction_load || 'NA',
				},
				{
					label: 'Connected Load',
					value: data?.connected_load || 'NA',
				},
				{
					label: 'Contract Demand',
					value: data?.contract_demand || 'NA',
				},
				{
					label: 'Supply voltage',
					value: data?.supply_voltage || 'NA',
				},
			],
		},
		{
			title: 'Billing details',
			values: [
				{
					label: 'TOD',
					value: data?.tod || 'NA',
				},
				{
					label: 'TOU',
					value: data?.tou || 'NA',
				},
				{
					label: 'Bill Period',
					value: data?.bill_period || 'NA',
				},
			],
		},
	]
	return result
}
