import {
	add,
	compareAsc,
	format,
	formatISO,
	getDaysInMonth,
	parse,
	parseISO,
	set,
	sub,
} from 'date-fns'
import http from '../http'
import {
	fetchLatestDateTimeForDailyLoadSync,
	fetchLatestDateTimeForDataSync,
	fetchLatestDateTimeForDataSyncForMeters,
} from './time-labels'
import { access_token, utilityId } from '../http'
import { add5Hr30Min } from 'utils'
import _, { indexOf, split, values } from 'lodash'
import { exit } from 'process'
import CardItems from 'pages/Prepaid/details/components/CardItem'

// dashboard metrics

export const fetchTotalSurveyed = () => {
	return http.get('/items/surveys', {
		params: {
			filter: { status: { _eq: 'Approved' } },
			'aggregate[count]': 'survey_id',
			access_token,
		},
	})
}
export const fetchTotalDeployedMeters = () => {
	return http.get('/items/meters', {
		params: {
			'groupBy[]': 'meter_connection_type',
			'aggregate[count]': 'meter_serial_number',
			access_token,
			filter: { utility_id: { _eq: utilityId } },
		},
	})
}

export const fetchTotalInstalledMeters = () => {
	return http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{ meter_status: { _eq: 'Active' } },
					{ installation_date: { _neq: null } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'meter_connection_type',
			'aggregate[count]': 'meter_serial_number',
			access_token,
		},
	})
}

export const fetchTotalActiveMeters = () => {
	const date = new Date()
	const todayFrom = format(
		set(date, { hours: 0, minutes: 0, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)
	const todayTo = format(
		set(date, { hours: 23, minutes: 59, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)
	return http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{ latest_sync_date: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'meter_connection_type',
			'aggregate[count]': 'meter_serial_number',
			access_token,
		},
	})
}

export const fetchTotalMeterCount = () => {
	return http.get('/items/total_4g_meters', {
		params: {
			filter: {
				_and: [
					{ date_updated: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				]
			},
			'groupBy[]': 'phase_id_new',
			'aggregate[count]': 'meter_serial_number',
			access_token,
		},
	})
}

export const fetchPowerConsumptionMonthSingle = async () => {

	const date = new Date()
	const startDate = format(set(date, { date: 1 }), 'yyyy-MM-dd 00:00:00')
	const endDate = format(date, 'yyyy-MM-dd 23:59:00')

	const res = http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [startDate, endDate] } },
					{ utility_id: { _eq: utilityId } },
				]
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
		},
	})

	return res
}

export const fetchPowerConsumptionMonthThree = async () => {

	const date = new Date()
	const startDate = format(set(date, { date: 1 }), 'yyyy-MM-dd 00:00:00')
	const endDate = format(date, 'yyyy-MM-dd 23:59:00')

	const res = http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [startDate, endDate] } },
					{ utility_id: { _eq: utilityId } },
				]
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
		},
	})

	return res
}


export const fetchDisconnectedMeters = () => {
	return http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{ decommissioning_date: { _neq: null } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'meter_connection_type',
			'aggregate[count]': 'meter_serial_number',
			access_token,
		},
	})
}

export const fetchMtd = () => {
	const date = new Date()
	const startDate = format(set(date, { date: 1 }), 'yyyy-MM-dd')
	const endDate = format(date, 'yyyy-MM-dd')

	return http.get('/items/meter_daily_load_data', {
		params: {
			filter: {
				date: {
					_between: [startDate, endDate],
				},
				utility_id: { _eq: utilityId },
			},
			'groupBy[]': 'meter_connection_type_id',
			'aggregate[sum]': 'energy_wh_import',
			access_token,
		},
	})
}

export const fetchYtd = async () => {
	const year = new Date().getFullYear()
	const firstDayOfTheYear = format(new Date(year as number, 0, 1), 'yyyy-MM-dd')
	const lastDayOfTheYear = format(
		new Date(year as number, 11, 31),
		'yyyy-MM-dd'
	)

	return await http.get('/items/meter_daily_load_data', {
		params: {
			filter: {
				_and: [
					{ date: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			'groupBy[]': 'meter_connection_type_id',
			access_token,
		},
	})
}

//Bar graph data - Dashboard
export const fetchLast30DaysActiveMeters = () => {
	return http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [{ date: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			sort: 'date',
			'groupBy[]': 'meter_connection_type_id,date',
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
		},
	})
}

/* ------------------------------4:40 pm------------------- */
// Bar Chart Single Phase Data - Dashboard
export const fetchLast30DaysActiveMetersSingle = () => {
	const new_data = http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			sort: '-source_timestamp',
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
		},

		/* 	https://ibotapp.azure-api.net/mdmsquery/items/meter_dailyload_profile_single_phase?access_token=1234&filter={   "_and": [  {  "source_timestamp": {         "_gt":"$NOW(-30 days)"  }    }, {"utility_id":{"_eq":"3"}} ] }&aggregate[countDistinct]=meter_serial_number&groupBy[]=day(source_timestamp),month(source_timestamp),year(source_timestamp)&sort=day(source_timestamp)
	 */
	})
	// console.log("bar chart new data",new_data);
	return new_data;
}

// Bar Chart Three Phase Data - Dashboard
export const fetchLast30DaysActiveMetersThird = () => {
	return http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			sort: '-source_timestamp',
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
		},
	})



	/* https://ibotapp.azure-api.net/mdmsquery/items/meter_dailyload_profile_three_phase?access_token=1234&filter={   "_and": [  {  "source_timestamp": {         "_gt":"$NOW(-30 days)"  }    }, {"utility_id":{"_eq":"3"}} ] }&aggregate[countDistinct]=meter_serial_number&groupBy[]=day(source_timestamp),month(source_timestamp),year(source_timestamp)&sort=day(source_timestamp) */
}

export const fetchLast30DaysActiveMetersAll9May = async () => {

	/* -----------------------!P------------------------ */

	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			sort: '-source_timestamp',
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
		},
	})
	// console.log(']]]]]]]]]]]]]]]]]',res1p)

	/*--------------------------- 3p-------------------- */


	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			sort: '-source_timestamp',
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
		},
	})



	/* ----------------1p 3p calculation------------ */



	const values1p = res1p?.data?.data?.map((item) =>
		(`${item.countDistinct.meter_serial_number}`)
	)

	const values3p = res3p?.data?.data?.map((item) =>
		(`${item.countDistinct.meter_serial_number}`)
	)

	let i = 0;
	let values = [];
	let oneplen = res1p?.data?.data.length;
	let threeplen = res3p?.data?.data.length
	if (oneplen > threeplen) {
		while (i < res1p?.data?.data.length) {
			if (i > oneplen - 1) {
				values.push(0 + parseInt(values3p[i]));
			}
			else if (i > threeplen - 1) {
				values.push(0 + parseInt(values1p[i]));
			}
			else {
				values.push(parseInt(values3p[i]) + parseInt(values1p[i]));
			}
			i += 1;
		}
	}


	else {
		while (i < res3p?.data?.data.length) {

			if (i > oneplen - 1) {
				values.push(0 + parseInt(values3p[i]));
			}
			else if (i > threeplen - 1) {
				values.push(0 + parseInt(values1p[i]));
			}
			else {
				values.push(parseInt(values3p[i]) + parseInt(values1p[i]));
			}
			i += 1;
		}
	}

	const arr = [];
	const xaxis = res1p?.data?.data?.map((item) => {
		arr.push(`${item.source_timestamp_day}/${item.source_timestamp_month}/${item.source_timestamp_year}`);
		//`${item.source_timestamp_day}/${item.source_timestamp_month}/${item.source_timestamp_year}`

	})
	//   console.log("Array sdsmdnsadasdsdsa",xaxis)


	//console.log(arr,values);
	let response = {
		"category": arr,
		"series": values
	}
	// console.log("response",response);



	return response;


}
// Bar Chart All Phase Data - Dashboard
export const fetchLast30DaysActiveMetersAll = async () => {
	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			sort: '-source_timestamp',
			'groupBy[]': 'source_timestamp,day(source_timestamp),month(source_timestamp),year(source_timestamp),source_timestamp',
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
		},
	})

	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			sort: '-source_timestamp',
			'groupBy[]': 'source_timestamp,day(source_timestamp),month(source_timestamp),year(source_timestamp),source_timestamp',
			'aggregate[countDistinct]': 'meter_serial_number',
			access_token,
		},
	})


	// const resAll={res3p, res1p}	

	let pk = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = add5Hr30Min(res1p.data.data[i].source_timestamp);
		pk[key] = 0;
	}
	//  console.log(pk);

	let p1 = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = add5Hr30Min(res1p.data.data[i].source_timestamp);
		p1[key] = res1p.data.data[i].countDistinct.meter_serial_number;
	}
	// console.log(p1);

	let p3 = [];
	for (let i = 0; i < res3p.data.data.length; i++) {
		let key = add5Hr30Min(res3p.data.data[i].source_timestamp);
		p3[key] = res3p.data.data[i].countDistinct.meter_serial_number;
	}
	//  console.log(p3);

	let p3_data = { ...pk, ...p3 }
	//  console.log(p3_data);

	let category_label = Object.keys(pk);
	let data_p1 = Object.values(p1);
	let data_p3 = Object.values(p3_data);
	let opt_Data = { series: [{ "name": "Phase 1", "data": data_p1 }, { "name": "Phase 3", "data": data_p3 }] }

	//    console.log(category_label);
	//    console.log(opt_Data);

	let response = {
		"category": category_label,
		"series": opt_Data
	}

	return response;
}






/* ----------------------------Active Meter API Change------------------------------ */



// Bar Chart All Phase Data - HES Dashboard - Instantaneous
export const fetchLast30DaysActiveMetersAllPhase = async () => {
	const res3p = await http.get('/items/meter_instantaneous_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utilityid: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})

	const res1p = await http.get('/items/meter_instantaneous_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})


	const resAll = { res3p, res1p }
	// console.log("jfksdjfakljdfklsdjfldksfjlkdasfjas",resAll)

	// console.log("22222222222222222",res1p,res3p)
	let pk = [];
	for (let i = 0; i < res1p?.data?.data.length; i++) {
		let key = res1p?.data?.data[i]?.server_timestamp_hour;
		pk[key] = res1p.data.data[i].countDistinct.meter_serial_number
	}
	// console.log("111111111111111111111",pk);
	// console.log("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-",pk1);

	let p1 = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = res1p.data.data[i].source_date;
		p1[key] = res1p.data.data[i].countDistinct.meter_serial_number;
	}
	// console.log('000000000000000000000000000000000000',p1);

	let p3 = [];
	for (let i = 0; i < res3p.data.data.length; i++) {
		let key = res3p.data.data[i].source_date;
		p3[key] = res3p.data.data[i].countDistinct.meter_serial_number;
	}
	// console.log(p3);

	let p3_data = { ...pk, ...p3 }
	// console.log(p3_data);

	let category_label = Object.keys(pk);
	let data_p1 = Object.values(p1);
	let data_p3 = Object.values(p3_data);
	let opt_Data = { series: [{ "name": "Phase 1", "data": data_p1 }, { "name": "Phase 3", "data": data_p3 }] }

	//   console.log(category_label);
	//   console.log(opt_Data);

	let response = {
		"category": category_label,
		"series": opt_Data
	}

	let MinFilteri1p = res1p.data.data.filter((item) => {
		if (item.server_timestamp_minute == 15 || item.server_timestamp_minute == 0 ||
			item.server_timestamp_minute == 30 || item.server_timestamp_minute == 45) {
			return item
		}
	})
	// console.log("/-/-/-/-/-/-/",MinFilteri1p)

	let MinFilteri3p = res3p.data.data.filter((item) => {
		if (item.server_timestamp_minute == 15 || item.server_timestamp_minute == 0 ||
			item.server_timestamp_minute == 30 || item.server_timestamp_minute == 45) {

			//console.log(item);
			return item
		}
	})

	let hrs = 23;
	let newSum1p = 0;
	let newArr1p = [];
	for (let i = 0; i < MinFilteri1p.length; i++) {
		if (MinFilteri1p[i].server_timestamp_hour != hrs) {
			newArr1p.push(newSum1p);
			//	newArr3p.push(newSum3p); 
		}

		//	console.log("anshu 1p",MinFilteri1p[i].server_timestamp_hour);
		if (MinFilteri1p[i].server_timestamp_hour == hrs) {
			// console.log("if",hrs);
			newSum1p += MinFilteri1p[i].countDistinct.meter_serial_number;
			//	newSum3p+=MinFilteri3p[i].countDistinct.meter_serial_number;
			//	console.log(newSum1p);
			//	console.log(newSum3p);
		} else {
			newSum1p = 0;
			//	newSum3p=0;

			newSum1p += MinFilteri1p[i].countDistinct.meter_serial_number;
			//	newSum3p+=MinFilteri3p[i].countDistinct.meter_serial_number;
			//	console.log(newSum1p);
			//	console.log(newSum3p);
			hrs = hrs - 1;
			//	 console.log("else",hrs);
		}
	}

	let pk1 = [];
	for (let i = 0; i < res1p?.data?.data.length; i++) {
		let key = res1p?.data?.data[i]?.server_timestamp_hour;
		pk1[key] = 0;
		// pk[key] = newArr1p
	}
	// console.log("1-1-1-1-1-1-1-1-11--1-1-11-1-1-1-1-1-1-1",pk1);
	// console.log("1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-",pk1);


	let hrs1 = 23;
	let newSum3p = 0;
	let newArr3p = [];
	for (let i = 0; i < MinFilteri3p.length; i++) {
		// console.log("anshu 3p",MinFilteri3p[i].server_timestamp_hour);
		if (MinFilteri3p[i].server_timestamp_hour != hrs1) {
			//	 newArr1p.push(newSum1p); 
			newArr3p.push(newSum3p);
		}
		if (MinFilteri3p[i].server_timestamp_hour == hrs1) {
			//    console.log("if",hrs1);
			//	 newSum1p+=MinFilteri1p[i].countDistinct.meter_serial_number;
			newSum3p += MinFilteri3p[i].countDistinct.meter_serial_number;
			//	console.log(newSum1p);
			//	console.log(newSum3p);
		} else {
			//	 newSum1p=0;
			newSum3p = 0;

			//	 newSum1p+=MinFilteri1p[i].countDistinct.meter_serial_number;
			newSum3p += MinFilteri3p[i].countDistinct.meter_serial_number;
			//	console.log(newSum1p);
			//	console.log(newSum3p);
			hrs1 = hrs1 - 1;
			//  console.log("else",hrs1);
		}
	}

	//   console.log("darta 3p",newArr3p)

	// 	 console.log("data 1p",newArr1p)

	// 	console.log("ffffffffff",MinFilteri1p,MinFilteri3p)

	// let MinFilteri3time=res1p.data.data.filter((item)=>{
	// 	if(item.server_timestamp_minute ==15 || item.server_timestamp_minute ==0 || 
	// 		item.server_timestamp_minute ==30 || item.server_timestamp_minute ==45)
	// 		{
	// 			return (item.server_timestamp_minute)
	// 		}
	// })
	// console.log("MinFilteri3time",MinFilteri3time)


	// let p13=[];
	// let p11=[];
	// let time_hour1p = [];
	// let time_minute1p = [];
	// for(let i=0;i<res1p.data.data.length;i++){
	// 	let key= i;
	// 	time_hour1p[key] = res1p.data.data[i].server_timestamp_hour;

	// 	let key1 = i;
	// 	time_minute1p[key1] = res1p.data.data[i].server_timestamp_minute;

	// 	p13 = [...time_hour1p, ...time_minute1p]

	// 	p11[key]=res1p.data.data[i].countDistinct.meter_serial_number;
	// }
	// console.log("-------------------time_hour1p",time_hour1p)
	// console.log("-------------------time_minute1p",time_minute1p)
	// console.log("-------------------p13",p13)

	let concatData = MinFilteri1p.map((item, _index) => {

		let min = item.server_timestamp_minute;
		let hr = item.server_timestamp_hour;
		const result = MinFilteri3p.find((item2) =>
			item.server_timestamp_minute == item2.server_timestamp_minute && item.server_timestamp_hour == item2.server_timestamp_hour
		);

		// console.log("results  ",result)
		if (result) {
			// let serialNumber=item.countDistinct.meter_serial_number + result.countDistinct.meter_serial_number;
			let serialNumber = item.server_timestamp_hour;

			return serialNumber
			// return {
			// 	"server_timestamp_hour":item.server_timestamp_hour,
			// 	"server_timestamp_minute":item.server_timestamp_minute,
			// 	"countDistinct": {"meter_serial_number":serialNumber}
			// }
		} else {
			return item;
		}
	})
	// console.log("gggggggggggggggggg",concatData)





	let category_label1 = Object.keys(pk);
	let data_p11 = Object.values(newArr1p);
	let data_p31 = Object.values(newArr1p);
	let opt_Data1 = { series: [{ "name": "Phase 1", "data": data_p11 }, { "name": "Phase 3", "data": data_p31 }] }

	//   console.log("category_label1",category_label1);
	//   console.log("opt_Data",opt_Data1);

	let response1 = {
		"category": category_label1,
		"series": opt_Data1
	}
	// console.log("category ->",response1)

	// let concatData=MinFilteri1p.map((item,index)=>{

	// 	let min=item.server_timestamp_minute;
	// 	let hr=item.server_timestamp_hour;
	// 	const result = MinFilteri3p.find(( item2 ) => 
	// 		item.server_timestamp_minute == item2.server_timestamp_minute && item.server_timestamp_hour == item2.server_timestamp_hour
	// 	);

	// 	if(result){
	// 	let serialNumber=item.countDistinct.meter_serial_number + result.countDistinct.meter_serial_number;
	// 		return {
	// 			"server_timestamp_hour":item.server_timestamp_hour,
	// 			"server_timestamp_minute":item.server_timestamp_minute,
	// 			"countDistinct": {"meter_serial_number":serialNumber}
	// 		}
	// 	}else
	// 	{
	// 		return item;
	// 	}
	// })
	// console.log('0000000000000000000',concatData)

	return response;
}

//All Phase Daily Load Data - HES 
export const fetchTodaysDataSyncDailyLoad = async () => {
	const date = new Date()
	const now = format(date, 'yyyy-MM-dd HH:mm:ss')
	const minus24Hours = format(sub(date, { hours: 24 }), 'yyyy-MM-dd HH:mm:ss')


	console.log(minus24Hours);
	const res = await http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [
					{ date: { _between: [minus24Hours, now] } },
					{ function_id: { _in: '3' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]':
				'day(server_date_time),month(server_date_time),year(server_date_time),hour(server_date_time),minute(server_date_time),source_date_time',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(source_date_time)',
			limit: -1,
			access_token,
		},
	})

	const grouped = res?.data?.data?.map((item) => ({
		timeStamp: format(
			new Date(
				item?.server_date_time_year,
				item?.server_date_time_month - 1,
				item?.server_date_time_day,
				item?.server_date_time_hour,
				item?.server_date_time_minute
			),
			'yyyy-MM-dd HH:mm:ss'
		),
		value: item?.countDistinct.meter_serial_number,
	}))

	const sum = grouped?.reduce((acc, item) => {
		return acc + item.value
	}, 0)

	return {
		value: sum,
		timeStamp: grouped[0].timeStamp,
	}
}


// All phase HES Daily Load Chart Data
export const fetchTodaysDataSyncDailyLoadAll = async () => {

	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {

			filter: {
				_and: [
					{ source_timestamp: { _gt: "$NOW(-24 hours)" } },
					{ utility_id: { _eq: utilityId } }
				]
			},

			'groupBy[]':
				'hour(source_timestamp),minute(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',

			sort: '-hour(source_timestamp)',
			limit: -1,
			access_token,
		},
	})

	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: "$NOW(-24 hours)" } },
					{ utility_id: { _eq: utilityId } }
				]
			},

			'groupBy[]':
				'hour(source_timestamp),minute(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',

			sort: '-hour(source_timestamp)',
			limit: -1,
			access_token,
		},
	})
	// console.log("daily load data res1p : -", res1p.data.data);
	
	let res = (res3p.data.data + res1p.data.data);

	// let result = (res3p.data.data)
	let result = (res1p.data.data)
	let allSum = 0;
	let _newArr = [];
	console.log("result -> ",result)
	console.log("1p -> ",res1p.data.data)

	result.map(function (key: { source_timestamp_hour: any; source_timestamp_minute: any; countDistinct: { meter_serial_number: number } }, value: string | number) {
		if (res3p.data.data.length > 0) {
			allSum = res3p.data.data[value].countDistinct.meter_serial_number
		} else {
			allSum = 0
		}
		_newArr.push({
			"source_timestamp_hour": key.source_timestamp_hour,
			"source_timestamp_minute": key.source_timestamp_minute,
			"countDistinct": {
				"meter_serial_number": key.countDistinct.meter_serial_number + allSum
			}
		});
	})

	// console.log("Array : ",_newArr)
	// const res11p = _newArr.reduce((acc, item) => {
	// 	return acc + item.countDistinct.meter_serial_number
	// }, 0)
	// console.log("res11p", res11p)
	// const res33p = res3p.data?.data?.reduce((acc, item) => {
	// 	return acc + item.countDistinct.meter_serial_number
	// }, 0)
	// const res = (res11p + res33p)
	// console.log("res11p", res)
	// return res;


	// const grouped = res?.data?.data?.map((item) => ({
	const grouped = _newArr?.map((item) => ({
		source_timestamp: format(
			new Date(
				item?.source_timestamp_hour,
				item?.source_timestamp_minute
			),
			'HH:mm:ss a'
		),
		value: item?.countDistinct.meter_serial_number,
	}))
	const sum = grouped?.reduce((acc, item) => {
		return acc + item.value
	}, 0)

	console.log("grouped Daily Load Single Phase Data Sum: ",sum)
	console.log("grouped :- ", grouped[0].source_timestamp);

	return {
		value: sum,
		source_timestamp: grouped[0],
	}
}


