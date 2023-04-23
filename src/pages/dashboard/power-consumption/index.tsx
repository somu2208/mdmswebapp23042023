import {Box, Tabs, Tab, Typography, Grid, CircularProgress, Card as MuiCard,} from '@mui/material'
import {fetchLatestTimeForPowerConsumption, fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle} from 'api/services/dashboard'
import {add} from 'date-fns'
import format from 'date-fns/format'
import {useState} from 'react'
import {useQuery} from 'react-query'
import DayWiseConsumption from './DayWiseConsumption'
import DayWiseConsumptionAllPhase from './DayWiseConsumptionAllPhase'
import DayWiseConsumptionSinglePhase from './DayWiseConsumptionSinglePhase'
import DayWiseConsumptionThirdPhase from './DayWiseConsumptionThirdPhase'
import PowerConsumption from './PowerConsumption'
import PowerConsumptionSinglePhase from './PowerConsumptionSinglePhase'
import PowerConsumptionThirdPhase from './PowerConsumptionThirdPhase'
import PowerConsumptionAllPhase from './PowerConsumptionAllPhase'
import ThirtyDays from './ThirtyDays'
import ThirtyDaysAll from './ThirtyDaysAll'
import ThirtyDaysSingle from './ThirtyDaysSingle'
import ThirtyDaysThird from './ThirtyDaysThird'
import styled, { withTheme } from "styled-components/macro";
import { spacing } from "@mui/system";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';


const Card = styled(MuiCard)`
  position: relative;
  background: #;
  padding-right:10px;
	padding-bottom: 7px;  
`;
function TabPanel(props) {
	const {children, value, index, ...other} = props

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{p: 3}}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}
function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

const Day = ({phase}) => {
	const [value, setValue] = useState(0)

	const {
		data: latestTime,
		error: error4,
		isLoading: loading4,
	} = useQuery('datetime', fetchLatestTimeForPowerConsumption)
	// console.log("latest time for power consumption",latestTime)
	
	const date = latestTime?.data?.data[0].server_date_time
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})
	
	const {
		data: resTime,
		error: error1,
		isLoading: loading1 
	} = useQuery('fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle',fetchLatestTimeForPowerConsumptionMonthlyAndYearlySingle);
	// console.log("respone date and time",resTime)
	

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	if (loading4) return <CircularProgress />

	return (
		<Card mb={8}>
			<Grid md={12} justifyContent="space-between" container>				
				<Grid md={6} p={2} >
					<Typography variant="h6">
						Power consumption in kWh
					</Typography>
				</Grid>
				<Grid md={6} p={2}>
					{/* <Typography variant="caption">
						<div className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{localStorage.getItem('syncdatetime')}</div>
					</Typography> */}
					<Typography variant="caption">
						<div className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{resTime}</div>
					</Typography>
				</Grid>				
			</Grid>
			<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label='basic tabs example'
					className="meter-data-navigation-2"
					sx={{ml:2}}
				>
					<Tab label='Last 24 hours' {...a11yProps(0)} />
					<Tab label='Today' {...a11yProps(1)} />
					<Tab label='Last 30 Days' {...a11yProps(2)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				{(phase.phase=='1p')?<PowerConsumptionSinglePhase />:(phase.phase=='3p')?<PowerConsumptionThirdPhase />:<PowerConsumptionAllPhase />}
			</TabPanel>
			<TabPanel value={value} index={1}>
				{(phase.phase=='1p')?<DayWiseConsumptionSinglePhase />:(phase.phase=='3p')?<DayWiseConsumptionThirdPhase />:<DayWiseConsumptionAllPhase />}
			</TabPanel>
			<TabPanel value={value} index={2}>
				{(phase.phase=='1p')?<ThirtyDaysSingle />:(phase.phase=='3p')?<ThirtyDaysThird />:<ThirtyDaysAll />}
			</TabPanel>
		</Card>
	)
}

export default Day
