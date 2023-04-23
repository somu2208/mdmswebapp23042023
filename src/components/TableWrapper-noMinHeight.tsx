const TableWrapper = ({children, error}) => {
	if (error) return <p className='text-center'>Server Error</p>
	return (
		<section className='bg-white rounded-xl shadow-md p-3'>
			{children}
		</section>
	)
}

export default TableWrapper
