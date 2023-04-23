import Card from './components/DetailsCard'
import {Grid, Typography} from '@mui/material'
const PersonalDetails = ({title, children}) => {
	
	return (
		<Card title={title}>
			<Grid  className='grid'>
				{children}
				{/* <div className='col-span-4 flex gap-4 items-center mt-5'>
					
				</div> */}
				<Grid  item className='col-span-4 flex gap-4 items-center mt-5'>
				
				</Grid>


			</Grid>
		</Card>
	)
}


export default PersonalDetails
