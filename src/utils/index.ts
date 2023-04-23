import {format} from 'date-fns'
import add from 'date-fns/add'

const morphWithSubArrays = (arr: any[], size: number) => {
	const chunkedArray = []
	for (let i = 0; i < arr.length; i++) {
		const last = chunkedArray[chunkedArray.length - 1]
		if (!last || last.length === size) {
			chunkedArray.push([arr[i]])
		} else {
			last.push(arr[i])
		}
	}
	return chunkedArray
}
export {morphWithSubArrays}

export const getListOfLast10Years = () => {
	const years = []
	for (let i = 0; i < 10; i++) {
		years.push(new Date().getFullYear() - i)
	}
	return years
}

//get days of a month as an array
export const getDaysOfMonth = (month) => {
	const days = []
	const year = new Date().getFullYear()
	const date = new Date(year, month - 1, 1)
	const lastDay = new Date(year, month, 0).getDate()
	for (let i = 1; i <= lastDay; i++) {
		days.push(i)
	}
	return days
}

export const getListOfMonths = (year) => {
	const months = []
	const thisYear = new Date().getFullYear() === year
	const monthsTillToday = thisYear ? new Date().getMonth() + 1 : 12
	for (let i = 1; i <= monthsTillToday; i++) {
		months.push({
			value: i,
			name: format(new Date(0, i, 0), 'MMMM'),
		})
	}
	return months
}
// With the chart width (w), a series of data (n), and the desired column width in px (x),
export const getPercentWidth = (w, n, x) => {
	const percentWidth = Math.round((x / (w / n)) * 100)
	return `${percentWidth}%`
}

export const addOneDay = (date) => {
	return format(
		add(new Date(date), {
			days: 1,
		}),
		'yyyy-MM-dd'
	)
}

//get number of days in a month by date
export const getDaysInMonth = () => {
	const date = new Date()
	return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

//get last 30 days

//add 5hr30min to date and format
export const add5Hr30Min = (date) => {
	return format(
		add(new Date(date), {
			hours: 5,
			minutes: 30,
		}),
		'dd-MM-yyyy hh:mm:a'
	)
}

export const getCSVHeaderLabels = (labelsString) => {
	return labelsString
		.split('\n')
		.filter((item) => !!item)
		.map((item) => item.split('-'))
		.map((item) => ({
			label: item[1],
			key: item[0],
		}))
}

export const showLakThousand = (value) => {
	var val: any = Math.abs(value)
	if (val >= 100000) {
		val = (val / 100000).toFixed(2) + ' Lakhs'
	} else if (val >= 10000) {
		val = (val / 1000).toFixed(2) + ' Thousands'
	}
	return val
}

export const captureTimeFormat = (value) => {
	const date = value?.toString()
	const year = date.slice(0, 4)
	const month = date.slice(4, 6)
	const day = date.slice(6, 8)
	const hour = date.slice(8, 10)

	var dayPeriodEnumValue =
		hour / 12 >= 1
			? `${hour % 12}:${date.slice(10, 12)} PM`
			: `${hour}:${date.slice(10, 12)} AM`

	// console.log('month', month)
	return `${day}-${month}-${year} ${dayPeriodEnumValue}`
}

// DD-MM-YYYY HH:MM:SS
// get array of dates between two dates
export const getDatesBetween = (startDate, endDate) => {
	const dates = []
	let currentDate = startDate
	while (currentDate <= endDate) {
		dates.push(new Date(currentDate))
		currentDate = add(currentDate, {days: 1})
	}
	return dates
}