// Single phase HES Daily Load Chart Data
export const fetchTodaysDataSyncDailyLoadSingle = async () => {

	const res = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: "$NOW(-24 hours)" } },
					{ utility_id: { _eq: utilityId } }
				]
			},

			'groupBy[]':
				'hour(source_timestamp),minute(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',

			sort: '-hour(source_timestamp)',
			limit: -1,
			access_token,
		},
	})



	const grouped = res?.data?.data?.map((item) => ({
		source_timestamp: format(
			new Date(
				// item?.server_date_time_year,
				// item?.server_date_time_month - 1,
				// item?.server_date_time_day,
				item?.source_timestamp_hour,
				item?.source_timestamp_minute
			),
			'HH:mm:ss a'
		),
		value: item?.countDistinct.meter_serial_number,
	}))

	//console.log("grouped Daily Load Single Phase Data: ",grouped)

	const sum = grouped?.reduce((acc, item) => {
		return acc + item.value
	}, 0)
	// console.log("grouped Daily Load Single Phase Data Sum: ",sum)

	return {
		value: sum,
		source_timestamp: grouped[0].source_timestamp,
	}
}


// Three phase HES Daily Load Chart Data
export const fetchTodaysDataSyncDailyLoadThree = async () => {
	const res = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {

			filter: {
				_and: [
					{ source_timestamp: { _gt: "$NOW(-24 hours)" } },
					{ utility_id: { _eq: utilityId } }
				]
			},

			'groupBy[]':
				'hour(source_timestamp),minute(source_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',

			sort: '-hour(source_timestamp)',
			limit: -1,
			access_token,
		},
	})

	const grouped = res?.data?.data?.map((item) => ({
		source_timestamp: format(
			new Date(
				// item?.server_date_time_year,
				// item?.server_date_time_month - 1,
				// item?.server_date_time_day,
				item?.source_timestamp_hour,
				item?.source_timestamp_minute
			),
			'HH:mm:ss a'
		),
		value: item?.countDistinct.meter_serial_number,
	}))

	// console.log("grouped Daily Load Three Phase Data: ",grouped)

	const sum = grouped?.reduce((acc, item) => {
		return acc + item.value
	}, 0)
	// console.log("grouped Daily Load Three Phase Data Sum: ",sum)

	return {
		value: sum,
		source_timestamp: grouped[0].source_timestamp,
	}
}


// All Block Load Chart(Not in Working)
export const fetchTodaysDataSyncBlockLoad = async () => {
	const date = new Date()
	const now = format(date, 'yyyy-MM-dd HH:mm:ss').replace(' ', 'T')
	const minus24Hours = format(
		sub(date, { hours: 24 }),
		'yyyy-MM-dd HH:mm:ss'
	).replace(' ', 'T')

	const res = await http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [
					{ date: { _between: [minus24Hours, now] } },
					{ function_id: { _in: '2' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]':
				'hour(server_date_time),minute(server_date_time),day(server_date_time),month(server_date_time),year(server_date_time),source_date_time',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(source_date_time)',
			limit: -1,
			access_token,
		},
	})

	const grouped = _.groupBy(
		res?.data?.data
			?.filter(
				(item) =>
					item.server_date_time_minute === 0 ||
					item.server_date_time_minute === 30
			)
			?.map((item) => ({
				timeStamp: format(
					new Date(
						item?.server_date_time_year,
						item?.server_date_time_month - 1,
						item?.server_date_time_day,
						item?.server_date_time_hour,
						item?.server_date_time_minute
					),
					'dd-MM hh:mm:a'
				),
				value: item?.countDistinct.meter_serial_number,
			})),
		'timeStamp'
	)
	const chartData = Object.entries(grouped).map(([key, value]: [any, any]) => ({
		timeStamp: key,
		value: value.reduce((acc, curr) => acc + curr.value, 0),
	}))

	return chartData
}

