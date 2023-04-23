import http from 'api/http'
import {format} from 'date-fns'
import {access_token} from '../http'

export const fetchLatestTimeTampers = async ({
	meterId,
	eventTypeId,
}: {
	meterId: string
	eventTypeId: string
}) => {
	const res = await http.get(`/items/all_events_and_data`, {
		params: {
			access_token,
			filter: {
				_and: [
					{meter_serial_number: {_eq: meterId}},
					{event_type_id: {_eq: eventTypeId}},
				],
			},
			sort: '-server_date_time',
			fields: 'server_date_time',
			limit: 1,
		},
	})

	return res.data.data?.length
		? format(
				new Date(res?.data?.data[0]?.server_date_time),
				'dd/MM/yyyy HH:mm:ss'
		  )
		: '-'
}

export const fetchEventTypesForTampers = async () => {
	const res = await http.get(`/items/event_type`, {
		params: {access_token},
	})

	return res.data.data
}

export const fetchCumulativeTampers = async ({meterId}: {meterId: string}) => {
	const eventTypes = await fetchEventTypesForTampers()

	const res = await http.get(`/items/all_events_and_data`, {
		params: {
			access_token,
			filter: {
				_and: [
					{occurence_or_restore_or_na: {_neq: null}},
					{meter_serial_number: {_eq: meterId}},
				],
			},
			'aggregate[count]': 'occurence_or_restore_or_na',
			'groupBy[]': 'occurence_or_restore_or_na,event_type_name,event_type_id',
		},
	})
	const time = await http.get(`/items/all_events_and_data`, {
		params: {
			access_token,
			filter: {
				meter_serial_number: {_eq: meterId},
			},
			sort: '-server_date_time',
			fields: 'server_date_time',
			limit: 1,
		},
	})

	const occurence = eventTypes?.map((event) => ({
		name: event.name,
		count: res.data.data
			.filter(
				(item) =>
					item.event_type_id === event.event_type_id &&
					item.occurence_or_restore_or_na === 'Occurrence'
			)
			.map((item) => item.count)
			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
	}))
	const restore = eventTypes?.map((event) => ({
		name: event.name,
		count: res.data.data
			.filter(
				(item) =>
					item.event_type_id === event.event_type_id &&
					item.occurence_or_restore_or_na === 'Restore'
			)
			.map((item) => item.count)
			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
	}))

	return {
		series1: occurence,
		xaxis: eventTypes?.map((event) => event.name),
		series2: restore,
		latestUpdateTime: format(
			new Date(time.data.data[0].server_date_time),
			'dd/MM/yyyy HH:mm:ss'
		),
	}
}

const fetchEventTypes = async (typeCode: string) => {
	const res = await http.get(`/items/event`, {
		params: {
			access_token,
			filter: {event_type_id: {_eq: typeCode}},
		},
	})

	return res.data.data
}

export const fetchEventTamperData = async (
	meterId: string,
	typeCode: string
) => {
	const eventTypes = await fetchEventTypes(typeCode)
	const res = await http.get(`/items/all_events_and_data`, {
		params: {
			access_token,
			filter: {
				_and: [
					{occurence_or_restore_or_na: {_neq: null}},
					{meter_serial_number: {_eq: meterId}},
					{event_type_id: {_eq: typeCode}},
				],
			},
			sort: 'event_code',
			'aggregate[count]': 'occurence_or_restore_or_na',
			'groupBy[]': 'occurence_or_restore_or_na,event_code,event_code_name',
		},
	})
	const time = await fetchLatestTimeTampers({eventTypeId: typeCode, meterId})

	const yaxis = eventTypes?.map((event) => ({
		name: event.name,
		count: res.data.data
			.filter((item) => item.event_code === event.event_code)
			.map((item) => item.count)
			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
	}))

	return {
		xaxis: eventTypes.map((item) => item.description),
		yaxis,
		time,
	}
}

// export const fetchVoltageEventTypes = async () => {
// 	const res = await http.get(`/items/event`, {
// 		params: {
// 			access_token,
// 			filter: {event_type_id: {_eq: '2'}},
// 		},
// 	})
// 	return res.data.data
// }

// export const fetchVoltageEventTamperData = async (meterId: string) => {
// 	const eventTypes = await fetchVoltageEventTypes()
// 	const res = await http.get(`/items/all_events_and_data`, {
// 		params: {
// 			access_token,
// 			filter: {
// 				_and: [
// 					{occurence_or_restore_or_na: {_neq: null}},
// 					{meter_serial_number: {_eq: '3000579'}},
// 					{event_type_id: {_eq: '2'}},
// 				],
// 			},
// 			'aggregate[count]': 'occurence_or_restore_or_na',
// 			'groupBy[]': 'occurence_or_restore_or_na,event_code,event_code_name',
// 		},
// 	})

