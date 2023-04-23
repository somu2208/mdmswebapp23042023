import {format, set} from 'date-fns'
import http, {utilityId, access_token} from '../http'

type IType = 'instantaneous' | 'block_load' | 'dailyload' | 'billing'

interface MeterData {
	phaseId: '1' | '2'
	type: IType
	page?: number
}
export const fetchMeterDataProfile = async ({
	phaseId,
	type,
	page,
}: MeterData) => {
	const url = () => {
		return phaseId == '1'
			? `/items/meter_${type}_profile_single_phase_synctime`
			: `/items/meter_${type}_profile_three_phase_synctime`
	}
	const res = await http.get(url(), {
		params: {
			access_token,
			limit: -1,
			filter: {utility_id: {_eq: utilityId}},
		},
	})
	return res.data?.data
}