/* --------------------------Pranjali--------------------------------- */
// All Phase HES Block Load Chart - HES
export const fetchTodaysDataSyncBlockLoadAll = async () => {
	const res3p = await http.get('/items/meter_block_load_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})
	// console.log(res3p);
	if(res3p.data.length){
		const res1p = await http.get('/items/meter_block_load_profile_single_phase', {
			params: {
				filter: {
					_and: [
						{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
						{ utility_id: { _eq: utilityId } },
					],
				},
				'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
				'aggregate[countDistinct]': 'meter_serial_number',
				sort: '-hour(server_timestamp)',
				limit: -1,
				access_token,
			},
		})
		let result = (res1p.data.data);
		let allSum = 0;
		let _newArr = [];
		let MinFilteri1p = res1p.data.data.filter((item: { server_timestamp_minute: number }) => {
			if (item.server_timestamp_minute == 15 || item.server_timestamp_minute == 0 ||
				item.server_timestamp_minute == 30 || item.server_timestamp_minute == 45) {
				return item
			}
		})
		let MinFilteri3p = res3p.data.data.filter((item: { server_timestamp_minute: number }) => {
			if (item.server_timestamp_minute == 15 || item.server_timestamp_minute == 0 ||
				item.server_timestamp_minute == 30 || item.server_timestamp_minute == 45) {
				return item
			}
		})
		let concatData = MinFilteri1p.map((item: { server_timestamp_minute: any; server_timestamp_hour: any; countDistinct: { meter_serial_number: any } }, _index: any) => {
			let min = item.server_timestamp_minute;
			let hr = item.server_timestamp_hour;
			const result = MinFilteri3p.find((item2: { server_timestamp_minute: any; server_timestamp_hour: any }) =>
				item.server_timestamp_minute == item2.server_timestamp_minute && item.server_timestamp_hour === item2.server_timestamp_hour
			);
	
			if (result) {
				let serialNumber = item.countDistinct.meter_serial_number + result.countDistinct.meter_serial_number;
				return {
					"server_timestamp_hour": item.server_timestamp_hour,
					"server_timestamp_minute": item.server_timestamp_minute,
					"countDistinct": { "meter_serial_number": serialNumber }
				}
			} else {
				return item;
			}
		})
		const data = concatData.map((item: { countDistinct: { meter_serial_number: any } }) => item?.countDistinct.meter_serial_number)
		const xAxis = new Array(24)
			.fill(0)
			.map((_, i) => i)
			.map((item) => {
				const date = format(
					sub(new Date(), { hours: item }) as any,
					'dd-MM hh:mm:a'
				)
				return date
			})
			return {
				x: xAxis,
				y: data,
			}
	}else{
		const res = await http.get('/items/meter_block_load_profile_single_phase', {
			params: {
				filter: {
					_and: [
						{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
						{ utility_id: { _eq: utilityId } },
					],
				},
				'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
				'aggregate[countDistinct]': 'meter_serial_number',
				sort: '-hour(server_timestamp)',
				limit: -1,
				access_token,
			},
		})
		const xaxisNumbers = new Array(24)
			.fill(0)
			.map((_, index) => {
				return [0, 30].map((minute) => `${index}:${minute}`)
			})
			.flat()
		const chartDataHourly = res?.data?.data?.filter(
			(item) =>
				item.server_timestamp_minute === 0 || item.server_timestamp_minute === 30
		)
		const data = xaxisNumbers
			.map((num) => {
				const res = chartDataHourly.find(
					(item) =>
						`${item.server_timestamp_hour}:${item.server_timestamp_minute}` ===
						num
				)
				return res
					? res
					: {
						server_timestamp_hour: num.split(':')[0],
						server_timestamp_minute: num.split(':')[1],
						countDistinct: {
							meter_serial_number: 0,
						},
					}
			})
			.map((item) => item?.countDistinct.meter_serial_number)
		const xAxis = new Array(24)
			.fill(0)
			.map((_, i) => i)
			.map((item) => {
				const date = format(
					sub(new Date(), { hours: item }) as any,
					'dd-MM hh:mm:a'
				)
				return date
			})
		return {
			x: xAxis,
			y: data,
		}
	}
}



// Single Phase HES Block Load Chart
export const fetchTodaysDataSyncBlockLoadSingle = async () => {
	const res = await http.get('/items/meter_block_load_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})

	const xaxisNumbers = new Array(24)
		.fill(0)
		.map((_, index) => {
			return [0, 30].map((minute) => `${index}:${minute}`)
		})
		.flat()

	const chartDataHourly = res?.data?.data?.filter(
		(item) =>
			item.server_timestamp_minute === 0 || item.server_timestamp_minute === 30
	)

	const data = xaxisNumbers
		.map((num) => {
			const res = chartDataHourly.find(
				(item) =>
					`${item.server_timestamp_hour}:${item.server_timestamp_minute}` ===
					num
			)
			return res
				? res
				: {
					server_timestamp_hour: num.split(':')[0],
					server_timestamp_minute: num.split(':')[1],
					countDistinct: {
						meter_serial_number: 0,
					},
				}
		})
		.map((item) => item?.countDistinct.meter_serial_number)

	const xAxis = new Array(24)
		.fill(0)
		.map((_, i) => i)
		.map((item) => {
			const date = format(
				sub(new Date(), { hours: item }) as any,
				'dd-MM hh:mm:a'
			)
			return date
		})

	return {
		x: xAxis,
		y: data,
	}
}
//--------------------Three Phase------------------------

// Three Phase HES Block Load Chart
export const fetchTodaysDataSyncBlockLoadThree = async () => {
	const res = await http.get('/items/meter_block_load_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})

	const xaxisNumbers = new Array(24)
		.fill(0)
		.map((_, index) => {
			return [0, 30].map((minute) => `${index}:${minute}`)
		})
		.flat()

	const chartDataHourly = res?.data?.data?.filter(
		(item) =>
			item.server_timestamp_minute === 0 || item.server_timestamp_minute === 30
	)

	const data = xaxisNumbers
		.map((num) => {
			const res = chartDataHourly.find(
				(item) =>
					`${item.server_timestamp_hour}:${item.server_timestamp_minute}` ===
					num
			)
			return res
				? res
				: {
					server_timestamp_hour: num.split(':')[0],
					server_timestamp_minute: num.split(':')[1],
					countDistinct: {
						meter_serial_number: 0,
					},
				}
		})
		.map((item) => item?.countDistinct.meter_serial_number)

	const xAxis = new Array(24)
		.fill(0)
		.map((_, i) => i)
		.map((item) => {
			const date = format(
				sub(new Date(), { hours: item }) as any,
				'dd-MM hh:mm:a'
			)
			return date
		})

	return {
		x: xAxis,
		y: data,
	}
}


// All Phase HES OLD Instantaneous chart Data(NOt in Working)
export const fetchTodaysDataSyncInstant = async () => {
	const res = await http.get('/items/meters_data_sync', {
		params: {
			filter: {
				_and: [
					{ date: { _gt: '$NOW(-24 hours)' } },
					{ function_id: { _in: ['1'] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]':
				'day(server_date_time),month(server_date_time),year(server_date_time),hour(server_date_time),minute(server_date_time),source_date_time',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-server_date_time',
			limit: -1,
			access_token,
		},
	})

	const grouped = _.groupBy(
		res?.data?.data
			?.filter(
				(item) =>
					item.server_date_time_minute === 0 ||
					item.server_date_time_minute === 15 ||
					item.server_date_time_minute === 30 ||
					item.server_date_time_minute === 45
			)
			?.map((item) => ({
				timeStamp: format(
					new Date(
						item?.server_date_time_year,
						item?.server_date_time_month - 1,
						item?.server_date_time_day,
						item?.server_date_time_hour,
						item?.server_date_time_minute
					),
					'dd-MM hh:mm:a'
				),
				value: item?.countDistinct.meter_serial_number,
			})),
		'timeStamp'
	)
	const chartData = Object.entries(grouped).map(([key, value]: [any, any]) => ({
		timeStamp: key,
		value: value.reduce((acc, curr) => acc + curr.value, 0),
	}))

	return chartData
}
/* Instantaneous Chart Data All Phase */
//All Phase HES Dashbord Instatntaneous Chart Data old
export const fetchTodaysDataSyncInstantAll = async () => {

	const res3p = await http.get('/items/meter_instantaneous_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utilityid: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})

	const res1p = await http.get('/items/meter_instantaneous_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})

	let result = (res3p.data.data);
	let allSum = 0;
	let _newArr = [];
	// console.log("data HES res3p : ", res3p.data.data)
	// console.log("data HES res1p : ", res1p.data.data)

	let MinFilteri1p = res1p.data.data.filter((item) => {
		if (item.server_timestamp_minute == 15 || item.server_timestamp_minute == 0 ||
			item.server_timestamp_minute == 30 || item.server_timestamp_minute == 45) {
			return item
		}
	})

	let MinFilteri3p = res3p.data.data.filter((item) => {
		if (item.server_timestamp_minute == 15 || item.server_timestamp_minute == 0 ||
			item.server_timestamp_minute == 30 || item.server_timestamp_minute == 45) {
			return item
		}
	})
	// console.log("ffffffffff",MinFilteri1p,MinFilteri3p)

	let concatData = MinFilteri1p.map((item, _index) => {

		let min = item.server_timestamp_minute;
		let hr = item.server_timestamp_hour;
		const result = MinFilteri3p.find((item2) =>
			item.server_timestamp_minute == item2.server_timestamp_minute && item.server_timestamp_hour == item2.server_timestamp_hour
		);

		if (result) {
			let serialNumber = item.countDistinct.meter_serial_number + result.countDistinct.meter_serial_number;
			return {
				"server_timestamp_hour": item.server_timestamp_hour,
				"server_timestamp_minute": item.server_timestamp_minute,
				"countDistinct": { "meter_serial_number": serialNumber }
			}
		} else {
			return item;
		}
	})
	// console.log("concatData",concatData)



	// -------------------Combined Data-----------------

	//     var newArr=[];
	// 	for(var i=0;i<=23;i++){ 
	// 		for(var j=45;j>=0;j=j-15){ 
	// 			newArr.push({ "countDistinct": {"meter_serial_number": 0},"server_timestamp_hour": i,"server_timestamp_minute": j} )
	// 		}
	// 	}
	// 	console.log("New datat",newArr);

	// 	let p13=[];
	// 	let p1=[];
	// 	let time_hour1p = [];
	// 	let time_minute1p = [];
	// 	for(let i=0;i<res1p.data.data.length;i++){
	// 		let key= i;
	// 		time_hour1p[key] = res1p.data.data[i].server_timestamp_hour;

	// 		let key1 = i;
	// 		time_minute1p[key1] = res1p.data.data[i].server_timestamp_minute;

	// 		// p13 = [...time_hour1p, ...time_minute1p]

	// 		p1[key]=res1p.data.data[i].countDistinct.meter_serial_number;
	// 	}

	//       var  p1Arr=[];

	// 	for(let i=0;i<res1p.data.data.length;i++){ 

	// 		var min= res1p.data.data[i].server_timestamp_minute;
	// 		console.log(min);

	// 		if(min==0 || min==15 || min==30 || min==45){
	// 	  	p1Arr.push({ "countDistinct": {"meter_serial_number": p1[i]},"server_timestamp_hour": time_hour1p[i],"server_timestamp_minute": time_minute1p[i]} )
	// 		}
	// 	}

	// 	console.log("newArr p1",newArr);
	// 	console.log("p1Arr p1",p1Arr);
	// 	var newDatap1= {...newArr,...p1Arr}

	// 	console.log("comb p1 newDatap1",newDatap1);



	// 	console.log(p1Arr);

	// 	let p1_data = [];
	// 	p1_data = { ...time_minute1p, ...p1}
	// //	console.log("000000000000000000000",p1_data)

	// 	let p3=[];
	// 	let time_hour3p = [];
	// 	let time_minute3p = [];
	// 	for(let i=0;i<res3p.data.data.length;i++){
	// 		let key= i;
	// 		time_hour3p[key] = res3p.data.data[i].server_timestamp_hour

	// 		let key1 = i;
	// 		time_minute3p[key1] = res3p.data.data[i].server_timestamp_minute 

	// 		p1[key]=res3p.data.data[i].countDistinct.meter_serial_number
	// 	}


	// 	var  p3Arr=[];

	// 	for(let i=0;i<res3p.data.data.length;i++){ 
	// 		var min= res3p.data.data[i].server_timestamp_minute;
	// 		if(min==0||min==15||min==30||min==45){
	// 		 p3Arr.push({ "countDistinct": {"meter_serial_number": p3[i]},"server_timestamp_hour": time_hour3p[i],"server_timestamp_minute": time_minute3p[i]} )
	// 		} 
	// 	}

	// 	console.log("new 3p -> ",p3Arr)

	// 	var newDatap3= {...newArr,...p3Arr}

	// 	console.log("comb p1",newDatap3);

	// 	var arraNewData=[];
	// //console.log("len:",Object.keys(newDatap1).length);
	//      for(var i=0;i<Object.keys(newDatap1).length;i++){ 

	// 		//newDatap1
	// 		//newDatap3
	// 		if((newDatap1[i].server_timestamp_hour==newDatap3[i].server_timestamp_hour) &&(newDatap1[i].server_timestamp_minute==newDatap3[i].server_timestamp_minute) ){
	// 		    console.log("66666666666666666666",newDatap1[i].countDistinct.meter_serial_number);
	// 			var new_mtr =parseInt(newDatap1[i].countDistinct.meter_serial_number)+parseInt(newDatap3[i].countDistinct.meter_serial_number);

	// 			arraNewData.push({ "countDistinct": {"meter_serial_number":new_mtr},"server_timestamp_hour": newDatap1[i].server_timestamp_hour,"server_timestamp_minute": newDatap1[i].server_timestamp_minute} )

	// 		}
	// 	 }
	// 	console.log("combined data p1 p3",arraNewData);

	// var newArr3 = [];
	// for(var i=0; i<= res3p.data.data.length; i++){
	// 	// let keyh = res3p.data.data[i].server_timestamp_hour;
	// 	// let keym = res3p.data.data[i].server_timestamp_minute;
	// 	newArr3.push(res3p.data.data[i].countDistinct.meter_serial_number)
	// }
	// console.log("New Array 33333333333",newArr3)


	// let d1h = [];
	// let d1m = [];
	// let p1 = [];
	// for(var i=0; i<res1p.data.data.length; i++){
	// 	let keyh = res1p.data.data[i].server_timestamp_hour;
	// 	let keym = res1p.data.data[i].server_timestamp_minute;
	// 	let data1p = res1p.data.data[i].countDistinct.meter_serial_number;
	// 	d1h[keyh] = 0;
	// 	d1m[keym] = 0;
	// 	p1[data1p] = 0;
	// 	console.log("Time_Hour",keyh)
	// 	console.log("Time_Minute",keym)
	// 	console.log("Data_1P",data1p)
	// }

	// 	if(res1p.data.data[i].server_timestamp_hour == 0 || res1p.data.data[i].server_timestamp_hour == 15 || res1p.data.data[i].server_timestamp_hour == 30 || res1p.data.data[i].server_timestamp_hour == 45){
	// 		p1 = res1p.data.data[i].countDistinct.meter_serial_number 
	// 	}

	// 	console.log("Time_Hour",keyh)
	// 	console.log("Time_Minute",keym)
	// 	console.log("Data_1P",data1p)
	// 	// let abc = d1h.concat(keym)
	// 	// let abc = keyh.concat(keym).join(':')
	// 	// console.log("Concat Time -> ",abc)
	// }
	// // console.log("d1111111111111111111111111",d1h)
	// // console.log("d2222222222222222222222222",d1m)
	// console.log("1pppppppppppppppppppp",p1)


	// let p1data = [];
	// for(let i=0; i<res1p.data.data.length; i++){
	// 	let key1 = res1p.data.data[i].server_timestamp_hour;
	// 	let key2 = res1p.data.data[i].server_timestamp_minute; 
	// }

	// console.log("jhfbf cdfasdfdfa",p1data)


	// let arr1 = res1p.data.data
	// let arr3 = res3p.data.data
	// let totalArray = [];
	// const totalLength =  Math.max(arr1.length, arr3.length);
	// for (let i = 0; i < totalLength; i++) {
	//     totalArray[i] = (arr1[i].countDistinct.meter_serial_number || 0) + (arr3[i].countDistinct.meter_serial_number || 0);
	// 	console.log("array data",totalArray)
	// }
	// console.log("total data ====> ",totalArray)

	// let timeh = [];
	// timeh = {...d1h, ...d1m}
	// console.log("Combined data with Hour -> ",timeh)

	// let p1 = [];
	// for(var i=0; i<res1p.data.data.length; i++){
	// 	p1 = res1p.data.data[i].countDistinct.meter_serial_number;

	// console.log("uuuuuuuuuuuuuu", p1)
	// }

	// -------------------Combined Data End-----------------








	// result.map(function (key, value) {
	// 	// console.log("dfjksd", res1p.data.data[value].countDistinct.meter_serial_number)
	// 	// console.log("dfjksd", res3p.data.data.length)
	// 	if(res1p.data.data.length > 0){
	// 		allSum = res1p.data.data[value].countDistinct.meter_serial_number
	// 	}else{
	// 		allSum = 0;
	// 	}

	// 	_newArr.push({
	// 		"server_timestamp_hour": key.server_timestamp_hour,
	// 		"server_timestamp_minute": key.server_timestamp_minute,
	// 		"countDistinct": {
	// 			"meter_serial_number": key.countDistinct.meter_serial_number + allSum
	// 		}
	// 	});
	// })

	// console.log("Arraya  oooooooooooooooooo",_newArr)


	const xaxisNumbers = new Array(24)
		.fill(0)
		.map((_, index) => {
			return [0, 15, 30, 45].map((minute) => `${index}:${minute}`)
		})
		.flat()


	// const chartDataHourly = res1p?.data?.data?.filter(
	// const chartDataHourly = concatData?.filter(
	const chartDataHourly = concatData?.filter(
		(item) =>
			item.server_timestamp_minute === 0 ||
			item.server_timestamp_minute === 15 ||
			item.server_timestamp_minute === 30 ||
			item.server_timestamp_minute === 45
	)

	const arrdata = [];
	xaxisNumbers
		.map((num) => {
			const res1 = chartDataHourly.filter((item) =>
				`${item.server_timestamp_hour}:${item.server_timestamp_minute}` === num
			)

			if (res1.length !== 0) {
				arrdata.push(res1[0]);
			}
			// const res = chartDataHourly.find(
			// 	(item) =>
			// 		`${item.source_timestamp_hour}:${item.source_timestamp_minute}` ===
			// 		num
			// )
			// return res
			// 	? res
			// 	: {
			// 		source_timestamp_hour: num.split(':')[0],
			// 		source_timestamp_minute: num.split(':')[1],
			// 		countDistinct: {
			// 			meter_serial_number: 0,
			// 		},
			// 	}
		})
	// const data=concatData.map((item) => item?.countDistinct.meter_serial_number)
	const data = arrdata.map((item) => item?.countDistinct.meter_serial_number)

	// data.reduce(function(acc, value) {
	// 	const res32 = acc + value;
	// 	console.log("reeduce", res32)
	// })
	// console.log("all Data", data)
	return {
		x: new Array(24)
			.fill(0)
			.map((_, i) => i)
			.map((item) => {
				const date = format(
					sub(new Date(), { hours: item }) as any,
					'dd-MM hh:mm:a'
				)
				return date
			}),
		y: data,
	}

}


/*new all 3 phase 1 phase start */


/* 0 to 14 min arr length */
const arrlenfor0to14 = (res) => {
	let p1hr = [];
	for (let i = 0; i < res?.data?.data?.length; i++) {

		//p1hr.filter((item) => item.source_timestamp_hour == 0);
		if (res?.data?.data[i]?.source_timestamp_hour != 0) {
			var p1hour = res?.data?.data[i]?.source_timestamp_hour;
		} var p1minute = res.data.data[i].source_timestamp_minute;
		//console.log("0-14"+p1hour);
		var ndata = null;

		if (p1hour === 0 || p1hour === 1 || p1hour === 2 || p1hour === 3 || p1hour === 4 || p1hour === 5 || p1hour === 6 || p1hour === 7 || p1hour === 8 || p1hour === 9 || p1hour === 10 || p1hour === 11 || p1hour === 12 || p1hour === 13 || p1hour === 14 || p1hour === 15 || p1hour === 16 || p1hour === 17 || p1hour === 18 || p1hour === 19 || p1hour === 20 || p1hour === 21 || p1hour === 22 || p1hour === 23) {
			if (p1minute === 0 || p1minute === 1 || p1minute === 2 || p1minute === 3 || p1minute === 4 || p1minute === 5 || p1minute === 6 || p1minute === 7 || p1minute === 8 || p1minute === 9 || p1minute === 10 || p1minute === 11 || p1minute === 12 || p1minute === 13 || p1minute === 14) {
				ndata = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number
				}
				if (ndata) {
					p1hr.push(ndata);
				}
			}

		}
	}
	let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [], arrh4 = [], arrh5 = [], arrh6 = [], arrh7 = [], arrh8 = [], arrh9 = [], arrh10 = [],
		arrh11 = [], arrh12 = [], arrh13 = [], arrh14 = [], arrh15 = [], arrh16 = [], arrh17 = [], arrh18 = [], arrh19 = [], arrh20 = [], arrh21 = [],
		arrh22 = [], arrh23 = [];

	let arrlen = []
	let msn0h = p1hr.filter((item) => item.source_timestamp_hour == 0);

	let ms0 = msn0h.map((item) => item.meter_serial_number);
	arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index + 1))
	//console.log(arrh0);
	//console.log(ms0);
	//console.log(arrh0.length);
	arrlen.push(arrh0.length);

	let msn1h = p1hr.filter((item) => item.source_timestamp_hour == 1);
	let ms1 = msn1h.map((item) => item.meter_serial_number);
	arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1))
	arrlen.push(arrh1.length);

	let msn2h = p1hr.filter((item) => item.source_timestamp_hour == 2);
	let ms2 = msn2h.map((item) => item.meter_serial_number);
	arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1))
	arrlen.push(arrh2.length);

	let msn3h = p1hr.filter((item) => item.source_timestamp_hour == 3);
	let ms3 = msn3h.map((item) => item.meter_serial_number);
	arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1))
	arrlen.push(arrh3.length);

	let msn4h = p1hr.filter((item) => item.source_timestamp_hour == 4);
	let ms4 = msn4h.map((item) => item.meter_serial_number);
	arrh4 = msn4h.filter(({ meter_serial_number }, index) => !ms4.includes(meter_serial_number, index + 1))
	arrlen.push(arrh4.length);

	let msn5h = p1hr.filter((item) => item.source_timestamp_hour == 5);
	let ms5 = msn5h.map((item) => item.meter_serial_number);
	arrh5 = msn5h.filter(({ meter_serial_number }, index) => !ms5.includes(meter_serial_number, index + 1))
	arrlen.push(arrh5.length);

	let msn6h = p1hr.filter((item) => item.source_timestamp_hour == 6);
	let ms6 = msn6h.map((item) => item.meter_serial_number);
	arrh6 = msn6h.filter(({ meter_serial_number }, index) => !ms6.includes(meter_serial_number, index + 1))
	arrlen.push(arrh6.length);

	let msn7h = p1hr.filter((item) => item.source_timestamp_hour == 7);
	let ms7 = msn7h.map((item) => item.meter_serial_number);
	arrh7 = msn7h.filter(({ meter_serial_number }, index) => !ms7.includes(meter_serial_number, index + 1))
	arrlen.push(arrh7.length);

	let msn8h = p1hr.filter((item) => item.source_timestamp_hour == 8);
	let ms8 = msn8h.map((item) => item.meter_serial_number);
	arrh8 = msn8h.filter(({ meter_serial_number }, index) => !ms8.includes(meter_serial_number, index + 1))
	arrlen.push(arrh8.length);

	let msn9h = p1hr.filter((item) => item.source_timestamp_hour == 9);
	let ms9 = msn9h.map((item) => item.meter_serial_number);
	arrh9 = msn9h.filter(({ meter_serial_number }, index) => !ms9.includes(meter_serial_number, index + 1))
	arrlen.push(arrh9.length);

	let msn10h = p1hr.filter((item) => item.source_timestamp_hour == 10);
	let ms10 = msn10h.map((item) => item.meter_serial_number);
	arrh10 = msn10h.filter(({ meter_serial_number }, index) => !ms10.includes(meter_serial_number, index + 1))
	arrlen.push(arrh10.length);

	let msn11h = p1hr.filter((item) => item.source_timestamp_hour == 11);
	let ms11 = msn11h.map((item) => item.meter_serial_number);
	arrh11 = msn11h.filter(({ meter_serial_number }, index) => !ms11.includes(meter_serial_number, index + 1))
	arrlen.push(arrh11.length);

	let msn12h = p1hr.filter((item) => item.source_timestamp_hour == 12);
	let ms12 = msn12h.map((item) => item.meter_serial_number);
	arrh12 = msn12h.filter(({ meter_serial_number }, index) => !ms12.includes(meter_serial_number, index + 1))
	arrlen.push(arrh12.length);

	let msn13h = p1hr.filter((item) => item.source_timestamp_hour == 13);
	let ms13 = msn13h.map((item) => item.meter_serial_number);
	arrh13 = msn13h.filter(({ meter_serial_number }, index) => !ms13.includes(meter_serial_number, index + 1))
	arrlen.push(arrh13.length);

	let msn14h = p1hr.filter((item) => item.source_timestamp_hour == 14);
	let ms14 = msn14h.map((item) => item.meter_serial_number);
	arrh14 = msn14h.filter(({ meter_serial_number }, index) => !ms14.includes(meter_serial_number, index + 1))
	arrlen.push(arrh14.length);

	let msn15h = p1hr.filter((item) => item.source_timestamp_hour == 15);
	let ms15 = msn15h.map((item) => item.meter_serial_number);
	arrh15 = msn15h.filter(({ meter_serial_number }, index) => !ms15.includes(meter_serial_number, index + 1))
	arrlen.push(arrh15.length);

	let msn16h = p1hr.filter((item) => item.source_timestamp_hour == 16);
	let ms16 = msn16h.map((item) => item.meter_serial_number);
	arrh16 = msn16h.filter(({ meter_serial_number }, index) => !ms16.includes(meter_serial_number, index + 1))
	arrlen.push(arrh16.length);

	let msn17h = p1hr.filter((item) => item.source_timestamp_hour == 17);
	let ms17 = msn17h.map((item) => item.meter_serial_number);
	arrh17 = msn17h.filter(({ meter_serial_number }, index) => !ms17.includes(meter_serial_number, index + 1))
	arrlen.push(arrh17.length);

	let msn18h = p1hr.filter((item) => item.source_timestamp_hour == 18);
	let ms18 = msn18h.map((item) => item.meter_serial_number);
	arrh18 = msn18h.filter(({ meter_serial_number }, index) => !ms18.includes(meter_serial_number, index + 1))
	arrlen.push(arrh18.length);

	let msn19h = p1hr.filter((item) => item.source_timestamp_hour == 19);
	let ms19 = msn19h.map((item) => item.meter_serial_number);
	arrh19 = msn19h.filter(({ meter_serial_number }, index) => !ms19.includes(meter_serial_number, index + 1))
	arrlen.push(arrh19.length);

	let msn20h = p1hr.filter((item) => item.source_timestamp_hour == 20);
	let ms20 = msn20h.map((item) => item.meter_serial_number);
	arrh20 = msn20h.filter(({ meter_serial_number }, index) => !ms20.includes(meter_serial_number, index + 1))
	arrlen.push(arrh20.length);

	let msn21h = p1hr.filter((item) => item.source_timestamp_hour == 21);
	let ms21 = msn21h.map((item) => item.meter_serial_number);
	arrh21 = msn21h.filter(({ meter_serial_number }, index) => !ms21.includes(meter_serial_number, index + 1))
	arrlen.push(arrh21.length);

	let msn22h = p1hr.filter((item) => item.source_timestamp_hour == 22);
	let ms22 = msn22h.map((item) => item.meter_serial_number);
	arrh22 = msn22h.filter(({ meter_serial_number }, index) => !ms22.includes(meter_serial_number, index + 1))
	arrlen.push(arrh22.length);

	let msn23h = p1hr.filter((item) => item.source_timestamp_hour == 23);
	let ms23 = msn23h.map((item) => item.meter_serial_number);
	arrh23 = msn23h.filter(({ meter_serial_number }, index) => !ms23.includes(meter_serial_number, index + 1))
	arrlen.push(arrh23.length);
	//console.log(arrlen);
	return arrlen;
}



/* -------------------------------------------------------------------------------------- */
/* 15 to 29 min arr length */
const arrlenfor15to29 = (res) => {
	let p1hr = [];
	for (let i = 0; i < res?.data?.data?.length; i++) {

		var p1minute = res?.data?.data[i]?.source_timestamp_minute;
		var p1hour = res?.data?.data[i]?.source_timestamp_hour - 1;
		/* var meter_serial_number=res?.data?.data[i]?.meter_serial_number
		
		console.log(p1minute+"  "+p1hour+" "+meter_serial_number); */

		var ndata = null;

		if (p1hour === 0 || p1hour === 1 || p1hour === 2 || p1hour === 3 || p1hour === 4 || p1hour === 5 || p1hour === 6 || p1hour === 7 || p1hour === 8 || p1hour === 9 || p1hour === 10 || p1hour === 11 || p1hour === 12 || p1hour === 13 || p1hour === 14 || p1hour === 15 || p1hour === 16 || p1hour === 17 || p1hour === 18 || p1hour === 19 || p1hour === 20 || p1hour === 21 || p1hour === 22 || p1hour === 23) {
			if (p1minute === 15 || p1minute === 16 || p1minute === 17 || p1minute === 18 || p1minute === 19 || p1minute === 20 || p1minute === 21 || p1minute === 22 || p1minute === 23 || p1minute === 24 || p1minute === 25 || p1minute === 26 || p1minute === 27 || p1minute === 28 || p1minute === 29) {
				ndata = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number
				}
				if (ndata) {
					p1hr.push(ndata);
				}
			}

		}
	}
	let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [], arrh4 = [], arrh5 = [], arrh6 = [], arrh7 = [], arrh8 = [], arrh9 = [], arrh10 = [],
		arrh11 = [], arrh12 = [], arrh13 = [], arrh14 = [], arrh15 = [], arrh16 = [], arrh17 = [], arrh18 = [], arrh19 = [], arrh20 = [], arrh21 = [],
		arrh22 = [], arrh23 = [];

	let arrlen = []
	let msn0h = p1hr.filter((item) => item.source_timestamp_hour == 0);
	let ms0 = msn0h.map((item) => item.meter_serial_number);
	arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index = 1))
	//console.log(arrh0);
	arrlen.push(arrh0.length);

	let msn1h = p1hr.filter((item) => item.source_timestamp_hour == 1);
	let ms1 = msn1h.map((item) => item.meter_serial_number);
	arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1))
	arrlen.push(arrh1.length);

	let msn2h = p1hr.filter((item) => item.source_timestamp_hour == 2);
	let ms2 = msn2h.map((item) => item.meter_serial_number);
	arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1))
	arrlen.push(arrh2.length);

	let msn3h = p1hr.filter((item) => item.source_timestamp_hour == 3);
	let ms3 = msn3h.map((item) => item.meter_serial_number);
	arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1))
	arrlen.push(arrh3.length);

	let msn4h = p1hr.filter((item) => item.source_timestamp_hour == 4);
	let ms4 = msn4h.map((item) => item.meter_serial_number);
	arrh4 = msn4h.filter(({ meter_serial_number }, index) => !ms4.includes(meter_serial_number, index + 1))
	arrlen.push(arrh4.length);

	let msn5h = p1hr.filter((item) => item.source_timestamp_hour == 5);
	let ms5 = msn5h.map((item) => item.meter_serial_number);
	arrh5 = msn5h.filter(({ meter_serial_number }, index) => !ms5.includes(meter_serial_number, index + 1))
	arrlen.push(arrh5.length);

	let msn6h = p1hr.filter((item) => item.source_timestamp_hour == 6);
	let ms6 = msn6h.map((item) => item.meter_serial_number);
	arrh6 = msn6h.filter(({ meter_serial_number }, index) => !ms6.includes(meter_serial_number, index + 1))
	arrlen.push(arrh6.length);

	let msn7h = p1hr.filter((item) => item.source_timestamp_hour == 7);
	let ms7 = msn7h.map((item) => item.meter_serial_number);
	arrh7 = msn7h.filter(({ meter_serial_number }, index) => !ms7.includes(meter_serial_number, index + 1))
	arrlen.push(arrh7.length);

	let msn8h = p1hr.filter((item) => item.source_timestamp_hour == 8);
	let ms8 = msn8h.map((item) => item.meter_serial_number);
	arrh8 = msn8h.filter(({ meter_serial_number }, index) => !ms8.includes(meter_serial_number, index + 1))
	arrlen.push(arrh8.length);

	let msn9h = p1hr.filter((item) => item.source_timestamp_hour == 9);
	let ms9 = msn9h.map((item) => item.meter_serial_number);
	arrh9 = msn9h.filter(({ meter_serial_number }, index) => !ms9.includes(meter_serial_number, index + 1))
	arrlen.push(arrh9.length);

	let msn10h = p1hr.filter((item) => item.source_timestamp_hour == 10);
	let ms10 = msn10h.map((item) => item.meter_serial_number);
	arrh10 = msn10h.filter(({ meter_serial_number }, index) => !ms10.includes(meter_serial_number, index + 1))
	arrlen.push(arrh10.length);

	let msn11h = p1hr.filter((item) => item.source_timestamp_hour == 11);
	let ms11 = msn11h.map((item) => item.meter_serial_number);
	arrh11 = msn11h.filter(({ meter_serial_number }, index) => !ms11.includes(meter_serial_number, index + 1))
	arrlen.push(arrh11.length);

	let msn12h = p1hr.filter((item) => item.source_timestamp_hour == 12);
	let ms12 = msn12h.map((item) => item.meter_serial_number);
	arrh12 = msn12h.filter(({ meter_serial_number }, index) => !ms12.includes(meter_serial_number, index + 1))
	arrlen.push(arrh12.length);

	let msn13h = p1hr.filter((item) => item.source_timestamp_hour == 13);
	let ms13 = msn13h.map((item) => item.meter_serial_number);
	arrh13 = msn13h.filter(({ meter_serial_number }, index) => !ms13.includes(meter_serial_number, index + 1))
	arrlen.push(arrh13.length);

	let msn14h = p1hr.filter((item) => item.source_timestamp_hour == 14);
	let ms14 = msn14h.map((item) => item.meter_serial_number);
	arrh14 = msn14h.filter(({ meter_serial_number }, index) => !ms14.includes(meter_serial_number, index + 1))
	arrlen.push(arrh14.length);

	let msn15h = p1hr.filter((item) => item.source_timestamp_hour == 15);
	let ms15 = msn15h.map((item) => item.meter_serial_number);
	arrh15 = msn15h.filter(({ meter_serial_number }, index) => !ms15.includes(meter_serial_number, index + 1))
	arrlen.push(arrh15.length);

	let msn16h = p1hr.filter((item) => item.source_timestamp_hour == 16);
	let ms16 = msn16h.map((item) => item.meter_serial_number);
	arrh16 = msn16h.filter(({ meter_serial_number }, index) => !ms16.includes(meter_serial_number, index + 1))
	arrlen.push(arrh16.length);

	let msn17h = p1hr.filter((item) => item.source_timestamp_hour == 17);
	let ms17 = msn17h.map((item) => item.meter_serial_number);
	arrh17 = msn17h.filter(({ meter_serial_number }, index) => !ms17.includes(meter_serial_number, index + 1))
	arrlen.push(arrh17.length);

	let msn18h = p1hr.filter((item) => item.source_timestamp_hour == 18);
	let ms18 = msn18h.map((item) => item.meter_serial_number);
	arrh18 = msn18h.filter(({ meter_serial_number }, index) => !ms18.includes(meter_serial_number, index + 1))
	arrlen.push(arrh18.length);

	let msn19h = p1hr.filter((item) => item.source_timestamp_hour == 19);
	let ms19 = msn19h.map((item) => item.meter_serial_number);
	arrh19 = msn19h.filter(({ meter_serial_number }, index) => !ms19.includes(meter_serial_number, index + 1))
	arrlen.push(arrh19.length);

	let msn20h = p1hr.filter((item) => item.source_timestamp_hour == 20);
	let ms20 = msn20h.map((item) => item.meter_serial_number);
	arrh20 = msn20h.filter(({ meter_serial_number }, index) => !ms20.includes(meter_serial_number, index + 1))
	arrlen.push(arrh20.length);

	let msn21h = p1hr.filter((item) => item.source_timestamp_hour == 21);
	let ms21 = msn21h.map((item) => item.meter_serial_number);
	arrh21 = msn21h.filter(({ meter_serial_number }, index) => !ms21.includes(meter_serial_number, index + 1))
	arrlen.push(arrh21.length);

	let msn22h = p1hr.filter((item) => item.source_timestamp_hour == 22);
	let ms22 = msn22h.map((item) => item.meter_serial_number);
	arrh22 = msn22h.filter(({ meter_serial_number }, index) => !ms22.includes(meter_serial_number, index + 1))
	arrlen.push(arrh22.length);

	let msn23h = p1hr.filter((item) => item.source_timestamp_hour == 23);
	let ms23 = msn23h.map((item) => item.meter_serial_number);
	arrh23 = msn23h.filter(({ meter_serial_number }, index) => !ms23.includes(meter_serial_number, index + 1))
	arrlen.push(arrh23.length);

	return arrlen;
}

