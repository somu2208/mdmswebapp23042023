import {Button, MenuItem, TextField as MuiTextField} from '@mui/material'
import {useState} from 'react'
import FilterCard from './FilterCard'

interface IState {
	idType: 'customer_id' | 'meter_id'
	searchValue: string
}
const initialState: IState = {
	idType: 'customer_id',
	searchValue: '',
}

const MeterLookUpFilters = ({mutate}) => {
	const [state, setState] = useState<IState>(initialState)
	const handleChange = (name: string, value: any) => {
		setState((prev) => ({...prev, [name]: value}))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		mutate({
			page: 0,
			limit: 10,
			search: {
				value: state.searchValue,
				type: state.idType,
			},
		})
	}

	const handleReset = () => {
		setState({...initialState})
		mutate({limit: 10, page: 0})
	}

	return (
		<form onSubmit={handleSubmit} className='grid grid-cols-3 gap-5'>
			<FilterCard title='Lookup Meter'>
				<TextField
					select
					value={state?.idType}
					onChange={(e) => handleChange('idType', e.target.value)}
				>
					<MenuItem value='meter_id'>Meter ID</MenuItem>
					<MenuItem value='customer_id'>Customer ID</MenuItem>
				</TextField>
			</FilterCard>
			<FilterCard title='Enter Search Value'>
				<TextField
					value={state.searchValue}
					placeholder='Search...'
					onChange={(e) => handleChange('searchValue', e.target.value)}
				/>
			</FilterCard>
			<FilterCard>
				<div className='flex gap-3'>
					<Button
						color='primary'
						type='submit'
						size='small'
						variant='contained'
					>
						Lookup the results
					</Button>
					<Button
						color='primary'
						onClick={handleReset}
						size='small'
						variant='contained'
					>
						Reset
					</Button>
				</div>
			</FilterCard>
		</form>
	)
}

export default MeterLookUpFilters

const TextField = ({value, ...props}) => {
	return (
		<MuiTextField
			fullWidth
			size='small'
			variant='outlined'
			required
			value={value}
			{...props}
		/>
	)
}
