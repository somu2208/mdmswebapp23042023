import {fetchCustomerList} from 'api/services/customers'
import {createContext, useContext} from 'react'
import {useMutation} from 'react-query'

const CustomersContext = createContext(null)

const Provider = ({children}) => {
	const {
		data: customerList,
		error: error1,
		mutate: mutateCustomerList,
		isLoading: listLoading,
	} = useMutation('customers', fetchCustomerList)

	return (
		<CustomersContext.Provider
			value={{
				customerList,
				mutateCustomerList,
				listLoading,
				error: error1,
			}}
		>
			{children}
		</CustomersContext.Provider>
	)
}

export default Provider
export const useCustomers = () => {
	const {customerList, mutateCustomerList, listLoading, error} =
		useContext(CustomersContext)
	return {
		customerList,
		mutateCustomerList,
		listLoading,
		error,
	}
}