/* 15 to 29 min arr length */
const arrlenfor30to44 = (res) => {
	let p1hr = [];
	for (let i = 0; i < res?.data?.data?.length; i++) {


		var p1hour = res?.data?.data[i]?.source_timestamp_hour;

		var p1minute = res?.data?.data[i]?.source_timestamp_minute;

		//var meter_serial_number=res?.data?.data[i]?.meter_serial_number

		//console.log(p1minute+"  "+p1hour+" "+meter_serial_number);

		var ndata = null;

		if (p1hour === 0 || p1hour === 1 || p1hour === 2 || p1hour === 3 || p1hour === 4 || p1hour === 5 || p1hour === 6 || p1hour === 7 || p1hour === 8 || p1hour === 9 || p1hour === 10 || p1hour === 11 || p1hour === 12 || p1hour === 13 || p1hour === 14 || p1hour === 15 || p1hour === 16 || p1hour === 17 || p1hour === 18 || p1hour === 19 || p1hour === 20 || p1hour === 21 || p1hour === 22 || p1hour === 23) {
			if (p1minute === 30 || p1minute === 31 || p1minute === 32 || p1minute === 33 || p1minute === 34 || p1minute === 35 || p1minute === 36 || p1minute === 37 || p1minute === 38 || p1minute === 39 || p1minute === 40 || p1minute === 41 || p1minute === 42 || p1minute === 43 || p1minute === 44) {
				ndata = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number
				}
				if (ndata) {
					p1hr.push(ndata);
				}
			}

		}
	}
	let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [], arrh4 = [], arrh5 = [], arrh6 = [], arrh7 = [], arrh8 = [], arrh9 = [], arrh10 = [],
		arrh11 = [], arrh12 = [], arrh13 = [], arrh14 = [], arrh15 = [], arrh16 = [], arrh17 = [], arrh18 = [], arrh19 = [], arrh20 = [], arrh21 = [],
		arrh22 = [], arrh23 = [];

	let arrlen = []
	let msn0h = p1hr.filter((item) => item.source_timestamp_hour == 0);
	let ms0 = msn0h.map((item) => item.meter_serial_number);
	arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index + 1))
	arrlen.push(arrh0.length);

	let msn1h = p1hr.filter((item) => item.source_timestamp_hour == 1);
	let ms1 = msn1h.map((item) => item.meter_serial_number);
	arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1))
	arrlen.push(arrh1.length);

	let msn2h = p1hr.filter((item) => item.source_timestamp_hour == 2);
	let ms2 = msn2h.map((item) => item.meter_serial_number);
	arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1))
	arrlen.push(arrh2.length);

	let msn3h = p1hr.filter((item) => item.source_timestamp_hour == 3);
	let ms3 = msn3h.map((item) => item.meter_serial_number);
	arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1))
	arrlen.push(arrh3.length);

	let msn4h = p1hr.filter((item) => item.source_timestamp_hour == 4);
	let ms4 = msn4h.map((item) => item.meter_serial_number);
	arrh4 = msn4h.filter(({ meter_serial_number }, index) => !ms4.includes(meter_serial_number, index + 1))
	arrlen.push(arrh4.length);

	let msn5h = p1hr.filter((item) => item.source_timestamp_hour == 5);
	let ms5 = msn5h.map((item) => item.meter_serial_number);
	arrh5 = msn5h.filter(({ meter_serial_number }, index) => !ms5.includes(meter_serial_number, index + 1))
	arrlen.push(arrh5.length);

	let msn6h = p1hr.filter((item) => item.source_timestamp_hour == 6);
	let ms6 = msn6h.map((item) => item.meter_serial_number);
	arrh6 = msn6h.filter(({ meter_serial_number }, index) => !ms6.includes(meter_serial_number, index + 1))
	arrlen.push(arrh6.length);

	let msn7h = p1hr.filter((item) => item.source_timestamp_hour == 7);
	let ms7 = msn7h.map((item) => item.meter_serial_number);
	arrh7 = msn7h.filter(({ meter_serial_number }, index) => !ms7.includes(meter_serial_number, index + 1))
	arrlen.push(arrh7.length);

	let msn8h = p1hr.filter((item) => item.source_timestamp_hour == 8);
	let ms8 = msn8h.map((item) => item.meter_serial_number);
	arrh8 = msn8h.filter(({ meter_serial_number }, index) => !ms8.includes(meter_serial_number, index + 1))
	arrlen.push(arrh8.length);

	let msn9h = p1hr.filter((item) => item.source_timestamp_hour == 9);
	let ms9 = msn9h.map((item) => item.meter_serial_number);
	arrh9 = msn9h.filter(({ meter_serial_number }, index) => !ms9.includes(meter_serial_number, index + 1))
	arrlen.push(arrh9.length);

	let msn10h = p1hr.filter((item) => item.source_timestamp_hour == 10);
	let ms10 = msn10h.map((item) => item.meter_serial_number);
	arrh10 = msn10h.filter(({ meter_serial_number }, index) => !ms10.includes(meter_serial_number, index + 1))
	arrlen.push(arrh10.length);

	let msn11h = p1hr.filter((item) => item.source_timestamp_hour == 11);
	let ms11 = msn11h.map((item) => item.meter_serial_number);
	arrh11 = msn11h.filter(({ meter_serial_number }, index) => !ms11.includes(meter_serial_number, index + 1))
	arrlen.push(arrh11.length);

	let msn12h = p1hr.filter((item) => item.source_timestamp_hour == 12);
	let ms12 = msn12h.map((item) => item.meter_serial_number);
	arrh12 = msn12h.filter(({ meter_serial_number }, index) => !ms12.includes(meter_serial_number, index + 1))
	arrlen.push(arrh12.length);

	let msn13h = p1hr.filter((item) => item.source_timestamp_hour == 13);
	let ms13 = msn13h.map((item) => item.meter_serial_number);
	arrh13 = msn13h.filter(({ meter_serial_number }, index) => !ms13.includes(meter_serial_number, index + 1))
	arrlen.push(arrh13.length);

	let msn14h = p1hr.filter((item) => item.source_timestamp_hour == 14);
	let ms14 = msn14h.map((item) => item.meter_serial_number);
	arrh14 = msn14h.filter(({ meter_serial_number }, index) => !ms14.includes(meter_serial_number, index + 1))
	arrlen.push(arrh14.length);

	let msn15h = p1hr.filter((item) => item.source_timestamp_hour == 15);
	let ms15 = msn15h.map((item) => item.meter_serial_number);
	arrh15 = msn15h.filter(({ meter_serial_number }, index) => !ms15.includes(meter_serial_number, index + 1))
	arrlen.push(arrh15.length);

	let msn16h = p1hr.filter((item) => item.source_timestamp_hour == 16);
	let ms16 = msn16h.map((item) => item.meter_serial_number);
	arrh16 = msn16h.filter(({ meter_serial_number }, index) => !ms16.includes(meter_serial_number, index + 1))
	arrlen.push(arrh16.length);

	let msn17h = p1hr.filter((item) => item.source_timestamp_hour == 17);
	let ms17 = msn17h.map((item) => item.meter_serial_number);
	arrh17 = msn17h.filter(({ meter_serial_number }, index) => !ms17.includes(meter_serial_number, index + 1))
	arrlen.push(arrh17.length);

	let msn18h = p1hr.filter((item) => item.source_timestamp_hour == 18);
	let ms18 = msn18h.map((item) => item.meter_serial_number);
	arrh18 = msn18h.filter(({ meter_serial_number }, index) => !ms18.includes(meter_serial_number, index + 1))
	arrlen.push(arrh18.length);

	let msn19h = p1hr.filter((item) => item.source_timestamp_hour == 19);
	let ms19 = msn19h.map((item) => item.meter_serial_number);
	arrh19 = msn19h.filter(({ meter_serial_number }, index) => !ms19.includes(meter_serial_number, index + 1))
	arrlen.push(arrh19.length);

	let msn20h = p1hr.filter((item) => item.source_timestamp_hour == 20);
	let ms20 = msn20h.map((item) => item.meter_serial_number);
	arrh20 = msn20h.filter(({ meter_serial_number }, index) => !ms20.includes(meter_serial_number, index + 1))
	arrlen.push(arrh20.length);

	let msn21h = p1hr.filter((item) => item.source_timestamp_hour == 21);
	let ms21 = msn21h.map((item) => item.meter_serial_number);
	arrh21 = msn21h.filter(({ meter_serial_number }, index) => !ms21.includes(meter_serial_number, index + 1))
	arrlen.push(arrh21.length);

	let msn22h = p1hr.filter((item) => item.source_timestamp_hour == 22);
	let ms22 = msn22h.map((item) => item.meter_serial_number);
	arrh22 = msn22h.filter(({ meter_serial_number }, index) => !ms22.includes(meter_serial_number, index + 1))
	arrlen.push(arrh22.length);

	let msn23h = p1hr.filter((item) => item.source_timestamp_hour == 23);
	let ms23 = msn23h.map((item) => item.meter_serial_number);
	arrh23 = msn23h.filter(({ meter_serial_number }, index) => !ms23.includes(meter_serial_number, index + 1))
	arrlen.push(arrh23.length);

	return arrlen;
}

const arrlen3p = (p1hr, res) => {
	let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [], arrh4 = [], arrh5 = [], arrh6 = [], arrh7 = [], arrh8 = [], arrh9 = [], arrh10 = [],
		arrh11 = [], arrh12 = [], arrh13 = [], arrh14 = [], arrh15 = [], arrh16 = [], arrh17 = [], arrh18 = [], arrh19 = [], arrh20 = [], arrh21 = [],
		arrh22 = [], arrh23 = [];

	let arr0to14len = arrlenfor0to14(res);
	let arr15to29len = arrlenfor15to29(res);
	let arr30to44len = arrlenfor30to44(res);
	let arrlen = []
	let msn0h = p1hr.filter((item) => item.source_timestamp_hour == 0);
	let ms0 = msn0h.map((item) => item.meter_serial_number);
	//console.log(ms0);
	arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index + 1))
	//console.log(arrh0);
	arrlen.push(arr0to14len[0], arr15to29len[0], arr30to44len[0], arrh0.length);

	let msn1h = p1hr.filter((item) => item.source_timestamp_hour == 1);
	let ms1 = msn1h.map((item) => item.meter_serial_number);
	arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[1], arr15to29len[1], arr30to44len[1], arrh1.length);

	let msn2h = p1hr.filter((item) => item.source_timestamp_hour == 2);
	let ms2 = msn2h.map((item) => item.meter_serial_number);
	arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[2], arr15to29len[2], arr30to44len[2], arrh2.length);

	let msn3h = p1hr.filter((item) => item.source_timestamp_hour == 3);
	let ms3 = msn3h.map((item) => item.meter_serial_number);
	arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[3], arr15to29len[3], arr30to44len[3], arrh3.length);

	let msn4h = p1hr.filter((item) => item.source_timestamp_hour == 4);
	let ms4 = msn4h.map((item) => item.meter_serial_number);
	arrh4 = msn4h.filter(({ meter_serial_number }, index) => !ms4.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[4], arr15to29len[4], arr30to44len[4], arrh4.length);

	let msn5h = p1hr.filter((item) => item.source_timestamp_hour == 5);
	let ms5 = msn5h.map((item) => item.meter_serial_number);
	arrh5 = msn5h.filter(({ meter_serial_number }, index) => !ms5.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[5], arr15to29len[5], arr30to44len[5], arrh5.length);

	let msn6h = p1hr.filter((item) => item.source_timestamp_hour == 6);
	let ms6 = msn6h.map((item) => item.meter_serial_number);
	arrh6 = msn6h.filter(({ meter_serial_number }, index) => !ms6.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[6], arr15to29len[6], arr30to44len[6], arrh6.length);

	let msn7h = p1hr.filter((item) => item.source_timestamp_hour == 7);
	let ms7 = msn7h.map((item) => item.meter_serial_number);
	arrh7 = msn7h.filter(({ meter_serial_number }, index) => !ms7.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[7], arr15to29len[7], arr30to44len[7], arrh7.length);

	let msn8h = p1hr.filter((item) => item.source_timestamp_hour == 8);
	let ms8 = msn8h.map((item) => item.meter_serial_number);
	arrh8 = msn8h.filter(({ meter_serial_number }, index) => !ms8.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[8], arr15to29len[8], arr30to44len[8], arrh8.length);

	let msn9h = p1hr.filter((item) => item.source_timestamp_hour == 9);
	let ms9 = msn9h.map((item) => item.meter_serial_number);
	arrh9 = msn9h.filter(({ meter_serial_number }, index) => !ms9.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[9], arr15to29len[9], arr30to44len[9], arrh9.length);

	let msn10h = p1hr.filter((item) => item.source_timestamp_hour == 10);
	let ms10 = msn10h.map((item) => item.meter_serial_number);
	arrh10 = msn10h.filter(({ meter_serial_number }, index) => !ms10.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[10], arr15to29len[10], arr30to44len[10], arrh10.length);

	let msn11h = p1hr.filter((item) => item.source_timestamp_hour == 11);
	let ms11 = msn11h.map((item) => item.meter_serial_number);
	arrh11 = msn11h.filter(({ meter_serial_number }, index) => !ms11.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[11], arr15to29len[11], arr30to44len[11], arrh11.length);

	let msn12h = p1hr.filter((item) => item.source_timestamp_hour == 12);
	let ms12 = msn12h.map((item) => item.meter_serial_number);
	arrh12 = msn12h.filter(({ meter_serial_number }, index) => !ms12.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[12], arr15to29len[12], arr30to44len[12], arrh12.length);

	let msn13h = p1hr.filter((item) => item.source_timestamp_hour == 13);
	let ms13 = msn13h.map((item) => item.meter_serial_number);
	arrh13 = msn13h.filter(({ meter_serial_number }, index) => !ms13.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[13], arr15to29len[13], arr30to44len[13], arrh13.length);

	let msn14h = p1hr.filter((item) => item.source_timestamp_hour == 14);
	let ms14 = msn14h.map((item) => item.meter_serial_number);
	arrh14 = msn14h.filter(({ meter_serial_number }, index) => !ms14.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[14], arr15to29len[14], arr30to44len[14], arrh14.length);

	let msn15h = p1hr.filter((item) => item.source_timestamp_hour == 15);
	let ms15 = msn15h.map((item) => item.meter_serial_number);
	arrh15 = msn15h.filter(({ meter_serial_number }, index) => !ms15.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[15], arr15to29len[15], arr30to44len[15], arrh15.length);

	let msn16h = p1hr.filter((item) => item.source_timestamp_hour == 16);
	let ms16 = msn16h.map((item) => item.meter_serial_number);
	arrh16 = msn16h.filter(({ meter_serial_number }, index) => !ms16.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[16], arr15to29len[16], arr30to44len[16], arrh16.length);

	let msn17h = p1hr.filter((item) => item.source_timestamp_hour == 17);
	let ms17 = msn17h.map((item) => item.meter_serial_number);
	arrh17 = msn17h.filter(({ meter_serial_number }, index) => !ms17.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[17], arr15to29len[17], arr30to44len[17], arrh17.length);

	let msn18h = p1hr.filter((item) => item.source_timestamp_hour == 18);
	let ms18 = msn18h.map((item) => item.meter_serial_number);
	arrh18 = msn18h.filter(({ meter_serial_number }, index) => !ms18.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[18], arr15to29len[18], arr30to44len[18], arrh18.length);

	let msn19h = p1hr.filter((item) => item.source_timestamp_hour == 19);
	let ms19 = msn19h.map((item) => item.meter_serial_number);
	arrh19 = msn19h.filter(({ meter_serial_number }, index) => !ms19.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[19], arr15to29len[19], arr30to44len[19], arrh19.length);

	let msn20h = p1hr.filter((item) => item.source_timestamp_hour == 20);
	let ms20 = msn20h.map((item) => item.meter_serial_number);
	arrh20 = msn20h.filter(({ meter_serial_number }, index) => !ms20.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[20], arr15to29len[20], arr30to44len[20], arrh20.length);

	let msn21h = p1hr.filter((item) => item.source_timestamp_hour == 21);
	let ms21 = msn21h.map((item) => item.meter_serial_number);
	arrh21 = msn21h.filter(({ meter_serial_number }, index) => !ms21.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[21], arr15to29len[21], arr30to44len[21], arrh21.length);

	let msn22h = p1hr.filter((item) => item.source_timestamp_hour == 22);
	let ms22 = msn22h.map((item) => item.meter_serial_number);
	arrh22 = msn22h.filter(({ meter_serial_number }, index) => !ms22.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[22], arr15to29len[22], arr30to44len[23], arrh22.length);

	let msn23h = p1hr.filter((item) => item.source_timestamp_hour == 23);
	let ms23 = msn23h.map((item) => item.meter_serial_number);
	arrh23 = msn23h.filter(({ meter_serial_number }, index) => !ms23.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[23], arr15to29len[23], arr30to44len[23], arrh23.length);

	return arrlen;
}

//All Phase HES Dashbord Instatntaneous Chart Data - New (27/04/2022)

