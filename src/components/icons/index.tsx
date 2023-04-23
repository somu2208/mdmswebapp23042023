import relay_on from './images/relay_on.png'
import relay_off from './images/relay_off.png'

import bulb_on from './images/bulb_on.png'
import bulb_off from './images/bulb_off.png'

export const RelayOn = () => {
	return (
		<div className=''>
			<img className='h-auto w-12' src={relay_on} />
		</div>
	)
}

export const RelayOff = () => {
	return (
		<div className=''>
			<img className='h-auto w-12' src={relay_off} />
		</div>
	)
}

export const PowerOn = () => {
	return (
		<div className=''>
			<img className='h-5 w-auto' src={bulb_on} />
		</div>
	)
}

export const PowerOff = () => {
	return (
		<div className=''>
			<img className='h-5 w-auto' src={bulb_off} />
		</div>
	)
}
