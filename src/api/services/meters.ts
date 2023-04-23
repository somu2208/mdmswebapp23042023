import {format, formatISO, set, sub} from 'date-fns'
import http, {utilityId, access_token} from '../http'
import {v4 as uuidv4} from 'uuid'

type MeterProps = {
	limit?: number
	page?: number
	search?: {value: string; type: 'customer_id' | 'meter_id'}
}
export const getMeters = ({
	page,
	limit = 10,
	search = {
		type: 'customer_id',
		value: '',
	},
}: MeterProps) => {
	if (search.type === 'customer_id' && search.value) {
		return http.get('/items/meters', {
			params: {
				filter: {
					utility_id: {_eq: utilityId},
					usc_number: {_eq: search?.value},
				},
				access_token,
				fields: '*.*',
				meta: 'filter_count',
				limit,
				page,
			},
		})
	}
	if (search.type === 'meter_id' && search.value) {
		return http.get('/items/meters', {
			params: {
				filter: {
					utility_id: {_eq: utilityId},
					meter_serial_number: {_eq: search?.value},
				},
				access_token,
				fields: '*.*',
				meta: 'filter_count',
				limit,
				page,
			},
		})
	}

	return http.get('/items/meters', {
		params: {
			filter: {
				utility_id: {_eq: utilityId},
			},
			access_token,
			fields: '*.*',
			meta: 'filter_count',
			limit,
			page,
		},
	})
}

export const exportMeterData = () => {
	return http.get('/items/meters', {
		params: {
			filter: {
				utility_id: {_eq: utilityId},
			},
			access_token,
			fields: '*.*',
			meta: 'filter_count',
		},
	})
}

export const getMeterDetails = ({queryKey}) => {
	return http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{
						meter_serial_number: {_eq: queryKey[1]},
					},
				],
			},
			access_token,
			fields: '*.*',
		},
	})
}


// meters 360
export const fetchNamePlateDetails = ({meterId}: {meterId: string}) => {
	return http.get('/items/meter_name_plate', {
		params: {
			filter: {
				meter_serial_number: {_eq: meterId},
			},

			access_token,
		},
	})
}

export const fetchMeter360Data = async ({
	key,
	fromDate,
	toDate,
	meterId,
	page,
}: {
	key: string
	fromDate: string
	toDate: string
	meterId: string
	page: number
}) => {
	const fromDateTime = format(
		set(new Date(fromDate), {
			hours: 0,
			minutes: 0,
			seconds: 0,
		}),
		'yyyy-MM-dd HH:mm:ss'
	)
	const toDateTime = format(
		set(new Date(toDate), {
			hours: 23,
			minutes: 59,
			seconds: 59,
		}),
		'yyyy-MM-dd HH:mm:ss'
	)

	// const meter_serial_number =
	// 	key === 'meter_instantaneous_profile_three_phase_synctime'
	// 		? 'meterId'
	// 		: 'meterId'

	const res = await http.get(`/items/${key}`, {
		params: {
			filter: {
				_and: [
					{
						[key === 'meter_billing_profile_single_phase_new'
							? 'source_time_stamp'
							: 'source_timestamp']: {_between: [fromDateTime, toDateTime]},
					},
					{meter_serial_number: {_eq: meterId}},
				],
			},
			sort:
				key === 'meter_billing_profile_single_phase_new'
					? '-source_time_stamp'
					: '-source_timestamp',
			meta: 'filter_count',
			access_token,
			fields: '*',
			page: page,
		},
	})
	return res.data
}

export const exportMeter360Data = async ({
	key,
	fromDate,
	toDate,
	meterId,
}: {
	key: string
	fromDate: string
	toDate: string
	meterId: string
}) => {
	const fromDateTime = format(
		set(new Date(fromDate), {
			hours: 0,
			minutes: 0,
			seconds: 0,
		}),
		'yyyy-MM-dd HH:mm:ss'
	)
	const toDateTime = format(
		set(new Date(toDate), {
			hours: 23,
			minutes: 59,
			seconds: 59,
		}),
		'yyyy-MM-dd HH:mm:ss'
	)

	const res = await http.get(`/items/${key}`, {
		params: {
			filter: {
				_and: [
					{
						[key === 'meter_billing_profile_single_phase_new'
							? 'source_time_stamp'
							: 'source_timestamp']: {_between: [fromDateTime, toDateTime]},
					},
					{meter_serial_number: {_eq: meterId}},
				],
			},
			sort:
				key === 'meter_billing_profile_single_phase_new'
					? '-source_time_stamp'
					: '-source_timestamp',
			meta: 'filter_count',
			access_token,
			fields: '*',
		},
	})
	console.log("exportMeter360Data :- ", res.data);
	return res.data
}

export const fetchMeter360DataLoad = async ({
	key,
	date,
	meterId,
	page,
}: {
	key: string
	date: Date
	meterId: string
	page: number
}) => {
	const fromDateTime = format(
		set(new Date(date), {
			hours: 0,
			minutes: 0,
			seconds: 0,
		}),
		'yyyy-MM-dd HH:mm:ss'
	)
	const toDateTime = format(
		set(new Date(date), {
			hours: 23,
			minutes: 59,
			seconds: 59,
		}),
		'yyyy-MM-dd HH:mm:ss'
	)

	const utilityIdKey =
		key === 'meter_instantaneous_profile_three_phase_synctime'
			? 'utilityid'
			: 'utility_id'

	const res = await http.get(`/items/${key}`, {
		params: {
			filter: {
				_and: [
					{
						server_timestamp: {
							_between: [fromDateTime, toDateTime],
						},
					},
					{[utilityIdKey]: {_eq: utilityId}},
				],
			},
			meta: 'filter_count',
			access_token,
			fields: '*',
			// limit: 10,
			page: page,
		},
	})
	// console.log(res.data);
	return res.data
}

export const postMeterOperations = async ({
	readWritePatternId,
	csn,
	meterId,
}) => {
	const userEmail = JSON.parse(localStorage.getItem('userDetails'))[0]?.email

	const res = await http.post(
		`/items/recharge_history_mdms`,
		{
			recharge_id: uuidv4().slice(0, 16),
			read_write_param_id: readWritePatternId,
			customer_service_number: csn,
			account_number: csn,
			date_time: formatISO(
				sub(new Date(), {
					hours: 5,
					minutes: 30,
				})
			).slice(0, -6),
			created_by: userEmail,
			status: 'Open',
			meter_serial_number: meterId,
			utility_id: utilityId,
		},
		{
			params: {
				access_token,
			},
		}
	)
	// console.log("ajksdjasd ----------------------------------> ",res.data)
	return res.data
}