export const fetchTodaysDataSyncInstantAllPhase = async () => {
	/* 1p here */
	//fetchTodaysDataSyncInstantSinglePhase();

	const res_1p = await http.get('/items/meter_instantaneous_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'source_timestamp,year(source_timestamp),month(source_timestamp),day(source_timestamp),hour(source_timestamp),minute(source_timestamp),meter_serial_number',
			sort: '-source_timestamp',
			limit: -1,
			access_token,
		},
	})
	// console.log("res_1p :- ", res_1p.data.data);
	let p1hr_1p = [];
	let p2hr_1p = [];
	let p3hr_1p = [];
	let p4hr_1p = [];
	for (let i = 0; i < res_1p?.data?.data?.length; i++) {

		var p1minute_1p = res_1p?.data?.data[i]?.source_timestamp_minute;

		var pmonth_1p = res_1p?.data?.data[i]?.source_timestamp_month;

		var p1hour_1p = res_1p?.data?.data[i]?.source_timestamp_hour;

		var ndata59_1p = null, ndata44_1p = null, ndata29_1p = null, ndata14_1p = null;

		//dividing api data into four array as per minute division criteria
		if (p1hour_1p >= 0 && p1hour_1p < 24) {
			if (p1minute_1p >= 59 && p1minute_1p >= 45) {
				ndata59_1p = {
					"source_timestamp_year": res_1p.data.data[i].source_timestamp_year, "source_timestamp_month": res_1p.data.data[i].source_timestamp_month,
					"source_timestamp_day": res_1p.data.data[i].source_timestamp_day, "source_timestamp_hour": res_1p.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res_1p.data.data[i].source_timestamp_minute, "meter_serial_number": res_1p.data.data[i].meter_serial_number,
				}
				if (ndata59_1p) {
					p1hr_1p.push(ndata59_1p);
				}
			}
			if (p1minute_1p <= 44 && p1minute_1p >= 30) {
				ndata44_1p = {
					"source_timestamp_year": res_1p.data.data[i].source_timestamp_year, "source_timestamp_month": res_1p.data.data[i].source_timestamp_month,
					"source_timestamp_day": res_1p.data.data[i].source_timestamp_day, "source_timestamp_hour": res_1p.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res_1p.data.data[i].source_timestamp_minute, "meter_serial_number": res_1p.data.data[i].meter_serial_number,
				}
				if (ndata44_1p) {
					p2hr_1p.push(ndata44_1p);
				}
			}
			if (p1minute_1p <= 29 && p1minute_1p >= 15) {
				ndata29_1p = {
					"source_timestamp_year": res_1p.data.data[i].source_timestamp_year, "source_timestamp_month": res_1p.data.data[i].source_timestamp_month,
					"source_timestamp_day": res_1p.data.data[i].source_timestamp_day, "source_timestamp_hour": res_1p.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res_1p.data.data[i].source_timestamp_minute, "meter_serial_number": res_1p.data.data[i].meter_serial_number,
				}
				if (ndata29_1p) {
					p3hr_1p.push(ndata29_1p);
				}
			}
			if (p1minute_1p < 15 && p1minute_1p >= 0) {
				ndata14_1p = {
					"source_timestamp_year": res_1p.data.data[i].source_timestamp_year, "source_timestamp_month": res_1p.data.data[i].source_timestamp_month,
					"source_timestamp_day": res_1p.data.data[i].source_timestamp_day, "source_timestamp_hour": res_1p.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res_1p.data.data[i].source_timestamp_minute, "meter_serial_number": res_1p.data.data[i].meter_serial_number,
				}
				if (ndata14_1p) {
					p4hr_1p.push(ndata14_1p);
				}
			}
		}
	}

	let arrh0_1p = [], arrh1_1p = [], arrh2_1p = [], arrh3_1p = [];
	var time_arr = [];
	var y_data_to_plot1phase = [];
	/* ------------------------------------------------------------------------------------------------ */
	let arrlen_1p = []
	let arrlen2_1p = []
	for (let i = 0; i < 24; i++) {
		//let arrlen1=[],arrlen2=[],arrlen3=[],arrlen4=[];
		let msn0h_1p = p1hr_1p.filter((item) => item.source_timestamp_hour == i);
		let msn1h_1p = p2hr_1p.filter((item) => item.source_timestamp_hour == i);
		let msn2h_1p = p3hr_1p.filter((item) => item.source_timestamp_hour == i);
		let msn3h_1p = p4hr_1p.filter((item) => item.source_timestamp_hour == i);
		//console.log(msn0h);
		let ms0_1p = msn0h_1p.map((item) => item.meter_serial_number);
		//console.log(ms0);
		let ms1_1p = msn1h_1p.map((item) => item.meter_serial_number);
		let ms2_1p = msn2h_1p.map((item) => item.meter_serial_number);
		let ms3_1p = msn3h_1p.map((item) => item.meter_serial_number);

		arrh0_1p = msn0h_1p.filter(({ meter_serial_number }, index) => !ms0_1p.includes(meter_serial_number, index + 1));
		arrh1_1p = msn1h_1p.filter(({ meter_serial_number }, index) => !ms1_1p.includes(meter_serial_number, index + 1));
		arrh2_1p = msn2h_1p.filter(({ meter_serial_number }, index) => !ms2_1p.includes(meter_serial_number, index + 1));
		arrh3_1p = msn3h_1p.filter(({ meter_serial_number }, index) => !ms3_1p.includes(meter_serial_number, index + 1));

		arrlen_1p.push(`${arrh3_1p.length},${i},15`, `${arrh2_1p.length},${i},30`, `${arrh1_1p.length},${i},45`, `${arrh0_1p.length},${i + 1},00`);
		arrlen2_1p.push(arrh3_1p.length, arrh2_1p.length, arrh1_1p.length, arrh0_1p.length);

	}
	// console.log(arrlen2);

	/* ------------------Y-axis data creation---------------------- */

	//console.log(arrlen2_1p,arrlen_1p);
	const minute_1p = res_1p?.data?.data ? res_1p?.data?.data[0].source_timestamp_minute : undefined;
	let hour_1p = res_1p?.data?.data ? res_1p?.data?.data[0].source_timestamp_hour : undefined;
	// console.log(hour_1p+""+minute_1p);
	var min_1p: string | number;
	if (minute_1p > 45 && minute_1p <= 59) {
		min_1p = '00';
		hour_1p += 1;
	}
	else if (minute_1p <= 45 && minute_1p > 30) {
		min_1p = 45;
	}
	else if (minute_1p <= 30 && minute_1p > 15) {
		min_1p = 30;
	}
	else if (minute_1p <= 15 && minute_1p > 0) {
		min_1p = 15;
	}
	let i_1p = 0;
	//console.log(p1hour_1p,min_1p);
	while (i_1p < arrlen_1p.length) {
		let arr_1p = arrlen_1p[i_1p].split(',');
		// console.log(arr_1p);
		if (arr_1p[1] == hour_1p && arr_1p[2] == min_1p) {
			break;
		}
		i_1p = i_1p + 1;
	}
	var pyear = res_1p?.data?.data[0]?.source_timestamp_year;
	var pday_1p = res_1p?.data?.data[0]?.source_timestamp_day;
	//console.log(i);
	/* let time_arr=[]; */
	let k_1p = i_1p;
	while (k_1p >= 0) {
		let arr_1p = arrlen_1p[k_1p].split(',');
		y_data_to_plot1phase.push(`${arr_1p[0]}`);
		time_arr.push(`${pyear}/${pmonth_1p}/${pday_1p} ${arr_1p[1]}:${arr_1p[2]}`);

		k_1p = k_1p - 1;
	}
	//console.log(time_arr);
	if (i_1p != 0) {
		for (let j = 95; j > i_1p; j--) {
			let arr2_1p = arrlen_1p[j].split(',');
			y_data_to_plot1phase.push(`${arr2_1p[0]}`);
			time_arr.push(`${pyear}/${pmonth_1p}/${pday_1p - 1} ${arr2_1p[1]}:${arr2_1p[2]} `);
		}

	}
	console.log("y_data_to_plot1phase",y_data_to_plot1phase);
	console.log("time_arr",time_arr);

	/* ---------------------------3p here --------------------------------- */

	const res = await http.get('/items/meter_instantaneous_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utilityid: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'source_timestamp,year(source_timestamp),month(source_timestamp),day(source_timestamp),hour(source_timestamp),minute(source_timestamp),meter_serial_number',

			sort: '-source_timestamp',
			limit: -1,
			access_token,
		},
	})

	const three_p = [];
	if(res.data.length > 0) {
		let p1hr = [];
		let p2hr = [];
		let p3hr = [];
		let p4hr = [];
		for (let i = 0; i < res?.data?.data?.length; i++) {

			var p1minute = res?.data?.data[i]?.source_timestamp_minute;

			var pmonth = res?.data?.data[i]?.source_timestamp_month;

			var p1hour = res?.data?.data[i]?.source_timestamp_hour;

			var ndata59 = null, ndata44 = null, ndata29 = null, ndata14 = null;
			var time = `${p1hour}:${p1minute}`;

			//dividing api data into four array as per minute division criteria
			if (p1hour >= 0 && p1hour < 24) {
				if (p1minute >= 59 && p1minute >= 45) {
					ndata59 = {
						"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
						"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
						"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
						"date": time,
						"custom_time": res.data.data[i].source_timestamp_day + "-" + res.data.data[i].source_timestamp_month + "-" + res.data.data[i].source_timestamp_year + " " + `${p1hour}:59`
					}
					if (ndata59) {
						p1hr.push(ndata59);
					}
				}
				if (p1minute <= 44 && p1minute >= 30) {
					ndata44 = {
						"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
						"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
						"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
					}
					if (ndata44) {
						p2hr.push(ndata44);
					}
				}
				if (p1minute <= 29 && p1minute >= 15) {
					ndata29 = {
						"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
						"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
						"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
					}
					if (ndata29) {
						p3hr.push(ndata29);
					}
				}
				if (p1minute < 15 && p1minute >= 0) {
					ndata14 = {
						"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
						"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
						"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
					}
					if (ndata14) {
						p4hr.push(ndata14);
					}
				}
			}
		}
		let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [];
		let arrlen = []
		let arrlen2 = []
		for (let i = 0; i < 24; i++) {
			//let arrlen1=[],arrlen2=[],arrlen3=[],arrlen4=[];
			let msn0h = p1hr.filter((item) => item.source_timestamp_hour == i);
			let msn1h = p2hr.filter((item) => item.source_timestamp_hour == i);
			let msn2h = p3hr.filter((item) => item.source_timestamp_hour == i);
			let msn3h = p4hr.filter((item) => item.source_timestamp_hour == i);
			//console.log(msn0h);
			let ms0 = msn0h.map((item) => item.meter_serial_number);
			//console.log(ms0);
			let ms1 = msn1h.map((item) => item.meter_serial_number);
			let ms2 = msn2h.map((item) => item.meter_serial_number);
			let ms3 = msn3h.map((item) => item.meter_serial_number);

			arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index + 1));
			arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1));
			arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1));
			arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1));
			arrh0.push(`${arrh0.length}`);

			arrlen.push(`${arrh3.length},${i},15`, `${arrh2.length},${i},30`, `${arrh1.length},${i},45`, `${arrh0.length},${i + 1},00`);
			arrlen2.push(arrh3.length, arrh2.length, arrh1.length, arrh0.length);
		}
		//console.log(arrlen2);

		/* ------------------Y-axis data creation---------------------- */

		//console.log(arrlen2,arrlen)
		var y_data_to_plot = [];
		var time_arr_1 = [];
		let minute = res?.data?.data.length > 0 ? res?.data?.data[0].source_timestamp_minute : undefined;
		let hour = res?.data?.data.length > 0 ? res?.data?.data[0].source_timestamp_hour : undefined;
		// console.log(hour);
		var min: string | number;
		if (minute > 45 && minute <= 59) {
			min = '00';
			hour += 1;
		}
		else if (minute <= 45 && minute > 30) {
			min = 45;
		}
		else if (minute <= 30 && minute > 15) {
			min = 30;
		}
		else if (minute <= 15 && minute > 0) {
			min = 15;
		}
		let i = 0;
		//console.log(p1hour,min);
		while (i < arrlen.length) {
			let arr = arrlen[i].split(',');
			if (arr[1] == p1hour && arr[2] == min) {
				break;
			}
			i = i + 1;
		}
		var pyear = res?.data?.data[0]?.source_timestamp_year;
		var pday = res?.data?.data[i]?.source_timestamp_day;
		// console.log(i);
		/* let time_arr=[]; */
		let k = i;
		while (k >= 0) {
			let arr = arrlen[k].split(',');
			y_data_to_plot.push(`${arr[0]}`);
			// time_arr.push(`${pyear}/${pmonth}/${pday} ${arr[1]}:${arr[2]}`);
			k = k - 1;
		}
		//console.log(time_arr);
		if (i != 0) {
			for (let j = 95; j > i; j--) {
				let arr2 = arrlen[j].split(',');
				y_data_to_plot.push(`${arr2[0]}`);
				// time_arr.push(`${pyear}/${pmonth}/${pday-1} ${arr2[1]}:${arr2[2]} `);
			}
		}
		console.log("y_data_to_plot",y_data_to_plot);
		console.log("y_data_to_plot1phase", y_data_to_plot1phase);
		
		/* ---------------------------------3p ends here----------------------------- */
		
		for (let m = 0; m < 96; m++) {
			three_p[m] = parseInt(y_data_to_plot[m]) + parseInt(y_data_to_plot1phase[m]);
		}
		console.log("time_arr :- ",time_arr);
		console.log("three_p :- ", three_p);
		/* ---------------Plotting graph--------------- */
	}
	
	return {
		x: time_arr,
		y: three_p.length > 0 ? three_p : y_data_to_plot1phase,
	}

}
// ------------End------------

/*     Instant Single Phase   Pranjali 04/05/22  */

//Single Phase HES Dashbord Instatntaneous Chart Data - New (27/04/2022)

export const fetchTodaysDataSyncInstantSinglePhase = async () => {

	const res = await http.get('/items/meter_instantaneous_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'source_timestamp,year(source_timestamp),month(source_timestamp),day(source_timestamp),hour(source_timestamp),minute(source_timestamp),meter_serial_number',

			sort: '-source_timestamp',
			limit: -1,
			access_token,
		},
	})

	let p1hr = [];
	let p2hr = [];
	let p3hr = [];
	let p4hr = [];
	for (let i = 0; i < res?.data?.data?.length; i++) {

		var p1minute = res?.data?.data[i]?.source_timestamp_minute;

		var pmonth = res?.data?.data[i]?.source_timestamp_month;

		var p1hour = res?.data?.data[i]?.source_timestamp_hour;

		var ndata59 = null, ndata44 = null, ndata29 = null, ndata14 = null;
		var time = `${p1hour}:${p1minute}`;


		//dividing api data into four array as per minute division criteria
		if (p1hour >= 0 && p1hour < 24) {
			if (p1minute >= 59 && p1minute >= 45) {
				ndata59 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
					"date": time,
					"custom_time": res.data.data[i].source_timestamp_day + "-" + res.data.data[i].source_timestamp_month + "-" + res.data.data[i].source_timestamp_year + " " + `${p1hour}:59`
				}
				if (ndata59) {
					p1hr.push(ndata59);
				}
			}
			if (p1minute <= 44 && p1minute >= 30) {
				ndata44 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
				}
				if (ndata44) {
					p2hr.push(ndata44);
				}
			}
			if (p1minute <= 29 && p1minute >= 15) {
				ndata29 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
				}
				if (ndata29) {
					p3hr.push(ndata29);
				}
			}
			if (p1minute < 15 && p1minute >= 0) {
				ndata14 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
				}
				if (ndata14) {
					p4hr.push(ndata14);
				}
			}
		}
	}

	let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [];
	var pyear = res?.data?.data[0]?.source_timestamp_year;
	var time_arr = [];
	var y_data_to_plot1phase = [];
	/* ------------------------------------------------------------------------------------------------ */
	let arrlen = []
	let arrlen2 = []
	//let arrlen1=[],arrlen2=[],arrlen3=[],arrlen4=[];
	for (let i = 0; i < 24; i++) {
		//let arrlen1=[],arrlen2=[],arrlen3=[],arrlen4=[];
		let msn0h = p1hr.filter((item) => item.source_timestamp_hour == i);
		let msn1h = p2hr.filter((item) => item.source_timestamp_hour == i);
		let msn2h = p3hr.filter((item) => item.source_timestamp_hour == i);
		let msn3h = p4hr.filter((item) => item.source_timestamp_hour == i);
		//console.log(msn0h);
		let ms0 = msn0h.map((item) => item.meter_serial_number);
		//console.log(ms0);
		let ms1 = msn1h.map((item) => item.meter_serial_number);
		let ms2 = msn2h.map((item) => item.meter_serial_number);
		let ms3 = msn3h.map((item) => item.meter_serial_number);

		arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index + 1));
		arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1));
		arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1));
		arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1));
		arrh0.push(`${arrh0.length}`);

		arrlen.push(`${arrh3.length},${i},15`, `${arrh2.length},${i},30`, `${arrh1.length},${i},45`, `${arrh0.length},${i + 1},00`);
		arrlen2.push(arrh3.length, arrh2.length, arrh1.length, arrh0.length);

	}
	//console.log(arrlen2);

	/* ------------------Y-axis data creation---------------------- */

	//console.log(arrlen2,arrlen)

	const minute = res.data.data[0].source_timestamp_minute;
	let hour = res?.data?.data[0].source_timestamp_hour;

	// console.log(hour,minute);
	var min;
	if (minute > 45 && minute <= 59) {
		min = '00';
		hour += 1;
	}
	else if (minute <= 45 && minute > 30) {
		min = 45;
	}
	else if (minute <= 30 && minute > 15) {
		min = 30;
	}
	else if (minute <= 15 && minute > 0) {
		min = 15;
	}
	let i = 0;

	//console.log(hour,min);
	while (i < arrlen.length) {
		let arr = arrlen[i].split(',');

		if (arr[1] == hour && arr[2] == min) {

			break;
		}

		i = i + 1;
	}
	//console.log(res?.data?.data[0]);
	var pday = res?.data?.data[0]?.source_timestamp_day;
	//console.log(i);
	/* let time_arr=[]; */
	let k = i;
	while (k >= 0) {
		let arr = arrlen[k].split(',');
		y_data_to_plot1phase.push(`${arr[0]}`);
		time_arr.push(`${pyear}/${pmonth}/${pday} ${arr[1]}:${arr[2]}`);

		k = k - 1;
	}
	// console.log(y_data_to_plot);
	if (i != 0) {
		for (let j = 95; j > i; j--) {
			let arr2 = arrlen[j].split(',');
			y_data_to_plot1phase.push(`${arr2[0]}`);
			time_arr.push(`${pyear}/${pmonth}/${pday - 1} ${arr2[1]}:${arr2[2]}`);
		}


	}

	// console.log(time_arr);
	// console.log(y_data_to_plot1phase);
	// console.log(time_arr);
	return {
		x: time_arr,
		// x: newDate,
		y: y_data_to_plot1phase,
	}
}


// ------------End------------

/* -------------------------------------------------------------- */



//Three Phase HES Dashbord Instatntaneous Chart Data - New (27/04/2022)
export const fetchTodaysDataSyncInstantThreePhase = async () => {
	const res = await http.get('/items/meter_instantaneous_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utilityid: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'source_timestamp,year(source_timestamp),month(source_timestamp),day(source_timestamp),hour(source_timestamp),minute(source_timestamp),meter_serial_number',

			sort: '-source_timestamp',
			limit: -1,
			access_token,
		},
	})
	// console.log(res?.data?.data);
	let p1hr = [];
	let p2hr = [];
	let p3hr = [];
	let p4hr = [];
	for (let i = 0; i < res?.data?.data?.length; i++) {

		var p1minute = res?.data?.data[i]?.source_timestamp_minute;

		var pmonth = res?.data?.data[i]?.source_timestamp_month;

		var p1hour = res?.data?.data[i]?.source_timestamp_hour;

		var ndata59 = null, ndata44 = null, ndata29 = null, ndata14 = null;
		// var time=`${p1hour}:${p1minute}`;


		//dividing api data into four array as per minute division criteria
		if (p1hour >= 0 && p1hour < 24) {
			if (p1minute >= 59 && p1minute >= 45) {
				ndata59 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,
					// "date":time,
					"custom_time": res.data.data[i].source_timestamp_day + "-" + res.data.data[i].source_timestamp_month + "-" + res.data.data[i].source_timestamp_year + " " + `${p1hour}:59`

				}
				if (ndata59) {
					p1hr.push(ndata59);
				}

			}
			if (p1minute <= 44 && p1minute >= 30) {
				ndata44 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,

				}
				if (ndata44) {
					p2hr.push(ndata44);
				}

			}
			if (p1minute <= 29 && p1minute >= 15) {
				ndata29 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,

				}
				if (ndata29) {
					p3hr.push(ndata29);
				}

			}
			if (p1minute < 15 && p1minute >= 0) {
				ndata14 = {
					"source_timestamp_year": res.data.data[i].source_timestamp_year, "source_timestamp_month": res.data.data[i].source_timestamp_month,
					"source_timestamp_day": res.data.data[i].source_timestamp_day, "source_timestamp_hour": res.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res.data.data[i].source_timestamp_minute, "meter_serial_number": res.data.data[i].meter_serial_number,

				}
				if (ndata14) {
					p4hr.push(ndata14);
				}

			}


		}
	}

	let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [];
	var pyear = res?.data?.data[0]?.source_timestamp_year;
	var time_arr = [];
	var y_data_to_plot1phase = [];
	/* ------------------------------------------------------------------------------------------------ */
	let arrlen = []
	let arrlen2 = []
	//let arrlen1=[],arrlen2=[],arrlen3=[],arrlen4=[];
	for (let i = 0; i < 24; i++) {
		//let arrlen1=[],arrlen2=[],arrlen3=[],arrlen4=[];
		let msn0h = p1hr.filter((item) => item.source_timestamp_hour == i);
		let msn1h = p2hr.filter((item) => item.source_timestamp_hour == i);
		let msn2h = p3hr.filter((item) => item.source_timestamp_hour == i);
		let msn3h = p4hr.filter((item) => item.source_timestamp_hour == i);
		//console.log(msn0h);
		let ms0 = msn0h.map((item) => item.meter_serial_number);
		//console.log(ms0);
		let ms1 = msn1h.map((item) => item.meter_serial_number);
		let ms2 = msn2h.map((item) => item.meter_serial_number);
		let ms3 = msn3h.map((item) => item.meter_serial_number);

		arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index + 1));
		arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1));
		arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1));
		arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1));
		arrh0.push(`${arrh0.length}`);

		arrlen.push(`${arrh3.length},${i},15`, `${arrh2.length},${i},30`, `${arrh1.length},${i},45`, `${arrh0.length},${i + 1},00`);
		arrlen2.push(arrh3.length, arrh2.length, arrh1.length, arrh0.length);

	}
	// console.log(arrlen2);

	/* ------------------Y-axis data creation---------------------- */

	//console.log(arrlen2,arrlen)


	const minute = res.data.data[0].source_timestamp_minute;
	let hour = res?.data?.data[0].source_timestamp_hour;

	// console.log(hour,minute);
	var min;

	if (minute > 45 && minute <= 59) {
		hour += 1;
		min = '00';


	}
	else if (minute <= 45 && minute > 30) {

		min = 45;

	}
	else if (minute <= 30 && minute > 15) {
		min = 30;

	}
	else if (minute <= 15 && minute > 0) {
		min = 15;

	}
	let i = 0;

	// console.log(hour,min);
	while (i < arrlen.length) {
		let arr = arrlen[i].split(',');

		if (arr[1] == hour && arr[2] == min) {

			break;
		}

		i = i + 1;
	}
	//console.log(res?.data?.data[0]);
	var pday = res?.data?.data[0]?.source_timestamp_day;
	//console.log(i);
	/* let time_arr=[]; */
	let k = i;
	while (k >= 0) {
		let arr = arrlen[k].split(',');
		y_data_to_plot1phase.push(`${arr[0]}`);
		time_arr.push(`${pyear}/${pmonth}/${pday} ${arr[1]}:${arr[2]}`);

		k = k - 1;
	}
	//console.log(y_data_to_plot);
	if (i != 0) {
		for (let j = 95; j > i; j--) {
			let arr2 = arrlen[j].split(',');
			y_data_to_plot1phase.push(`${arr2[0]}`);
			time_arr.push(`${pyear}/${pmonth}/${pday - 1} ${arr2[1]}:${arr2[2]}`);
		}


	}

	console.log(time_arr);
	console.log(y_data_to_plot1phase);


	//console.log(time_arr);
	return {
		x: time_arr,
		// x: newDate,
		y: y_data_to_plot1phase,
	}
}



