import {defaultDataType} from 'export-xlsx'

const SETTINGS_FOR_EXPORT = {
	// Table settings
	fileName: 'Prepaid_customers',
	workSheets: [
		{
			sheetName: 'Customers',
			startingRowNumber: 0,
			gapBetweenTwoTables: 0,
			tableSettings: {
				data: {
					tableTitle: 'Score',
					headerGroups: [
						{
							name: 'Score',
							key: 'score',
						},
					],
					headerDefinition: [
						{
							name: 'Meter serial number',
							key: 'meter_serial_number',
							width: 25,
						},
						{
							name: 'Customer service number',
							dataType: defaultDataType.string,
							key: 'usc_number',
							width: 18,
						},
						{
							name: 'Name',
							dataType: defaultDataType.string,
							key: 'first_name',
							width: 28,
						},
						{
							name: 'Address',
							dataType: defaultDataType.string,
							key: 'address',
							width: 18,
						},
						{
							name: 'Contact Number',
							dataType: defaultDataType.string,
							key: 'phone1',
							width: 18,
						},
						{
							name: 'Phase',
							dataType: defaultDataType.string,
							key: 'phase_name',
							width: 18,
						},
						{
							name: 'Total recharge amount (INR)',
							dataType: defaultDataType.string,
							key: 'total_amount_paid',
							width: 18,
						},
						{
							name: 'Units consumption (Kwh)',
							dataType: defaultDataType.number,
							key: 'latest_reading_kWh',
							width: 18,
						},
						{
							name: 'Unit Rate',
							dataType: defaultDataType.string,
							key: 'unit_rate',
							width: 18,
						},
						{
							name: 'Total Amount Consumed (INR)',
							dataType: defaultDataType.string,
							key: 'totalAmountConsumed',
							width: 18,
						},
						{
							name: 'Remaining Units Left (Kwh)',
							dataType: defaultDataType.string,
							key: 'remainingUnitsLeft',
							width: 18,
						},
						{
							name: 'Current Balance (INR)',
							dataType: defaultDataType.string,
							key: 'current_balance',
							width: 18,
						},
						{
							dataType: defaultDataType.string,
							name: 'Current Balance Updated Time',
							key: 'current_balance_timestamp',
							width: 25,
						},
						{
							name: 'Latest Recharge Amount (INR)',
							dataType: defaultDataType.string,
							key: 'last_recharge_amount',
							width: 18,
						},
						{
							dataType: defaultDataType.string,
							name: 'Latest Recharge Date',
							key: 'date_of_last_recharge',
							width: 25,
						},
						{
							name: 'ERO Name',
							dataType: defaultDataType.string,
							key: 'ero_name',
							width: 18,
						},
						{
							name: 'Section',
							dataType: defaultDataType.string,
							key: 'section_name',
							width: 25,
						},
						{
							name: 'Area',
							dataType: defaultDataType.string,
							key: 'area_name',
							width: 25,
						},
					],
				},
			},
		},
	],
}

export default SETTINGS_FOR_EXPORT
