interface IProps {
	title?: string
	children: any
}

const FilterCard = ({title, children}: IProps) => {
	return (
		<div className='bg-white rounded-lg flex flex-col items-center justify-center gap-4 py-2 px-6'>
			<div className='space-y-2  w-full'>
				{title && (
					<h4 className='text-secondary font-bold text-[14px] text-center'>
						{title}
					</h4>
				)}
				<div className='flex justify-center'>{children}</div>
			</div>
		</div>
	)
}

export default FilterCard