/*------------------------------------------------------------------------------------  */


// ------------End------------



//Single Phase HES Dashbord Instatntaneous Chart Data old
export const fetchTodaysDataSyncInstantSingle = async () => {
	const res = await http.get('/items/meter_instantaneous_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})

	const xaxisNumbers = new Array(24)
		.fill(0)
		.map((_, index) => {
			return [0, 15, 30, 45].map((minute) => `${index}:${minute}`)
		})
		.flat()

	const chartDataHourly = res?.data?.data?.filter(
		(item) =>
			item.server_timestamp_minute === 0 ||
			item.servere_timestamp_minute === 15 ||
			item.server_timestamp_minute === 30 ||
			item.server_timestamp_minute === 45
	)

	// const data = xaxisNumbers
	// 	.map((num) => {
	// 		const res = chartDataHourly.find(
	// 			(item) =>
	// 				`${item.server_timestamp_hour}:${item.server_timestamp_minute}` ===
	// 				num
	// 		)
	// 		return res
	// 			? res
	// 			: {
	// 				server_timestamp_hour: num.split(':')[0],
	// 				server_timestamp_minute: num.split(':')[1],
	// 				countDistinct: {
	// 					meter_serial_number: 0,
	// 				},
	// 			}
	// 	})
	// 	.map((item) => item?.countDistinct.meter_serial_number)

	const arrdata = [];
	xaxisNumbers
		.map((num) => {
			const res1 = chartDataHourly.filter((item) =>
				`${item.server_timestamp_hour}:${item.server_timestamp_minute}` === num
			)

			if (res1.length !== 0) {
				arrdata.push(res1[0]);
			}
			// const res = chartDataHourly.find(
			// 	(item) =>
			// 		`${item.source_timestamp_hour}:${item.source_timestamp_minute}` ===
			// 		num
			// )
			// return res
			// 	? res
			// 	: {
			// 		source_timestamp_hour: num.split(':')[0],
			// 		source_timestamp_minute: num.split(':')[1],
			// 		countDistinct: {
			// 			meter_serial_number: 0,
			// 		},
			// 	}
		})
	const data = arrdata.map((item) => item?.countDistinct.meter_serial_number)
	// console.log("datata -> ",data)

	return {
		x: new Array(24)
			.fill(0)
			.map((_, i) => i)
			.map((item) => {
				const date = format(
					sub(new Date(), { hours: item }) as any,
					'dd-MM hh:mm:a'
				)
				return date
			}),
		y: data,
	}
}


/* ---------------------------------------------------------------------------------- */

//Three Phase HES Dashboard Instatntaneous Chart Data old
export const fetchTodaysDataSyncInstantThree = async () => {
	const res = await http.get('/items/meter_instantaneous_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ server_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utilityid: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(server_timestamp),minute(server_timestamp)',
			'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-hour(server_timestamp)',
			limit: -1,
			access_token,
		},
	})
	// console.log("fashdjfhdj",res.data.data)

	const xaxisNumbers = new Array(24)
		.fill(0)
		.map((_, index) => {
			return [0, 15, 30, 45].map((minute) => `${index}:${minute}`)
		})
		.flat()

	const chartDataHourly = res?.data?.data?.filter(
		(item) =>
			item.server_timestamp_minute === 0 ||
			item.server_timestamp_minute === 15 ||
			item.server_timestamp_minute === 30 ||
			item.server_timestamp_minute === 45
	)

	// const data = xaxisNumbers
	// 	.map((num) => {
	// 		const res = chartDataHourly.find(
	// 			(item) =>
	// 				`${item.source_timestamp_hour}:${item.source_timestamp_minute}` ===
	// 				num
	// 		)
	// 		return res
	// 			? res
	// 			: {
	// 				source_timestamp_hour: num.split(':')[0],
	// 				source_timestamp_minute: num.split(':')[1],
	// 				countDistinct: {
	// 					meter_serial_number: 0,
	// 				},
	// 			}
	// 	})
	// 	.map((item) => item?.countDistinct.meter_serial_number)

	const arrdata = [];
	xaxisNumbers
		.map((num) => {
			const res1 = chartDataHourly.filter((item) =>
				`${item.server_timestamp_hour}:${item.server_timestamp_minute}` === num
			)

			if (res1.length !== 0) {
				arrdata.push(res1[0]);
			}
			// const res = chartDataHourly.find(
			// 	(item) =>
			// 		`${item.source_timestamp_hour}:${item.source_timestamp_minute}` ===
			// 		num
			// )
			// return res
			// 	? res
			// 	: {
			// 		source_timestamp_hour: num.split(':')[0],
			// 		source_timestamp_minute: num.split(':')[1],
			// 		countDistinct: {
			// 			meter_serial_number: 0,
			// 		},
			// 	}
		})
	const data = arrdata.map((item) => item?.countDistinct.meter_serial_number)
	// console.log("datata -> ",data)

	return {
		x: new Array(24)
			.fill(0)
			.map((_, i) => i)
			.map((item) => {
				const date = format(
					sub(new Date(), { hours: item }) as any,
					'dd-MM hh:mm:a'
				)
				return date
			}),
		y: data,
	}
}


//All phase data(not in working)
export const fetchPower24 = async () => {
	const res = await http.get('/items/daywise_meter_data', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'hour(source_timestamp),source_timestamp',
			'aggregate[sum]': 'KWh',
			limit: -1,
			access_token,
		},
	})

	const groupedData: any[] = Object.values(
		_.groupBy(res.data.data, 'source_timestamp_hour')
	)

	const values = groupedData?.map((item) => ({
		value: item.reduce((acc, curr) => acc + curr.sum.KWh, 0),
		timestamp: item[item.length - 1]?.source_timestamp,
	}))

	return groupedData
		?.map(
			(item: any) => new Date(parseISO(item[item.length - 1]?.source_timestamp))
		)
		.sort(compareAsc)
		.map((item) => formatISO(item).slice(0, -6))
		?.map((item) => {
			const timeValue = add5Hr30Min(item)
			return {
				value: values?.find((value) => value.timestamp === item)?.value,
				timestamp:
					timeValue.slice(0, 5) +
					' ' +
					timeValue.slice(10, -6) +
					':00:' +
					timeValue.slice(-2) ?? '00',
			}
		})
		.reverse()
}

//Power Consumption 24 hours All Phase(PowerConsumptionAllPhase - Power consumption in KWH)
export const fetchPower24all = async () => {

	const res3p = await http.get('/items/meter_block_load_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'sort': '-hour(source_timestamp)',
			'groupBy[]': 'hour(source_timestamp),source_timestamp',
			'aggregate[sum]': 'block_energy_Wh_import',
			limit: -1,
			access_token,
		},
	})

	const res1p = await http.get('/items/meter_block_load_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'sort': '-hour(source_timestamp)',
			'groupBy[]': 'hour(source_timestamp),source_timestamp',
			'aggregate[sum]': 'block_energy_kWh_import',
			limit: -1,
			access_token,
		},
	})

	let result = (res1p.data.data)
	let allSum = 0;
	let _newArr = [];
	console.log("1p data", result)
	console.log("3p data", res3p.data.data)

	result.map(function (key, value) {
		// console.log("3p data result : ",res3p.data.data[value].sum.block_energy_Wh_import)
		if (res3p.data.data.length > 0) {
			allSum = res3p.data.data[value].sum.block_energy_Wh_import;
		} else {
			allSum = 0;
		}

		_newArr.push({
			"source_timestamp": key.source_timestamp,
			"source_timestamp_hour": key.source_timestamp_hour,
			"sum": {
				"block_energy_kWh_import": key.sum.block_energy_kWh_import + allSum
			}
		})
	})
	// console.log("Array ",_newArr)

	const groupedData: any[] = Object.values(
		// _.groupBy(res1p.data.data, 'source_timestamp_hour')
		_.groupBy(_newArr, 'source_timestamp_hour')
	)
	// console.log("All GroupData : ",groupedData)

	const values = groupedData?.map((item) => ({
		value: item.reduce((acc, curr) => acc + curr.sum.block_energy_kWh_import, 0),
		timestamp: item[item.length - 1]?.source_timestamp,
	}))
	// console.log("All values : ",values)

	return groupedData
		?.map(
			(item: any) => new Date(parseISO(item[item.length - 1]?.source_timestamp))
		)
		.sort(compareAsc)
		.map((item) => formatISO(item).slice(0, -6))
		?.map((item) => {
			const timeValue = add5Hr30Min(item)
			return {
				value: values?.find((value) => value.timestamp === item)?.value,
				timestamp:
					timeValue.slice(0, 5) +
					' ' +
					timeValue.slice(10, -6) +
					':00:' +
					timeValue.slice(-2) ?? '00',
			}
		})
		.reverse()
}


// Power Consumption 24 hours Single pahse(PowerConsumptionSinglePhase - Power consumption in KWH)
export const fetchPower24single = async () => {
	const res = await http.get('/items/meter_block_load_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'sort': '-hour(source_timestamp)',
			'groupBy[]': 'hour(source_timestamp),source_timestamp',
			'aggregate[sum]': 'block_energy_kWh_import',
			limit: -1,
			access_token,
		},


		/* https://ibotapp.azure-api.net/mdmsquery/items/meter_dailyload_profile_single_phase?access_token=1234&filter=
{"_and":
[
{"source_timestamp":{"_between":["2022-05-01 00:00:00","2022-05-31 23:59:59"]}}, {"utility_id":{"_eq":"4"}}
] }
&aggregate[sum]=energy_kwh_import&groupBy[]=day(source_timestamp),month(source_timestamp),year(source_timestamp)&sort=day(source_timestamp)
 */
	})

	const groupedData: any[] = Object.values(
		_.groupBy(res.data.data, 'source_timestamp_hour')
	)

	const values = groupedData?.map((item) => ({
		value: item.reduce((acc, curr) => acc + curr.sum.block_energy_kWh_import, 0),
		timestamp: item[item.length - 1]?.source_timestamp,
	}))

	return groupedData
		?.map(
			(item: any) => new Date(parseISO(item[item.length - 1]?.source_timestamp))
		)
		.sort(compareAsc)
		.map((item) => formatISO(item).slice(0, -6))
		?.map((item) => {
			const timeValue = add5Hr30Min(item)
			return {
				value: values?.find((value) => value.timestamp === item)?.value,
				timestamp:
					timeValue.slice(0, 5) +
					' ' +
					timeValue.slice(10, -6) +
					':00:' +
					timeValue.slice(-2) ?? '00',
			}
		})
		.reverse()
}


// Power Consumption 24 hours Third phase(PowerConsumptionThreePhase - Power consumption in KWH)
export const fetchPower24third = async () => {
	const res = await http.get('/items/meter_block_load_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'sort': '-hour(source_timestamp)',
			'groupBy[]': 'hour(source_timestamp),source_timestamp',
			'aggregate[sum]': 'block_energy_Wh_import',
			limit: -1,
			access_token,
		},
	})

	const groupedData: any[] = Object.values(
		_.groupBy(res.data.data, 'source_timestamp_hour')
	)

	const values = groupedData?.map((item) => ({
		value: item.reduce((acc, curr) => acc + curr.sum.block_energy_Wh_import, 0),
		timestamp: item[item.length - 1]?.source_timestamp,
	}))

	return groupedData
		?.map(
			(item: any) => new Date(parseISO(item[item.length - 1]?.source_timestamp))
		)
		.sort(compareAsc)
		.map((item) => formatISO(item).slice(0, -6))
		?.map((item) => {
			const timeValue = add5Hr30Min(item)
			return {
				value: values?.find((value) => value.timestamp === item)?.value,
				timestamp:
					timeValue.slice(0, 5) +
					' ' +
					timeValue.slice(10, -6) +
					':00:' +
					timeValue.slice(-2) ?? '00',
			}
		})
		.reverse()
}

//ALL PHASE Power Consumption(Today) - not in working
export const fetchPowerConsumptionOfADay = async ({
	date,
	range,
}: {
	date?: any
	range: boolean
}) => {
	const addOneDay = add(new Date(date), { days: 1 })
	const todayFrom = format(
		set(new Date(addOneDay), { hours: 0, minutes: 0, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)
	const todayTo = format(
		set(new Date(addOneDay), { hours: 23, minutes: 59, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)

	if (range) {
		const res = await http.get('/items/meter_daily_load_data', {
			params: {
				filter: {
					_and: [
						{ source_timestamp: { _between: [todayFrom, todayTo] } },
						{ utility_id: { _eq: utilityId } },
					],
				},
				'aggregate[sum]': 'energy_wh_import',
				'groupBy[]': 'date',
				sort: '-date',
				access_token,
			},
		})

		return {
			data: res.data.data?.reduce(
				(acc, curr) => acc + curr.sum?.energy_wh_import,
				0
			),
		}
	}

	const res = await http.get('/items/daywise_meter_data', {
		params: {
			filter: {
				_and: [{ date_consumption: { _eq: date } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'KWh',
			access_token,
		},
	})
	return {
		data: res.data.data[0]?.sum.KWh,
	}
}


//ALL PHASE Power Consumption(Today)
export const fetchPowerConsumptionOfADayAll = async ({
	date,
	range,
}: {
	date?: any
	range: boolean
}) => {
	const addOneDay = add(new Date(date), { days: 0 })
	const todayFrom = format(
		set(new Date(addOneDay), { hours: 0, minutes: 0, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)
	const todayTo = format(
		set(new Date(addOneDay), { hours: 23, minutes: 59, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)

	if (range) {
		const res11p = await http.get('/items/meter_dailyload_profile_single_phase', {
			params: {
				filter: {
					_and: [
						{ source_timestamp: { _between: [todayFrom, todayTo] } },
						{ utility_id: { _eq: utilityId } },
					],
				},
				'aggregate[sum]': 'energy_kwh_import',
				access_token,
			},
		})
		// console.log("res11plllllllllll -> ",res11p)

		const res33p = await http.get('/items/meter_dailyload_profile_three_phase', {
			params: {
				filter: {
					_and: [
						{ source_timestamp: { _between: [todayFrom, todayTo] } },
						{ utility_id: { _eq: utilityId } },
					],
				},
				'aggregate[sum]': 'energy_wh_import',
				access_token,
			},
		})
		// console.log("res11plllllllllll -> ",res33p)

		// console.log("asdfdsf -- ",res1p)

		// return {
		// 	data1p: res1p.data.data,
		// 	// data3p: res3p.data.data
		// 	// .reduce(
		// 	// 	(acc, curr) => acc + curr.sum?.energy_kwh_import,
		// 	// 	0
		// 	// ),
		// }		
	}

	const res1p = await http.get('/items/meter_block_load_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [todayFrom, todayTo] } },
					{ utility_id: { _eq: utilityId } }
				],
			},
			'aggregate[sum]': 'block_energy_kWh_import',
			access_token,
		},
	})
	console.log("data 1p ---- ", res1p)

	const res3p = await http.get('/items/meter_block_load_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [todayFrom, todayTo] } },
					{ utility_id: { _eq: utilityId } }
				],
			},
			'aggregate[sum]': 'block_energy_Wh_import',
			access_token,
		},
	})
	// console.log("data 3p ---- ",(res1p.data.data[0]?.sum.block_energy_kWh_import + res3p.data.data[0]?.sum.block_energy_Wh_import))
	let response = res1p.data.data[0]?.sum.block_energy_kWh_import + res3p.data.data[0].sum.block_energy_Wh_import;


	return {
		data: response
	}
	// return {
	// 	data: res1p.data.data[0]?.sum.block_energy_kWh_import,
	// }
}


//SINGLE PHASE(Today)
export const fetchPowerConsumptionOfADaySingle = async ({
	date,
	range,
}: {
	date?: any
	range: boolean
}) => {
	const addOneDay = add(new Date(date), { days: 0 })
	const todayFrom = format(
		set(new Date(addOneDay), { hours: 0, minutes: 0, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)
	const todayTo = format(
		set(new Date(addOneDay), { hours: 23, minutes: 59, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)

	if (range) {
		const res = await http.get('/items/meter_dailyload_profile_single_phase', {
			params: {
				filter: {
					_and: [
						{ source_timestamp: { _between: [todayFrom, todayTo] } },
						{ utility_id: { _eq: utilityId } },
					],
				},
				'aggregate[sum]': 'energy_kwh_import',
				access_token,
			},
		})

		return {
			data: res.data.data?.reduce(
				(acc, curr) => acc + curr.sum?.energy_kwh_import,
				0
			),
		}
	}

	const res = await http.get('/items/meter_block_load_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [todayFrom, todayTo] } },
					{ utility_id: { _eq: utilityId } }
				],
			},
			'aggregate[sum]': 'block_energy_kWh_import',
			access_token,
		},
	})
	return {
		data: res.data.data[0]?.sum.block_energy_kWh_import,
	}
}

//THIRD PHASE(Today)
export const fetchPowerConsumptionOfADayThird = async ({
	date,
	range,
}: {
	date?: any
	range: boolean
}) => {
	const addOneDay = add(new Date(date), { days: 0 })
	const todayFrom = format(
		set(new Date(addOneDay), { hours: 0, minutes: 0, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)
	const todayTo = format(
		set(new Date(addOneDay), { hours: 23, minutes: 59, seconds: 0 }),
		'yyyy-MM-dd HH:mm:ss'
	)

	if (range) {
		const res = await http.get('/items/meter_dailyload_profile_three_phase', {
			params: {
				filter: {
					_and: [
						{ source_timestamp: { _between: [todayFrom, todayTo] } },
						{ utility_id: { _eq: utilityId } },
					],
				},
				'aggregate[sum]': 'energy_wh_import',
				access_token,
			},
		})

		//return res

		return {
			data: res.data.data?.reduce(
				(acc, curr) => acc + curr.sum?.energy_wh_import,
				0
			),
		}
	}

	const res = await http.get('/items/meter_block_load_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [todayFrom, todayTo] } },
					{ utility_id: { _eq: utilityId } }
				],
			},
			'aggregate[sum]': 'block_energy_Wh_import',
			access_token,
		},
	})
	return {
		data: res.data.data[0]?.sum.block_energy_Wh_import,
	}
}


export const fetchLatestTimeForPowerConsumption = async () => {
	return http.get('/items/daywise_meter_data', {
		params: {
			sort: '-server_timestamp',
			limit: 1,
			fields: 'server_timestamp',
			access_token,
		},
	})
}

export const fetchLatestTimeForPowerConsumptionSingle = async () => {

	const res = await http.get('/items/meter_block_load_profile_single_phase', {
		params: {
			sort: '-server_timestamp',
			limit: 1,
			fields: 'server_timestamp',
			access_token,
		},
	})
	const date = res?.data?.data[0]?.server_timestamp
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})
	// console.log("lkasdfsnklsdf-------------data",res)yyyy-MM-dd HH:mm:ss
	return format(addedDate, 'dd/MM/yyyy HH:mm:ss')
}

