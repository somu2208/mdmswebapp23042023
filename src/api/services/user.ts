import http, {access_token} from '../http'
import formatISO from 'date-fns/formatISO'

export const fetchUserDetails = async (email: string) => {
	return http.get('/users', {
		params: {
			filter: {email: {_eq: email}},
			access_token: '1234',
		},
	})
}

export const verifyUserName = async ({user_name}: {user_name: string}) => {
	const res = await http.get('/items/user_phone_validation', {
		params: {
			access_token: '1234',
			filter: {
				_and: [
					{user_name: {_eq: user_name}},
					{valid_from: {_lte: '$NOW'}},
					{valid_to: {_gte: '$NOW'}},
				],
			},
		},
	})
	return res.data.data
}

export const fetchTokenDetails = async ({
	user_name,
	uuid,
}: {
	user_name: string
	uuid: string
}) => {
	const body = {
		token: uuid,
		status: '0',
		date_time: formatISO(new Date()).slice(0, -6),
		user_name: user_name,
	}
	const res = await http.post(
		'/items/user_tokens',
		{...body},
		{params: {access_token: '1234'}}
	)
	return res.data.data
}

export const fetchLoginStatus = async ({userToken}: {userToken: string}) => {
	const res = await http.get('/items/user_tokens', {
		params: {
			access_token: '1234',
			filter: {uuid: {_eq: userToken}},
			fields: 'status',
		},
	})
	return res.data.data
}

export const fetchAccessTokenDetails = async ({
	email,
	password,
}: {
	email: string | any
	password: string | any
}) => {
	const res = await http.post('/auth/login', {
		email,
		password,
	})
	return res.data.data
}

export const fetchAdminEmails = async () => {
	const res = await http.get('/items/admin_emails', {
		params: {
			access_token: '1234',
		},
	})
	return res.data.data
}

export const fetchUtilities = async () => {
	const res = await http.get('/items/utility', {
		params: {
			access_token: '1234',
		},
	})
	return res.data.data
}
