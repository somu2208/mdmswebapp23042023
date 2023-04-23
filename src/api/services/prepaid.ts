import http, {utilityId} from 'api/http'
import {format, getDaysInMonth, getYear, set, sub} from 'date-fns'
import {access_token} from '../http'
import _ from 'lodash'

interface IPrepaidListParams {
	limit?: number
	offset?: number
	search?: {value: string | number | null; type: 'prepaid_id' | 'meter_id'}
	page?: number
}

export const exportPrepaidList = async () => {
	const res = await http.get('/items/consumer', {
		params: {
			filter: {utility_id: {_eq: utilityId}},
			access_token,
			fields:
				'usc_number,first_name,address,phone1,total_amount_paid, meter_serial_number.meter_id, meter_serial_number,meter_serial_number.meter_id, meter_serial_number.relay_status,old_meterid,ero_id.ero_name,section_id.section_name, area_id.area_name,consumer_category.consumer_category_name,sub_group.sub_group_name,consumer_phase_id.phase_name, meter_serial_number.latest_sync_date',
			meta: 'filter_count',
		},
	})

	return res.data
}

export const fetchPrepaidList = async ({
	limit,
	offset = 0,
	search = {value: '', type: 'prepaid_id'},
	page,
}: IPrepaidListParams) => {
	if (search.type === 'prepaid_id') {
		const res = await http.get('/items/consumer', {
			params: {
				filter: {utility_id: {_eq: utilityId}},
				access_token,
				fields:
					'usc_number,first_name,total_amount_paid,meter_serial_number.meter_id,address,phone1,meter_serial_number.meter_serial_number,meter_serial_number.old_meterid,ero_id.ero_name,section_id.section_name, area_id.area_name,meter_serial_number.relay_status, meter_serial_number.old_meterid,consumer_phase_id.phase_name, meter_serial_number.latest_sync_date,meter_serial_number.latest_reading_kWh, meter_serial_number.current_balance,meter_serial_number.current_balance_timestamp,date_of_last_recharge,last_recharge_amount, meter_serial_number.meter_connection_type',
				meta: 'filter_count',
				limit,
				offset,
				search: search.value,
				page,
			},
		})
		return res.data
	}
	if (search.type === 'meter_id') {
		const res = await http.get('/items/consumer', {
			params: {
				filter: {
					utility_id: {_eq: utilityId},
					meter_serial_number: {_eq: search.value},
				},
				access_token,
				fields: '*.*',
				meta: 'filter_count',
				limit,
				offset,
				page,
			},
		})
		return res.data
	}

	const res = await http.get('/items/consumer', {
		params: {
			filter: {utility_id: {_eq: utilityId}},
			access_token,
			fields: '*.*',
			meta: 'filter_count',
			limit,
			offset,
			page,
		},
	})

	return res.data
}

export const fetchTotalUnitConsumed = async () => {
	const res = await http.get('items/meters', {
		params: {
			access_token,
			fields: 'latest_reading_kWh',
			filter: {utility_id: {_eq: utilityId}},
			'aggregate[sum]': 'latest_reading_kWh',
		},
	})
	return res.data.data[0].sum.latest_reading_kWh
}

export const lastUpdateTimeForMeters = async () => {
	const res = await http.get('items/meters', {
		params: {
			access_token,
			fields: 'latest_sync_date',
			filter: {utility_id: {_eq: utilityId}},
		},
	})
	return res?.data?.data[0]?.latest_sync_date
}

export const totalRevenueGenerated = async () => {
	const res = await http.get('items/recharge_history_mdms', {
		params: {
			access_token,
			'aggregate[sum]': 'recharge_amount',
			filter: {
				_and: [
					{read_write_param_id: {_eq: 41}},
					{utility_id: {_eq: utilityId}},
				],
			},
		},
	})
	return res?.data?.data[0]?.sum?.recharge_amount
}

export const latestSyncDateRevenue = async () => {
	const res = await http.get('items/recharge_history_mdms', {
		params: {
			access_token,
			sort: '-date_time',
			fields: 'date_time',
			filter: {utility_id: {_eq: utilityId}},
		},
	})
	return res?.data?.data[0]?.date_time
}

export const balanceHistory = async (meter_id: string) => {
	const res = await http.get('items/balance_history', {
		params: {
			access_token,
			sort: '-source_timestamp',
			limit:-1,
			filter: {meter_serial_number: {_eq: meter_id}},
		},
	})
	// console.log(res.data.data)
	return res?.data?.data
}

export const fetchPowerConsumptionHistory = async (meterId: string) => {
	const res = await http.get('items/meter_daily_load_data', {
		params: {
			access_token,
			'aggregate[sum]': 'energy_wh_import',
			sort:'-source_timestamp',
			limit:-1,
			'groupBy[]': 'date',
			filter: {meter_serial_number: {_eq: meterId}},
		},
	})
	return res.data.data
}

