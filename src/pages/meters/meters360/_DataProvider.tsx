import {format} from 'date-fns'
import React, {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react'

const DataContext: React.Context<{
	fromDate: string
	toDate: string
	setState: Dispatch<SetStateAction<{fromDate: string; toDate: string}>>
}> = createContext(null)

const _DataProvider = ({children}) => {
	const [state, setState] = useState({
		fromDate: format(new Date(), 'yyyy-MM-dd'),
		toDate: format(new Date(), 'yyyy-MM-dd'),
	})

	return (
		<DataContext.Provider
			value={{fromDate: state.fromDate, toDate: state.toDate, setState}}
		>
			{children}
		</DataContext.Provider>
	)
}

export const useMeterData = () => {
	const {fromDate, toDate, setState} = useContext(DataContext)
	return {fromDate, toDate, setState}
}

export default _DataProvider
