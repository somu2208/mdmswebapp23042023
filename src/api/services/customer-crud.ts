import http, {utilityId} from 'api/http'
import {format, getDaysInMonth, getYear, set, sub} from 'date-fns'
import {access_token} from '../http'
import _ from 'lodash'

export const fetchCustomerDropdownData = async () => {
	const res = await http.get('items/consumer_sub_group', {
		params: {access_token},
	})
	const category = await http.get('items/consumer_category', {
		params: {access_token},
	})
	const typeId = await http.get('items/type_ltorhtetc', {
		params: {access_token},
	})
	const state = await http.get('items/state', {
		params: {access_token},
	})
	return {
		sub_group: res.data.data,
		consumer_category: category.data.data,
		consumer_type_id: typeId.data.data,
		state: state.data.data,
	}
}

export const fetchDistrict = async (stateId: number | string) => {
	const district = await http.get('items/district', {
		params: {access_token, filter: {state_id: {_eq: stateId}}},
	})
	return district.data.data
}

export const fetchCity = async (districtId: number | string) => {
	const district = await http.get('items/city', {
		params: {access_token, filter: {distcict_id: {_eq: districtId}}},
	})
	return district.data.data
}