// 	const occurence = eventTypes?.map((event) => ({
// 		name: event.name,
// 		count: res.data.data
// 			.filter(
// 				(item) =>
// 					item.event_code === event.event_code &&
// 					item.occurence_or_restore_or_na === 'Occurrence'
// 			)
// 			.map((item) => item.count)
// 			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
// 	}))

// 	const restore = eventTypes?.map((event) => ({
// 		name: event.name,
// 		count: res.data.data
// 			.filter(
// 				(item) =>
// 					item.event_code === event.event_code &&
// 					item.occurence_or_restore_or_na === 'Restore'
// 			)
// 			.map((item) => item.count)
// 			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
// 	}))

// 	return {
// 		xaxis: eventTypes.map((item) => item.description),
// 		series1: occurence,
// 		series2: restore,
// 	}
// }

// export const fetchCurrentEventTypes = async () => {
// 	const res = await http.get(`/items/event`, {
// 		params: {
// 			access_token,
// 			filter: {event_type_id: {_eq: '3'}},
// 		},
// 	})
// 	return res.data.data
// }

// export const fetchCurrentEventTamperData = async (meterId: string) => {
// 	const eventTypes = await fetchCurrentEventTypes()
// 	const res = await http.get(`/items/all_events_and_data`, {
// 		params: {
// 			access_token,
// 			filter: {
// 				_and: [
// 					{occurence_or_restore_or_na: {_neq: null}},
// 					{meter_serial_number: {_eq: '3000579'}},
// 					{event_type_id: {_eq: '3'}},
// 				],
// 			},
// 			'aggregate[count]': 'occurence_or_restore_or_na',
// 			'groupBy[]': 'occurence_or_restore_or_na,event_code,event_code_name',
// 		},
// 	})

// 	const occurence = eventTypes?.map((event) => ({
// 		name: event.name,
// 		count: res.data.data
// 			.filter(
// 				(item) =>
// 					item.event_code === event.event_code &&
// 					item.occurence_or_restore_or_na === 'Occurrence'
// 			)
// 			.map((item) => item.count)
// 			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
// 	}))

// 	const restore = eventTypes?.map((event) => ({
// 		name: event.name,
// 		count: res.data.data
// 			.filter(
// 				(item) =>
// 					item.event_code === event.event_code &&
// 					item.occurence_or_restore_or_na === 'Restore'
// 			)
// 			.map((item) => item.count)
// 			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
// 	}))

// 	return {
// 		xaxis: eventTypes.map((item) => item.description),
// 		series1: occurence,
// 		series2: restore,
// 	}
// }

// export const fetchOtherEventTypes = async () => {
// 	const res = await http.get(`/items/event`, {
// 		params: {
// 			access_token,
// 			filter: {event_type_id: {_eq: '3'}},
// 		},
// 	})
// 	return res.data.data
// }

// export const fetchOtherEventTamperData = async (meterId: string) => {
// 	const eventTypes = await fetchCurrentEventTypes()
// 	const res = await http.get(`/items/all_events_and_data`, {
// 		params: {
// 			access_token,
// 			filter: {
// 				_and: [
// 					{occurence_or_restore_or_na: {_neq: null}},
// 					{meter_serial_number: {_eq: '3000579'}},
// 					{event_type_id: {_eq: '3'}},
// 				],
// 			},
// 			'aggregate[count]': 'occurence_or_restore_or_na',
// 			'groupBy[]': 'occurence_or_restore_or_na,event_code,event_code_name',
// 		},
// 	})

// 	const occurence = eventTypes?.map((event) => ({
// 		name: event.name,
// 		count: res.data.data
// 			.filter(
// 				(item) =>
// 					item.event_code === event.event_code &&
// 					item.occurence_or_restore_or_na === 'Occurrence'
// 			)
// 			.map((item) => item.count)
// 			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
// 	}))

// 	const restore = eventTypes?.map((event) => ({
// 		name: event.name,
// 		count: res.data.data
// 			.filter(
// 				(item) =>
// 					item.event_code === event.event_code &&
// 					item.occurence_or_restore_or_na === 'Restore'
// 			)
// 			.map((item) => item.count)
// 			.reduce((acc, item) => acc + item.occurence_or_restore_or_na, 0),
// 	}))

// 	return {
// 		xaxis: eventTypes.map((item) => item.description),
// 		series1: occurence,
// 		series2: restore,
// 	}
// }