export const fetchLatestTimeForPowerConsumptionThird = async () => {

	const res = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			sort: '-server_timestamp',
			limit: 1,
			fields: 'server_timestamp',
			access_token,
		},
	})
	const date = res?.data?.data[0]?.server_timestamp
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})
	return format(addedDate, "dd/MM/yyyy HH:mm:ss")
}


//All Phase - not in working
export const fetchPowerConsumptionOf30Days = async () => {
	return http.get('/items/meter_daily_load_data', {
		params: {
			filter: {
				_and: [{ date: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'date',
		},
	})
}

//Single Phase
export const fetchPowerConsumptionOf30DaysSingleTimeStamp = async () => {
	const res = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			sort: '-source_timestamp',
			limit: 1,
			fields: 'day(source_timestamp)',
			access_token,
		},
	})
	// console.log("999999999999999999999999999",res)



	/* 	const date = res?.data?.data[0]?.day(source_timestamp);
		console.log(date);
		const addedDate = add(new Date(date), {
			hours: 5,
			minutes: 30,
		}) */
	const date_array = [];

	for (let i = 0; i < res?.data?.data.length; i++) {
		var day = res?.data?.data[i]?.source_timestamp_day;
		var month = res?.data?.data[i]?.source_timestamp_month;
		var year = res?.data?.data[i]?.source_timestamp_hour;

		date_array.push(`${day}/${month}/${year}`);
	}
	// console.log("/1/1/1/1//1/1/1/1/1/1/",date_array)
	return date_array;
}

//Last 30 days All Phase(Last 30 Days)
export const fetchPowerConsumptionOf30DaysAll = async () => {
	// meter_dailyload_profile_three_phase
	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),source_date',
			'sort': 'source_timestamp',
		},
	})
	// console.log("Last 30 Days 3p :- ",res3p.data.data)
	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),source_date',
			'sort': 'source_timestamp',
		},
	})
	// console.log("Last 30 Days 1p :- ",res1p)
	// let result = (res1p.data.data);
	// let allSum = 0;
	// let _newArr = [];
	let pk = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = res1p.data.data[i].source_date;
		pk[key] = 0;
	}
	//    console.log("++++++++++++++++++++++++",pk);
	let day_time = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = i
		day_time[key] = (res1p.data.data[i].source_timestamp_day);
	}
	// console.log("day_time  ===========",day_time)
	let p1 = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = res1p.data.data[i].source_date;
		p1[key] = res1p.data.data[i].sum.energy_kwh_import;
	}
	// console.log("bbbbbbbbbbbbbbbbbbbbbbbbb",p1);
	let p3 = [];
	for (let i = 0; i < res3p.data.data.length; i++) {
		let key = res3p.data.data[i].source_date;
		p3[key] = res3p.data.data[i].sum.energy_wh_import;
	}
	// console.log("pppppppppppppppppppppppppppp",p3);
	let p1_data = [];
	p1_data = { ...pk, ...p1 }
	let p3_data = [];
	p3_data = { ...pk, ...p3 }
	// console.log("p3 data **************",p3_data)
	// console.log("P1 data **************",p1_data)
	var d1 = Object.values(p1_data);
	var d3 = Object.values(p3_data);
	var d4 = Object.keys(pk);
	var d5 = day_time;
	var com_data = []
	for (let i = 0; i < d1.length; i++) {
		com_data[i] = (d1[i] + d3[i]);
	}
	var newArr = [];
	for (let i = 0; i < com_data.length; i++) {
		newArr.push({
			"source_date": d4[i],
			"source_timestamp_day": d5[i],
			"sum": {
				"energy_kwh_import": com_data[i]
			}
		})
	}
	// result.map(function (key, value) {
	// 	if (res3p.data.data.length > 0) {
	// 		allSum = res3p.data.data[value].sum.energy_wh_import;
	// 	} else {
	// 		allSum = 0;
	// 	}
	// 	_newArr.push({
	// 		"source_date": key.source_date,
	// 		"source_timestamp_day": key.source_timestamp_day,
	// 		"sum": {
	// 			"energy_kwh_import": key.sum.energy_kwh_import + allSum
	// 		}
	// 	})
	// })
	let response = {
		"data": {
			"data": newArr
		}
	}
	return response
}

//last 30 days all power consumtion in kwh
export const fetchPowerConsumptionof30DaysAll9May = async () => {
	/* ----------------1p ------------------ */
	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},
	})
	// console.log("Last 30 Days 1p :- ", res1p)
	/* -----------------3p---------------- */
	// meter_dailyload_profile_three_phase
	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},
	})
	// console.log("Last 30 Days 1p :- ",res3p)
	/* -----------Calculation------------- */
	const values1p = res1p?.data?.data?.map((item) =>
		(`${item.sum.energy_kwh_import / 1000}`)
	)
	// console.log("values1p", values1p);

	const values3p = res3p?.data?.data?.map((item) =>
		(`${item.sum.energy_wh_import / 1000}`)
	)
	// console.log("values3p", values3p);

	let i = 0;
	let values = [];
	while (i < values1p.length) {
		if (values1p[i] === 'null') {
			values.push(0 + parseInt(values3p[i]));
		}
		else if (values3p[i] === null || values3p[i] === undefined || values3p[i] === "null") {
			// values.push(parseInt(values1p[i])+0)
			values = values1p
			// console.log("val3p is null", values);
		}
		else if (values1p[i] === 'null' && values3p[i] === 'null') {
			values.push(0 + 0);
		}
		else {
			values.push(parseInt(values1p[i]) + parseInt(values3p[i]));
		}
		i += 1;
	}
	// console.log("New Values", values);
	const arr = [];
	const xaxis = res1p?.data?.data?.map((item: { source_timestamp_day: any; source_timestamp_month: any; source_timestamp_year: any }) => {
		arr.push(`${item.source_timestamp_day}/${item.source_timestamp_month}/${item.source_timestamp_year}`);
	})
	// console.log("Arr", arr);
	// console.log("xaxis", res1p.data.data);
	

	const response = {
		'category': arr,
		'series': values
	}
	return response
}


// Last 30 days 1 phase (Last 30 Days)
export const fetchPowerConsumptionOf30DaysSingle = async () => {
	return http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},
	})
}

//Last 30 days Third Phase(Last 30 Days)
export const fetchPowerConsumptionOf30DaysThird = async () => {
	return http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [{ source_timestamp: { _gt: '$NOW(-30 days)' } }, { utility_id: { _eq: utilityId } }],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},
	})

}

export const fetchPowerConsumptionByYear = async ({
	year,
}: {
	year: string | number
}) => {
	const firstDayOfTheYear = format(new Date(year as number, 0, 1), 'yyyy-MM-dd')
	const lastDayOfTheYear = format(
		new Date(year as number, 11, 31),
		'yyyy-MM-dd'
	)

	const res = await http.get('/items/meter_daily_load_data', {
		params: {
			filter: {
				_and: [
					{ date: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'month(date)',
		},
	})
	// console.log("Hes DC :- ", res);
	
	return res
}

export const fetchLatestTimeForPowerConsumptionMonthlyAndYearly = async () => {
	const res = await http.get('/items/meter_daily_load_data', {
		params: {
			sort: '-server_timestamp',
			limit: 1,
			fields: 'server_timestamp',
			access_token,
			filter: { utility_id: { _eq: utilityId } },
		},
	})

	const date = res?.data?.data[0]?.server_timestamp
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})
	return format(addedDate, 'dd/MM/yyyy HH:mm:ss')
}

// All Phase HES dashboard Doughnut Data
export const fetchPowerConsumptionByYearAll = async ({
	year,
}: {
	year: string | number
}) => {
	const firstDayOfTheYear = format(new Date(year as number, 0, 1), 'yyyy-MM-dd')
	const lastDayOfTheYear = format(
		new Date(year as number, 11, 31),
		'yyyy-MM-dd'
	)
	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'month(source_timestamp)',
			'sort': '-month(source_timestamp)'
		},
	})
	// console.log("res3p ->",res3p)

	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'month(source_timestamp)',
			'sort': '-month(source_timestamp)'
		},
	})
	// console.log("doughnut----------------",res1p)

	var data_val1 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
	var data_val3 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };

	var tempObj = {}; var temp2 = {}

	var len = res1p.data.data.length;
	var new_data = {};
	for (let i = 0; i < len; i++) {
		if (res1p.data.data[i].sum.energy_kwh_import == 'NaN' || res1p.data.data[i].sum.energy_kwh_import == null) {
			new_data = 0;
		} else {
			new_data = res1p.data.data[i].sum.energy_kwh_import;
		}
		// tempObj[res1p.data.data[i].source_timestamp_month] = res1p.data.data[i].sum.energy_kwh_import
		tempObj[res1p.data.data[i].source_timestamp_month] = new_data;

	}
	const all_Data1 = { ...data_val1, ...tempObj };
	// console.log("Doughnut Data____________________________", all_Data1)

	var lent = res3p.data.data.length;
	for (let i = 0; i < lent; i++) {
		temp2[res3p.data.data[i].source_timestamp_month] = res3p.data.data[i].sum.energy_wh_import
	}
	const all_Data2 = { ...data_val3, ...temp2 };

	var sum_data = [];

	for (let i = 1; i <= 12; i++) {
		sum_data[i - 1] = parseInt(all_Data1[i]) + parseInt(all_Data2[i]);
	}

	const _newArray_temp = [];
	sum_data.map(function (key, value) {
		_newArray_temp.push({
			"source_timestamp_month": value + 1,
			"sum": {
				"energy_wh_import": key
			}
		});
	})
	//   console.log(_newArray_temp)

	// let result = (res3p?.data?.data)
	// let allSum = 0;
	// let _newArr = [];


	// result.map(function (key, value) {
	// 	if (res1p.data.data.length > 0) {
	// 		allSum = res1p.data.data[value].sum.energy_kwh_import;
	// 	}else{	
	// 		allSum = 0;
	// 	}

	// 	_newArr.push({
	// 		"source_timestamp_month": key.source_timestamp_month,
	// 		"sum":{
	// 			"energy_wh_import": key.sum.energy_wh_import + allSum
	// 		}
	// 	}) 
	// })
	// console.log("Array New =>",_newArr)

	let response = {
		"data": {
			"data": _newArray_temp
		}
	}

	return response
}

//Single Phase HES Dashboard Doughnut Data
export const fetchPowerConsumptionByYearSingle = async ({
	year,
}: {
	year: string | number
}) => {
	const firstDayOfTheYear = format(new Date(year as number, 0, 1), 'yyyy-MM-dd')
	const lastDayOfTheYear = format(
		new Date(year as number, 11, 31),
		'yyyy-MM-dd'
	)

	const res = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'month(source_timestamp)',
			'sort': '-month(source_timestamp)'
		},
	})
	return res
}

//Three Phase HES Dashboard Doughnut Data
export const fetchPowerConsumptionByYearThird = async ({
	year,
}: {
	year: string | number
}) => {
	const firstDayOfTheYear = format(new Date(year as number, 0, 1), 'yyyy-MM-dd')
	const lastDayOfTheYear = format(
		new Date(year as number, 11, 31),
		'yyyy-MM-dd'
	)

	const res = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'month(source_timestamp)',
			'sort': '-month(source_timestamp)'
		},
	})
	return res
}

// All Phase Dashboard Doughnut Data
export const fetchPowerConsumptionAll = async ({
	year,
}: {
	year: string | number
}) => {
	const firstDayOfTheYear = format(new Date(year as number, 0, 1), 'yyyy-MM-dd')
	const lastDayOfTheYear = format(
		new Date(year as number, 11, 31),
		'yyyy-MM-dd'
	)
	// /items/meter_dailyload_profile_three_phase
	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'month(source_timestamp)',
			'sort': '-month(source_timestamp)'
		},
	});
	console.log("All phase doughnut data ", res3p)

	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: [firstDayOfTheYear, lastDayOfTheYear] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'month(source_timestamp)',
			'sort': '-month(source_timestamp)'
		},
	})
	console.log("res1p All ", res1p);


	var data_val1 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
	var data_val3 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };

	var tempObj = {}; var temp2 = {}

	var new_data = {};
	var len = res1p.data.data.length;
	for (let i = 0; i < len; i++) {
		if (res1p.data.data[i].sum.energy_kwh_import == 'NaN' || res1p.data.data[i].sum.energy_kwh_import == null) {
			new_data = 0;
		} else {
			new_data = res1p.data.data[i].sum.energy_kwh_import;
		}
		// tempObj[res1p.data.data[i].source_timestamp_month] = res1p.data.data[i].sum.energy_kwh_import
		tempObj[res1p.data.data[i].source_timestamp_month] = new_data;

	}
	// console.log("00000000000000000",new_data);


	const all_Data1 = { ...data_val1, ...tempObj };

	var lent = res3p.data.data.length;
	for (let i = 0; i < lent; i++) {
		temp2[res3p.data.data[i].source_timestamp_month] = res3p.data.data[i].sum.energy_wh_import
	}
	const all_Data2 = { ...data_val3, ...temp2 };

	var sum_data = [];
	for (let i = 1; i <= 12; i++) {
		sum_data[i - 1] = parseInt(all_Data1[i]) + parseInt(all_Data2[i]);
	}

	const _newArray_temp = [];
	sum_data.map(function (key, value) {
		_newArray_temp.push({
			"source_timestamp_month": value + 1,
			"sum": {
				"energy_wh_import": key
			}
		});
	})


	// result.map(function (key, value) {

	// 	console.log("-----resp1---------------");
	// 	console.log(res1p.data.data[value]);
	// 	console.log("-----resp3---------------");
	// 	console.log(res3p.data.data[value]);





	// 	//  if (res3p.data.data.length > 0) {
	// 	// 	p3sum = res1p.data.data[value].sum.energy_kwh_import
	// 	// 	console.log("res1p",res1p.data.data)
	// 	// } else {
	// 	// 	p3sum = 0;
	// 	// }


	// 	console.log(res1p.data.data[value].sum.energy_kwh_import);
	// 	console.log(res3p.data.data[value].sum.energy_wh_import);

	// 	}


	// 	// _newArr.push({
	// 	// 	"source_timestamp_month": key.source_timestamp_month,
	// 	// 	"sum": {
	// 	// 		"energy_wh_import": key.sum.energy_wh_import + p3sum
	// 	// 	}
	// 	// });
	// });

	//console.log(_newArr);
	let response = {
		"data": {
			"data": _newArray_temp
		}
	}
	return response
}

//date format for Doughnut chart - Dashboard
export const fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle = async () => {
	const res = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			sort: '-server_timestamp',
			limit: 1,
			fields: 'server_timestamp',
			access_token,
		},
	})

	// console.log("new date and time ----------->",res)

	const date = res?.data?.data[0]?.server_timestamp
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})
	// console.log("dashboard date and time for Doughnut -> ",addedDate)
	return format(addedDate, 'dd/MM/yyyy HH:mm:ss')
}

//All Phase 
export const fetchPowerConsumptionInMonth = async ({
	month,
	year,
}: {
	month: number
	year: number
}) => {
	// const year = new Date().getFullYear()
	const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd')
	const endDate = format(
		new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1))),
		'yyyy-MM-dd'
	)

	const res = await http.get('/items/meter_daily_load_data', {
		params: {
			filter: {
				_and: [
					{ date: { _between: [startDate, endDate] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'date',
		},
	})

	const syncDate = await fetchLatestTimeForPowerConsumptionMonthlyAndYearly()
	return {
		data: res?.data?.data,
		syncDate,
	}
}

//Single Phase -- Power consumption history => date format for Power Consumption History
export const fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle = async () => {
	const res = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			sort: '-server_timestamp',
			limit: 1,
			fields: 'server_timestamp',
			access_token,
		},
	})
	// console.log("Power Consumption history ",res)

	const date = res?.data?.data[0]?.server_timestamp
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})
	// console.log("addedDate history",addedDate)
	return format(addedDate, 'dd/MM/yyyy HH:mm:ss')
}

// Power Consumption History-daywise in kWh All Phase( Monthly All)
export const fetchPowerConsumptionInMonthAll = async ({
	month,
	year,
}: {
	month: number
	year: number
}) => {
	// const year = new Date().getFullYear()
	const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd')
	const endDate = format(
		new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1))),
		'yyyy-MM-dd'
	)

	const res1p = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { "_between": [`${startDate}`, `${endDate}`] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},

	})

	/* https://ibotapp.azure-api.net/mdmsquery/items/meter_dailyload_profile_single_phase?access_token=1234&filter=
{"_and":
[
{"source_timestamp":{"_between":["2022-05-01 00:00:00","2022-05-31 23:59:59"]}}, {"utility_id":{"_eq":"4"}}
] }
&aggregate[sum]=energy_kwh_import&groupBy[]=day(source_timestamp),month(source_timestamp),year(source_timestamp)&sort=day(source_timestamp)
 */

	const res3p = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { "_between": [`${startDate}`, `${endDate}`] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},

	})

	/* Calculation Goes Here */
	const values1p = res1p?.data?.data?.map((item) =>
		(`${item.sum.energy_kwh_import}`)
	)

	// console.log(values1p);
	const values3p = res3p?.data?.data?.map((item) =>
		(`${item.sum.energy_wh_import}`)
	)
	// console.log("values3p",values3p);

	let values = [];
	let oneplen = res1p?.data?.data.length;
	let threeplen = res3p?.data?.data.length;

	if (oneplen > threeplen) {
		let i = 0;
		while (i < res1p?.data?.data.length) {
			if (i > threeplen - 1) {
				if (values1p[i] == 'null') {
					values.push(0);
				}
				else {
					values.push(0 + parseInt(values1p[i]));
				}
			}

			else {

				if (values3p[i] !== 'null' && values1p[i] !== 'null') {
					values.push(parseInt(values3p[i]) + parseInt(values1p[i]));
				}
				else if (values3p[i] === 'null') {
					console.log(values3p[i]);
					values.push(0 + parseInt(values1p[i]));
				}
				else if (values1p[i] === 'null') {
					console.log(values3p[i]);
					values.push(0 + parseInt(values3p[i]));
				}

			}
			i += 1;
		}
	}


	/* ---------------------------- */

	else {
		let i = 0;
		while (i < res1p?.data?.data.length) {

			if (i > oneplen - 1) {
				if (values3p[i] == 'null') {
					values.push(0);
				}
				else {
					values.push(0 + parseInt(values3p[i]));
				}
			}


			else {
				if (values3p[i] !== 'null' && values1p[i] !== 'null') {
					values.push(parseInt(values3p[i]) + parseInt(values1p[i]));
				}
				else if (values3p[i] == 'null') {
					values.push(0 + parseInt(values1p[i]));
				}
				else if (values1p[i] == 'null') {
					values.push(0 + parseInt(values3p[i]));
				}
			}
			i += 1;
		}
	}
	console.log("values", values)


	const arr = [];
	const xaxis = res1p?.data?.data?.map((item) => {
		arr.push(`${item.source_timestamp_day}/${item.source_timestamp_month}/${item.source_timestamp_year}`);
		//`${item.source_timestamp_day}/${item.source_timestamp_month}/${item.source_timestamp_year}`

	})
	//console.log(arr)
	const data = {
		category: arr,
		series: values,

	}



	/* ------------------------------ */

	// let result = (res1p.data.data);
	// let allSum = 0;
	// let _newArr = [];	

	/* let pk = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = res1p.data.data[i].source_date;
		pk[key] = 0;
	}
	// console.log("++++++++++++++++++++++++",pk);

	let day_time = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = i
		day_time[key] = (res1p.data.data[i].source_timestamp_day);
	}
	//	console.log("day_time  ===========",day_time)

	let p1 = [];
	for (let i = 0; i < res1p.data.data.length; i++) {
		let key = res1p.data.data[i].source_date;
		p1[key] = res1p.data.data[i].sum.energy_kwh_import;
	}
	//	console.log("bbbbbbbbbbbbbbbbbbbbbbbbb",p1);

	let p3 = [];
	for (let i = 0; i < res3p.data.data.length; i++) {
		let key = res3p.data.data[i].source_date;
		p3[key] = res3p.data.data[i].sum.energy_wh_import;
	}
	//	console.log("pppppppppppppppppppppppppppp",p3);

	let p1_data = [];
	p1_data = { ...pk, ...p1 }

	let p3_data = [];
	p3_data = { ...pk, ...p3 }
	//	console.log("p3 data",p3_data)
	//	console.log("P1 data",p1_data)

	var d1 = Object.values(p1_data);
	var d3 = Object.values(p3_data);
	var d4 = Object.keys(pk);
	var d5 = day_time;
	var com_data = []
	for (let i = 0; i < d1.length; i++) {
		com_data[i] = (d1[i] + d3[i]);
	}
	//  console.log("com data ------------------ ",com_data);

	var newArr = [];

	for (let i = 0; i < com_data.length; i++) {
		newArr.push({
			"source_date": d4[i],
			"source_timestamp_day": d5[i],
			"sum": {
				"energy_kwh_import": com_data[i]
			}
		})
	}

	// result.map(function (key, value) {
	// 	if (res3p.data.data.length) {
	// 		allSum = res3p.data.data[value].sum.energy_wh_import;
	// 	} else {
	// 		allSum = 0;
	// 	}

	// 	_newArr.push({
	// 		"source_date": key.source_date,
	// 		"source_timestamp_day": key.source_timestamp_day,
	// 		"sum": {
	// 			"energy_kwh_import": key.sum.energy_kwh_import + allSum
	// 		}
	// 	})
	// })
	//	console.log("Array Data : ",newArr);
 */

	return data;
}