export const fetchRechargeHistory = async (query) => {
	return http.get('/items/recharge_history_mdms', {
		params: {
			access_token,
			limit: 1,
			filter: {
				_and: [
					{read_write_param_id: {_eq: 41}},
					{meter_serial_number: {_eq: query?.queryKey[0]}},
				],
			},
		},
	})
}

export const fetchRechargeHistoryGraph = async (query) => {
	const res = await http.get('/items/recharge_history_mdms', {
		params: {
			access_token,
			limit:-1,
			filter: {
				_and: [
					{read_write_param_id: {_eq: 41}},
					{meter_serial_number: {_eq: query}},
				],
			},
			'aggregate[sum]': 'recharge_amount,balance_at_recharge',
			'groupBy[]': 'day(date_time),year(date_time),month(date_time)',
		},
	})
	return res.data.data
}

export const fetchRechargeHistoryGraphByMeter = async (query) => {
	return http.get('/items/recharge_history_mdms', {
		params: {
			access_token,
			sort:'-date_time',
			limit:-1,
			filter: {
				_and: [
					{read_write_param_id: {_eq: 41}},
					{meter_serial_number: {_eq: query?.queryKey[0]}},
				],
			},
		},
	})
}

export const fetchTotalUnitConsumedByMeter = async (query) => {
	const res = await http.get('items/meters', {
		params: {
			access_token,
			fields: 'latest_reading_kWh',
			filter: {meter_serial_number: {_eq: query}},
			'aggregate[sum]': 'latest_reading_kWh',
		},
	})
	return res.data.data[0].sum.latest_reading_kWh
}

export const lastUpdateTimeForMetersByMeter = async (query) => {
	const res = await http.get('items/meters', {
		params: {
			access_token,
			fields: 'latest_sync_date',
			filter: {meter_serial_number: {_eq: query}},
		},
	})
	return res?.data?.data[0]?.latest_sync_date
}

export const totalRevenueGeneratedByMeter = async (query) => {
	const res = await http.get('items/recharge_history_mdms', {
		params: {
			access_token,
			'aggregate[sum]': 'recharge_amount',
			filter: {
				_and: [
					{read_write_param_id: {_eq: 41}},
					{meter_serial_number: {_eq: query}},
				],
			},
		},
	})
	return res?.data?.data[0]?.sum?.recharge_amount
}

export const latestSyncDateRevenueByMeter = async (query) => {
	const res = await http.get('items/recharge_history_mdms', {
		params: {
			access_token,
			sort: '-date_time',
			fields: 'date_time',
			filter: {meter_serial_number: {_eq: query}},
		},
	})
	return res?.data?.data[0]?.date_time
}

export const fetchPowerConsumptionHistoryGraph = async ({
	month,
	year,
	meter_id,
}: {
	month: number
	year: number
	meter_id: any
}) => {
	const startDate = format(new Date(year, month - 1, 2), 'yyyy-MM-dd')
	const endDate = format(
		new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1))),
		'yyyy-MM-dd'
	)
	console.log(startDate, endDate)
	const res = await http.get('items/meter_daily_load_data', {
		params: {
			access_token,
			limit:-1,
			filter: {
				_and: [
					{date: {_between: [startDate, endDate]}},
					{utility_id: {_eq: utilityId}},
					{meter_serial_number: {_eq: meter_id}},
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			'groupBy[]': 'date',
			// filter: {meter_serial_number: {_eq: meterId}},
		},
	})
	console.log(res.data.data)
	return res.data.data
}

export const fetchPowerConsumptionHistoryGraphLastUpdated = async () => {
	const res = await http.get('items/meter_daily_load_data', {
		params: {
			access_token,
			sort: '-server_timestamp',
			fields: 'server_timestamp',
			limit: 1,
			filter: {utility_id: {_eq: utilityId}},
		},
	})
	return res?.data?.data[0]?.server_timestamp
}

export const fetchRechargeHistoryGraphLastUpdated = async (query) => {
	const res = await http.get('items/recharge_history_mdms', {
		params: {
			access_token,
			sort: '-date_time',
			fields: 'date_time',
			limit: 1,
			filter: {meter_serial_number: {_eq: query}},
		},
	})

	return res?.data?.data[0]?.date_time
}

export const unitConsumptionReport = async (query) => {
	const res = await http.get('items/consumer', {
		params: {
			access_token,
			fields:
				'meter_serial_number.meter_serial_number,usc_number,first_name,address,phone1,consumer_phase_id.phase_name,total_amount_paid,meter_serial_number.latest_reading_kWh,meter_serial_number.unit_rate, meter_serial_number.current_balance,meter_serial_number.current_balance_timestamp,last_recharge_amount,date_of_last_recharge,ero_id.ero_name,section_id.section_name, area_id.area_name',
			filter: {utility_id: {_eq: utilityId}},
		},
	})

	return res?.data
}
