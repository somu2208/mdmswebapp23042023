import http, {utilityId, access_token} from 'api/http'

export const fetchSections = async () => {
	const res = await http.get('/items/section', {
		params: {
			filter: {utility_id: {_eq: utilityId}},
			access_token,
		},
	})
	return res.data.data
}

export const fetchAreas = async ({sectionId}: {sectionId: string}) => {
	const res = await http.get('/items/area', {
		params: {
			filter: {section_id: {_eq: sectionId}},
			access_token,
		},
	})
	return res.data.data
}

export const fetchMapData = async ({
	areaId,
	meterState,
}: {
	areaId?: string
	meterState?: 'all' | 'active' | 'inactive'
}) => {
	
	//!areaId && delete params.filter.area_id
	const res1p = await http.get('/items/consumer', {
		// params : {
		// 	access_token,
		// 	fields: '*.*',
		// 	filter: {   
		// 		"meter_serial_number": {
				
		// 	}},
		// }
		params : {
				access_token,
				fields: '*.*',
				filter: {  "_and": [
				{ utility_id: { "_eq" : utilityId }},
			],}
		}
	})
	// console.log("Map Data 1p ",res1p.data.data)

	
	//!areaId && delete params.filter.area_id
	// const res3p = await http.get('/items/consumer', {
	// 	// params : {
	// 	// 	access_token,
	// 	// 	fields: '*.*',
	// 	// 	filter: {   
	// 	// 		"meter_serial_number": {
				
	// 	// 	}},
	// 	// }

	// 	params : {
	// 			access_token,
	// 			fields: '*.*',
	// 			filter: {  "_and": [ 
					
	// 			{ utility_id: { "_eq" : utilityId}},
	// 		],}
	// 	}

	// })
	// console.log("Map Data 3p ",res3p.data.data)

	const res = [...res1p.data.data]

	const data = res
		.map((item) => ({
			lat: item?.latitude,
			long: item?.longitude,
			isActive: item?.meter_serial_number?.power_status === 'On' ? true : false,
			meterId: item?.meter_serial_number?.meter_serial_number,
		}))
		?.filter((item) => {
			if (item.lat === null || item.long === null) {
				return false
			} else {
				return true
			}
		})

	if (meterState === 'active')
		return {
			data: data.filter((item) => item?.isActive),
			activeCount: data.filter((item) => item?.isActive)?.length,
			inactiveCount: 0,
		}
	if (meterState === 'inactive')
		return {
			data: data.filter((item) => !item?.isActive),
			activeCount: 0,
			inactiveCount: data.filter((item) => !item?.isActive)?.length,
		}

	return {
		data: data,
		activeCount: data.filter((item) => item?.isActive)?.length,
		inactiveCount: data.filter((item) => !item?.isActive)?.length,
	}
}
