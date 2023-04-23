//import http from 'api/http'
const http=require('api/http')
import _ from 'lodash'
import {format, formatISO, getDaysInMonth} from 'date-fns'
import {addOneDay, getDaysOfMonth} from 'utils'
import {access_token} from '../../http'

export const fetchMeterDataOfDay = async () => {
	const [active, inactive, disc] = await Promise.all([
		fetchActiveMeterOfADay(),
		fetchInActiveMeterOfADay(),
		fetchDisconnectedMeterOfADay(),
	])
	return {
		active: active[0].count.meter_serial_number,
		inactive: inactive[0].count.meter_serial_number,
		disc: disc[0].count.meter_serial_number,
	}
}

export const fetchMeterDataOfMonth = async ({month}: {month: number}) => {
	const [active, installed, disc] = await Promise.all([
		fetchActiveMetersOfAMonth(month),
		fetchInstalledMetersOfAMonth(month),
		fetchDisconnectedMetersOfAMonth(month),
	])

	const activeData = getDaysOfMonth(month).map((item) => ({
		x: item,
		y:
			active.data.data.find((dataItem) => dataItem.date_day === item)
				?.countDistinct?.meter_serial_number || 0,
	}))

	const installedData = getDaysOfMonth(month).map((item) => ({
		x: item,
		y:
			installed.data.data.find(
				(dataItem) => dataItem.installation_date_day === item
			)?.count?.meter_serial_number || 0,
	}))

	const inactive = getDaysOfMonth(month).map((item) => ({
		x: item,
		y:
			installed.data.data.find(
				(dataItem) => dataItem.installation_date_day === item
			)?.count?.meter_serial_number -
				(active.data.data.find((dataItem) => dataItem.date_day === item)
					?.countDistinct?.meter_serial_number +
					disc.data.data.find(
						(dataItem) => dataItem.installation_date_day === item
					)?.count?.meter_serial_number) || 0,
	}))
	const discData = getDaysOfMonth(month).map((item) => ({
		x: item,
		y:
			disc.data.data.find((dataItem) => dataItem.installation_date_day === item)
				?.count?.meter_serial_number || 0,
	}))

	return {
		active: activeData,
		inactive,
		disc: discData,
		total: installedData,
	}
}

//
export const fetchMeterDataOfAYear = async ({year}: {year: number}) => {
	const [active, installed, disc] = await Promise.all([
		fetchActiveMetersOfYear(year),
		fetchInstalledMetersOfYear(year),
		fetchDisconnectedMetersOfYear(year),
	])
	const monthsOfYear = new Array(12).fill(0).map((_, index) => index + 1)

	const activeData = monthsOfYear

	return {
		active: active.data.data,
		installed: installed.data.data,
		disc: disc.data.data,
	}
}

export const fetchActiveMeterOfADay = async () => {
	let res = await http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{meter_status: {_eq: 'Active'}, latest_sync_date: {_gt: '$NOW(-1)'}},
				],
			},
			access_token,
			'aggregate[count]': 'meter_serial_number',
		},
	})
	return res.data.data
}

export const fetchInActiveMeterOfADay = async () => {
	const res = await http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{meter_status: {_eq: 'Active'}},
					{latest_sync_date: {_lt: '$NOW(-1)'}},
				],
			},
			access_token,
			'aggregate[count]': 'meter_serial_number',
		},
	})
	return res.data.data
}

export const fetchDisconnectedMeterOfADay = async () => {
	const res = await http.get('/items/meters', {
		params: {
			filter: {
				_and: [{decommissioning_date: {_gt: '$NOW(-1)'}}],
			},
			access_token,
			'aggregate[count]': 'meter_serial_number',
		},
	})
	return res.data.data
}

//monthly active meter count
export const fetchActiveMetersOfAMonth = async (month: number) => {
	const year = new Date().getFullYear()
	const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd')
	const endDate = format(
		new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1))),
		'yyyy-MM-dd'
	)

	return http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [
					{meter_status: {_eq: 'Active'}},
					{date: {_between: [startDate, endDate]}},
				],
			},
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
			'groupBy[]': 'day(date)',
		},
	})
}


export const fetchInstalledMetersOfAMonth = async (month: number) => {
	const year = new Date().getFullYear()
	const startDate = formatISO(new Date(year, month - 1, 1, 0, 0, 0)).slice(
		0,
		-6
	)
	const endDate = formatISO(
		new Date(
			year,
			month - 1,
			getDaysInMonth(new Date(year, month - 1)),
			11,
			59,
			59
		)
	).slice(0, -6)
	return http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{meter_status: {_eq: 'Active'}},
					{installation_date: {_between: [startDate, endDate]}},
				],
			},
			'aggregate[count]': 'meter_serial_number',
			access_token,
			'groupBy[]': 'day(installation_date)',
		},
	})
}

export const fetchDisconnectedMetersOfAMonth = async (month: number) => {
	const year = new Date().getFullYear()
	const startDate = formatISO(new Date(year, month - 1, 1, 0, 0, 0)).slice(
		0,
		-6
	)

	const endDate = formatISO(
		new Date(
			year,
			month - 1,
			getDaysInMonth(new Date(year, month - 1)),
			11,
			59,
			59
		)
	).slice(0, -6)

	return http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{meter_status: {_eq: 'Active'}},
					{installation_date: {_between: [startDate, endDate]}},
				],
			},
			'aggregate[count]': 'meter_serial_number',
			access_token,
			'groupBy[]': 'day(installation_date)',
		},
	})
}

// yearly active meter count
export const fetchActiveMetersOfYear = async (year: string | number) => {
	const firstDayOfTheYear = formatISO(new Date(year as number, 0, 1, 0, 0, 0))
	const lastDayOfTheYear = formatISO(
		new Date(year as number, 12, 31, 11, 59, 59)
	)

	return http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [{date: {_between: [firstDayOfTheYear, lastDayOfTheYear]}}],
			},
			access_token,
			'groupBy[]': 'month(date)',
			'aggregate[countDistinct]': 'meter_serial_number',
		},
	})
}

export const fetchInstalledMetersOfYear = async (year: string | number) => {
	const firstDayOfTheYear = formatISO(new Date(year as number, 0, 1, 0, 0, 0))
	const lastDayOfTheYear = formatISO(
		new Date(year as number, 12, 31, 11, 59, 59)
	)

	return http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [{date: {_between: [firstDayOfTheYear, lastDayOfTheYear]}}],
			},
			access_token,
			'groupBy[]': 'month(date)',
			'aggregate[countDistinct]': 'meter_serial_number',
		},
	})
}

export const fetchDisconnectedMetersOfYear = async (year: string | number) => {
	const firstDayOfTheYear = formatISO(new Date(year as number, 0, 1, 0, 0, 0))
	const lastDayOfTheYear = formatISO(
		new Date(year as number, 12, 31, 11, 59, 59)
	)

	return http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [
					{
						date: {
							_between: [firstDayOfTheYear, lastDayOfTheYear],
						},
					},
				],
			},
			access_token,
			'groupBy[]': 'month(date)',
			'aggregate[count]': 'meter_serial_number',
		},
	})
}