// Power Consumption History-daywise in kWh Single Phase(Monthly All)
export const fetchPowerConsumptionInMonthSingle = async ({
	month,
	year,
}: {
	month: number
	year: number
}) => {
	// const year = new Date().getFullYear()
	const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd')
	const endDate = format(
		new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1))),
		'yyyy-MM-dd'
	)
	//console.log(startDate);
	//console.log(endDate);
	const res = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { "_between": [`${startDate}`, `${endDate}`] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},

	})
	/* https://ibotapp.azure-api.net/mdmsquery/items/meter_dailyload_profile_single_phase?access_token=1234&filter=
	{"_and":
	[
	{"source_timestamp":{"_between":["2022-05-01 00:00:00","2022-05-31 23:59:59"]}}, {"utility_id":{"_eq":"4"}}
	] }
	&aggregate[sum]=energy_kwh_import&groupBy[]=day(source_timestamp),month(source_timestamp),year(source_timestamp)&sort=day(source_timestamp)
	 */

	//console.log( res?.data?.data);



	//const syncDate = await fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle()
	return {
		data: res?.data?.data
		//syncDate,
	}
}

// Power Consumption History-daywise in kWh three Phase(Monthly All)
export const fetchPowerConsumptionInMonthThird = async ({
	month,
	year,
}: {
	month: number
	year: number
}) => {
	// const year = new Date().getFullYear()
	const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd')
	const endDate = format(
		new Date(year, month - 1, getDaysInMonth(new Date(year, month - 1))),
		'yyyy-MM-dd'
	)

	const res = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { "_between": [`${startDate}`, `${endDate}`] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': '-source_timestamp',
		},

	})

	console.log(res?.data?.data)
	//const syncDate = await fetchLatestTimeForPowerConsumptionMonthlyAndYearlyThird()
	return {
		data: res?.data?.data,
		//syncDate,
	}
}
/* -------------------------Pranjali Pandey------------------------ */

export const fetchPowerConsumptionInMonthThird10May = async () => {
	const res = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: ["2022-05-01 00:00:00", "2022-05-31 23:59:59"] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_wh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': 'day(source_timestamp)',
		},

	})
	return res;
}

export const fetchPowerConsumptionInMonthSingle10May = async () => {
	const res = await http.get('/items/meter_dailyload_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _between: ["2022-05-01 00:00:00", "2022-05-31 23:59:59"] } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[sum]': 'energy_kwh_import',
			access_token,
			'groupBy[]': 'day(source_timestamp),month(source_timestamp),year(source_timestamp)',
			'sort': 'day(source_timestamp)',
		},

	})

	// console.log("fetch power consumption in Monthly Single",res)

	return res;
}

//Third Phase -- Power consumption history
export const fetchLatestTimeForPowerConsumptionMonthlyAndYearlyThird = async () => {
	const res = await http.get('/items/meter_dailyload_profile_three_phase', {
		params: {
			sort: '-server_timestamp',
			limit: 1,
			fields: 'server_timestamp',
			access_token,
		},
	})

	const date = res?.data?.data[0]?.server_timestamp
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})
	return format(addedDate, 'dd/MM/yyyy HH:mm:ss')
}

// Disconnected Meters
export const fetchRelayDisconnectedMeters = async () => {
	const discon = await http.get('/items/meters', {
		params: {
			filter: {
				_and: [
					{ relay_status: { _eq: 'Disconnected' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'aggregate[count]': 'meter_serial_number',
			groupBy: 'meter_connection_type',
			access_token,
		},
	})
	// console.log("discon",discon)
	return discon;
}

export const fetchPowerOutageCount = async () => {
	return await http.get('/items/all_events_and_data', {
		params: {
			filter: { utility_id: { _eq: utilityId } },
			'aggregate[count]': 'outage_duration',
			access_token,
		},
	})
}

//Dashboard  Card - Alerts And Tampers
export const fetchTamperEventCount = async () => {
	const res = await http.get('/items/all_events_and_data', {
		params: {
			filter: {
				_and: [
					{ occurence_or_restore_or_na: { _neq: null } },
					{ utility_id: { _eq: utilityId } },
					{
						event_code: {
							_in: [
								'1',
								'2',
								'3',
								'4',
								'5',
								'6',
								'7',
								'8',
								'9',
								'10',
								'11',
								'12',
								'51',
								'52',
								'53',
								'54',
								'55',
								'56',
								'63',
								'64',
								'65',
								'66',
								'67',
								'68',
								'69',
								'70',
								'101',
								'102',
								'201',
								'202',
								'203',
								'204',
								'205',
								'206',
								'207',
								'208',
								'209',
								'210',
								'211',
								'212',
								'213',
								'214',
								'215',
								'216',
								'151',
								'152',
								'153',
								'154',
								'155',
								'157',
								'158',
								'159',
								'160',
								'161',
								'162',
								'163',
								'164',
								'165',
								'166',
								'251',
								'301',
								'302',
							],
						},
					},
				],
			},
			'groupBy[]': 'occurence_or_restore_or_na',
			'aggregate[count]': 'occurence_or_restore_or_na',
			access_token,
		},
	})
	const data = res.data.data
	const restore = data.find(
		(item) => item.occurence_or_restore_or_na === 'Restore'
	).count.occurence_or_restore_or_na
	const occurence = data.find(
		(item) => item.occurence_or_restore_or_na === 'Occurrence'
	).count.occurence_or_restore_or_na
	const na = data.find((item) => item.occurence_or_restore_or_na === 'na').count
		.occurence_or_restore_or_na
	return Math.abs(Number(occurence - restore + na))
}

export const fetchDashboardStats = async () => {
	const res = await Promise.all([
		fetchTotalDeployedMeters,
		fetchTotalInstalledMeters,
		fetchTotalActiveMeters,
		fetchPowerOutageCount,
		fetchMtd,
		fetchYtd,
		fetchTamperEventCount,
		fetchLatestDateTimeForDataSyncForMeters,
		fetchLatestDateTimeForDailyLoadSync,
	])
}




/* ------------All phase 1p & 3p---------------- */

/* 


	const res1p = await http.get('/items/meter_instantaneous_profile_single_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utility_id: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'source_timestamp,year(source_timestamp),month(source_timestamp),day(source_timestamp),hour(source_timestamp),minute(source_timestamp),meter_serial_number',
			// 'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-source_timestamp',
			limit: -1,
			access_token,
		},
	})

	let p1hr = [];

	for (let i = 0; i < res1p?.data?.data?.length; i++) {

		var p1minute = res1p?.data?.data[i]?.source_timestamp_minute;
		var p1hour = res1p?.data?.data[i]?.source_timestamp_hour;
		//var meter_serial_number=res1p?.data?.data[i]?.meter_serial_number
		
//console.log(p1minute+"  "+p1hour+" "+meter_serial_number);

		var ndata = null;
		// console.log("minute data ", p1minute)

		if (p1hour === 0 || p1hour === 1 || p1hour === 2 || p1hour === 3 || p1hour === 4 || p1hour === 5 || p1hour === 6 || p1hour === 7 || p1hour === 8 || p1hour === 9 || p1hour === 10 || p1hour === 11 || p1hour === 12 || p1hour === 13 || p1hour === 14 || p1hour === 15 || p1hour === 16 || p1hour === 17 || p1hour === 18 || p1hour === 19 || p1hour === 20 || p1hour === 21 || p1hour === 22 || p1hour === 23) {
			if (p1minute === 45 || p1minute === 46 || p1minute === 47 || p1minute === 48 || p1minute === 49 || p1minute === 50 || p1minute === 51 || p1minute === 52 || p1minute === 53 || p1minute === 54 || p1minute === 55 || p1minute === 56 || p1minute === 57 || p1minute === 58 || p1minute === 59) {
				ndata = {
					"source_timestamp_year": res1p.data.data[i].source_timestamp_year, "source_timestamp_month": res1p.data.data[i].source_timestamp_month,
					"source_timestamp_day": res1p.data.data[i].source_timestamp_day, "source_timestamp_hour": res1p.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res1p.data.data[i].source_timestamp_minute, "meter_serial_number": res1p.data.data[i].meter_serial_number
				}
			}
			if (ndata) {
				p1hr.push(ndata);
			}
		}
	}
	let arrh0 = [], arrh1 = [], arrh2 = [], arrh3 = [], arrh4 = [], arrh5 = [], arrh6 = [], arrh7 = [], arrh8 = [], arrh9 = [], arrh10 = [],
		arrh11 = [], arrh12 = [], arrh13 = [], arrh14 = [], arrh15 = [], arrh16 = [], arrh17 = [], arrh18 = [], arrh19 = [], arrh20 = [], arrh21 = [],
		arrh22 = [], arrh23 = [];

	let arr0to14len = arrlenfor0to14(res1p);
	let arr15to29len = arrlenfor15to29(res1p);
	let arr30to44len = arrlenfor30to44(res1p);
	let arrlen = []
	let msn0h = p1hr.filter((item) => item.source_timestamp_hour == 0);
	let ms0 = msn0h.map((item) => item.meter_serial_number);
	arrh0 = msn0h.filter(({ meter_serial_number }, index) => !ms0.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[0], arr15to29len[0], arr30to44len[0], arrh0.length);

	let msn1h = p1hr.filter((item) => item.source_timestamp_hour == 1);
	let ms1 = msn1h.map((item) => item.meter_serial_number);
	arrh1 = msn1h.filter(({ meter_serial_number }, index) => !ms1.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[1], arr15to29len[1], arr30to44len[1], arrh1.length);

	let msn2h = p1hr.filter((item) => item.source_timestamp_hour == 2);
	let ms2 = msn2h.map((item) => item.meter_serial_number);
	arrh2 = msn2h.filter(({ meter_serial_number }, index) => !ms2.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[2], arr15to29len[2], arr30to44len[2], arrh2.length);

	let msn3h = p1hr.filter((item) => item.source_timestamp_hour == 3);
	let ms3 = msn3h.map((item) => item.meter_serial_number);
	arrh3 = msn3h.filter(({ meter_serial_number }, index) => !ms3.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[3], arr15to29len[3], arr30to44len[3], arrh3.length);

	let msn4h = p1hr.filter((item) => item.source_timestamp_hour == 4);
	let ms4 = msn4h.map((item) => item.meter_serial_number);
	arrh4 = msn4h.filter(({ meter_serial_number }, index) => !ms4.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[4], arr15to29len[4], arr30to44len[4], arrh4.length);

	let msn5h = p1hr.filter((item) => item.source_timestamp_hour == 5);
	let ms5 = msn5h.map((item) => item.meter_serial_number);
	arrh5 = msn5h.filter(({ meter_serial_number }, index) => !ms5.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[5], arr15to29len[5], arr30to44len[5], arrh5.length);

	let msn6h = p1hr.filter((item) => item.source_timestamp_hour == 6);
	let ms6 = msn6h.map((item) => item.meter_serial_number);
	arrh6 = msn6h.filter(({ meter_serial_number }, index) => !ms6.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[6], arr15to29len[6], arr30to44len[6], arrh6.length);

	let msn7h = p1hr.filter((item) => item.source_timestamp_hour == 7);
	let ms7 = msn7h.map((item) => item.meter_serial_number);
	arrh7 = msn7h.filter(({ meter_serial_number }, index) => !ms7.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[7], arr15to29len[7], arr30to44len[7], arrh7.length);

	let msn8h = p1hr.filter((item) => item.source_timestamp_hour == 8);
	let ms8 = msn8h.map((item) => item.meter_serial_number);
	arrh8 = msn8h.filter(({ meter_serial_number }, index) => !ms8.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[8], arr15to29len[8], arr30to44len[8], arrh8.length);

	let msn9h = p1hr.filter((item) => item.source_timestamp_hour == 9);
	let ms9 = msn9h.map((item) => item.meter_serial_number);
	arrh9 = msn9h.filter(({ meter_serial_number }, index) => !ms9.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[9], arr15to29len[9], arr30to44len[9], arrh9.length);

	let msn10h = p1hr.filter((item) => item.source_timestamp_hour == 10);
	let ms10 = msn10h.map((item) => item.meter_serial_number);
	arrh10 = msn10h.filter(({ meter_serial_number }, index) => !ms10.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[10], arr15to29len[10], arr30to44len[10], arrh10.length);

	let msn11h = p1hr.filter((item) => item.source_timestamp_hour == 11);
	let ms11 = msn11h.map((item) => item.meter_serial_number);
	arrh11 = msn11h.filter(({ meter_serial_number }, index) => !ms11.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[11], arr15to29len[11], arr30to44len[11], arrh11.length);

	let msn12h = p1hr.filter((item) => item.source_timestamp_hour == 12);
	let ms12 = msn12h.map((item) => item.meter_serial_number);
	arrh12 = msn12h.filter(({ meter_serial_number }, index) => !ms12.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[12], arr15to29len[12], arr30to44len[12], arrh12.length);

	let msn13h = p1hr.filter((item) => item.source_timestamp_hour == 13);
	let ms13 = msn13h.map((item) => item.meter_serial_number);
	arrh13 = msn13h.filter(({ meter_serial_number }, index) => !ms13.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[13], arr15to29len[13], arr30to44len[13], arrh13.length);

	let msn14h = p1hr.filter((item) => item.source_timestamp_hour == 14);
	let ms14 = msn14h.map((item) => item.meter_serial_number);
	arrh14 = msn14h.filter(({ meter_serial_number }, index) => !ms14.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[14], arr15to29len[14], arr30to44len[14], arrh14.length);

	let msn15h = p1hr.filter((item) => item.source_timestamp_hour == 15);
	let ms15 = msn15h.map((item) => item.meter_serial_number);
	arrh15 = msn15h.filter(({ meter_serial_number }, index) => !ms15.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[15], arr15to29len[15], arr30to44len[15], arrh15.length);

	let msn16h = p1hr.filter((item) => item.source_timestamp_hour == 16);
	let ms16 = msn16h.map((item) => item.meter_serial_number);
	arrh16 = msn16h.filter(({ meter_serial_number }, index) => !ms16.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[16], arr15to29len[16], arr30to44len[16], arrh16.length);

	let msn17h = p1hr.filter((item) => item.source_timestamp_hour == 17);
	let ms17 = msn17h.map((item) => item.meter_serial_number);
	arrh17 = msn17h.filter(({ meter_serial_number }, index) => !ms17.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[17], arr15to29len[17], arr30to44len[17], arrh17.length);

	let msn18h = p1hr.filter((item) => item.source_timestamp_hour == 18);
	let ms18 = msn18h.map((item) => item.meter_serial_number);
	arrh18 = msn18h.filter(({ meter_serial_number }, index) => !ms18.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[18], arr15to29len[18], arr30to44len[18], arrh18.length);

	let msn19h = p1hr.filter((item) => item.source_timestamp_hour == 19);
	let ms19 = msn19h.map((item) => item.meter_serial_number);
	arrh19 = msn19h.filter(({ meter_serial_number }, index) => !ms19.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[19], arr15to29len[19], arr30to44len[19], arrh19.length);

	let msn20h = p1hr.filter((item) => item.source_timestamp_hour == 20);
	let ms20 = msn20h.map((item) => item.meter_serial_number);
	arrh20 = msn20h.filter(({ meter_serial_number }, index) => !ms20.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[20], arr15to29len[20], arr30to44len[20], arrh20.length);

	let msn21h = p1hr.filter((item) => item.source_timestamp_hour == 21);
	let ms21 = msn21h.map((item) => item.meter_serial_number);
	arrh21 = msn21h.filter(({ meter_serial_number }, index) => !ms21.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[21], arr15to29len[21], arr30to44len[21], arrh21.length);

	let msn22h = p1hr.filter((item) => item.source_timestamp_hour == 22);
	let ms22 = msn22h.map((item) => item.meter_serial_number);
	arrh22 = msn22h.filter(({ meter_serial_number }, index) => !ms22.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[22], arr15to29len[22], arr30to44len[23], arrh22.length);

	let msn23h = p1hr.filter((item) => item.source_timestamp_hour == 23);
	let ms23 = msn23h.map((item) => item.meter_serial_number);
	arrh23 = msn23h.filter(({ meter_serial_number }, index) => !ms23.includes(meter_serial_number, index + 1))
	arrlen.push(arr0to14len[23], arr15to29len[23], arr30to44len[23], arrh23.length);
	//console.log("unique data", arrlen)// console.log("New Array Formed -> ",data1pArray)



	const res3p = await http.get('/items/meter_instantaneous_profile_three_phase', {
		params: {
			filter: {
				_and: [
					{ source_timestamp: { _gt: '$NOW(-24 hours)' } },
					{ utilityid: { _eq: utilityId } },
				],
			},
			'groupBy[]': 'source_timestamp,year(source_timestamp),month(source_timestamp),day(source_timestamp),hour(source_timestamp),minute(source_timestamp),meter_serial_number',
			// 'aggregate[countDistinct]': 'meter_serial_number',
			sort: '-source_timestamp',
			limit: -1,
			access_token,
		},
	})


	// 3p data start here  


	let p3hr = [];

	for (let i = 0; i < res3p?.data?.data?.length; i++) {

		var p1minute = res3p?.data?.data[i]?.source_timestamp_minute;
		var p1hour = res3p?.data?.data[i]?.source_timestamp_hour;
		
		var ndata = null;
		// console.log("minute data ", p1minute)

		if (p1hour === 0 || p1hour === 1 || p1hour === 2 || p1hour === 3 || p1hour === 4 || p1hour === 5 || p1hour === 6 || p1hour === 7 || p1hour === 8 || p1hour === 9 || p1hour === 10 || p1hour === 11 || p1hour === 12 || p1hour === 13 || p1hour === 14 || p1hour === 15 || p1hour === 16 || p1hour === 17 || p1hour === 18 || p1hour === 19 || p1hour === 20 || p1hour === 21 || p1hour === 22 || p1hour === 23) {
			if (p1minute === 45 || p1minute === 46 || p1minute === 47 || p1minute === 48 || p1minute === 49 || p1minute === 50 || p1minute === 51 || p1minute === 52 || p1minute === 53 || p1minute === 54 || p1minute === 55 || p1minute === 56 || p1minute === 57 || p1minute === 58 || p1minute === 59) {
				ndata = {
					"source_timestamp_year": res3p.data.data[i].source_timestamp_year, "source_timestamp_month": res3p.data.data[i].source_timestamp_month,
					"source_timestamp_day": res3p.data.data[i].source_timestamp_day, "source_timestamp_hour": res3p.data.data[i].source_timestamp_hour,
					"source_timestamp_minute": res3p.data.data[i].source_timestamp_minute, "meter_serial_number": res3p.data.data[i].meter_serial_number
				}
			}
			if (ndata) {
				p3hr.push(ndata);
			}
		}
	}
	let arr3plen = arrlen3p(p3hr, res3p);

	//console.log("unique 3p data", arr3plen)

	let dataArray = [...arrlen].map((sum, index) => sum + arr3plen[index]);

	//console.log("All Phase Data created -> ", dataArray)

	return {
		x: new Array(24)
			.fill(0)
			.map((_, i) => i)
			.map((item) => {
				const date = format(
					sub(new Date(), { hours: item }) as any,
					'dd-MM hh:mm:a'
				)
				return date
			}),
		// x: newDate,
		y: dataArray,
	}

*/