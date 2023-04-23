import {Box} from '@mui/material'
import PowerConsumption from './PowerConsumption'

const CustomerPowerConsumption = ({data}) => {
	
	return (
			<>
				{/* {search.get('meterId') ? ( */}
					<div className=' min-h-[600px]'>
						<Box >
							<PowerConsumption data={data} />						
						</Box>
						
					</div>
				{/* ) : (
					<p>There is no meter for this customer</p>
				)} */}
			</>
	)
}

export default CustomerPowerConsumption;