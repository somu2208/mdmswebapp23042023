import {fetchPrepaidList} from 'api/services/prepaid'
import {createContext, useContext} from 'react'
import {useMutation} from 'react-query'

const PrepaidContext = createContext(null)

const Provider = ({children}) => {
	const {
		data: prepaidList,
		error: error1,
		mutate: mutatePrepaidList,
		isLoading: listLoading,
	} = useMutation('prepaid', fetchPrepaidList)
	return (
		<PrepaidContext.Provider
			value={{
				prepaidList,
				mutatePrepaidList,
				listLoading,
				error: error1,
			}}
		>
			{children}
		</PrepaidContext.Provider>
	)
}

export default Provider
export const usePrepaid = () => {
	const {prepaidList, mutatePrepaidList, listLoading, error} =
		useContext(PrepaidContext)
	return {
		prepaidList,
		mutatePrepaidList,
		listLoading,
		error,
	}
}
