const Text = ({children, center = false, ...restProps}) => {
	return (
		<p
			className={`text-base font-normal ${center ? 'text-center' : ''}`}
			{...restProps}
		>
			{children}
		</p>
	)
}

Text.Label = ({children, center = false, ...restProps}) => {
	return (
		<label
			{...restProps}
			className={`text-xs font-normal text-gray-500 pb-1 ${
				center ? 'text-center' : ''
			}`}
		>
			{children}
		</label>
	)
}

Text.Link = ({children, ...rest}) => (
	<li className='list-none font-normal text-primary' {...rest}>
		{children}
	</li>
)

export default Text
