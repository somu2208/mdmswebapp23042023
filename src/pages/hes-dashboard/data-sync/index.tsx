import { Box, Tabs, Tab, Typography, CircularProgress, Grid } from '@mui/material'
import { fetchTodaysDataSyncInstant } from 'api/services/dashboard'
import { fetchLatestDateTimeForDataSync } from 'api/services/time-labels'
import { fetchTimeForInstantSingle, fetchTimeForInstantThree } from 'api/services/time-labels'
import { format } from 'date-fns'
import { useState } from 'react'
import { useQuery } from 'react-query'
import DataSync2BlockLoadAll from './DataSyncBlockLoadAll'
import DataSync2BlockLoadSingle from './DataSyncBlockLoadSingle'
import DataSync2BlockLoadThree from './DataSyncBlockLoadThird'
import DataSync2 from './DataSyncBlockLoad'
import DataSync3 from './DataSyncDaily'
import DataSyncDailyAll from './DataSyncDailyAll'
import DataSyncDailySingle from './DataSyncDailySingle'
import DataSyncDailyThree from './DataSyncDailyThree'
import DataSyncInstant from './DataSyncInstant'
import DataSyncInstantAll from './DataSyncInstantAll'
import DataSyncInstantSingle from './DataSyncInstantSingle'
import DataSyncInstantThree from './DataSyncInstantThree'
import styled, { withTheme } from "styled-components/macro";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import {
	Card as MuiCard,
	CardContent as MuiCardContent,
	CardHeader,
	IconButton,
} from "@mui/material";
import { spacing } from "@mui/system";

const MeterDataSyncGraph = ({ phase }) => {
	const [value, setValue] = useState(0)

	// const { data: time } = useQuery(
	// 	'latest-date-time-sync',
	// 	fetchLatestDateTimeForDataSync
	// )

	const { data: timeInstantSingle } = useQuery(
		'latest-date-time-sync-instant-single',
		fetchTimeForInstantSingle
	)

	const { data: timeInstantThree } = useQuery(
		'latest-date-time-sync-instant-three',
		fetchTimeForInstantThree
	)


	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const Card = styled(MuiCard)(spacing);

	const CardContent = styled(MuiCardContent)`
	  &:last-child {
		padding-bottom: 14px;
	  }
	`;

	const ChartWrapper = styled.div`
	  height: 240px;
	  width: 100%;
	`;


	return (
		<>
			<Card mb={6} className="graph_section_P">
				{/* <Grid className='flex justify-between items-center pr-5 pt-5 pb-4'> */}
				<Grid md={12} container>
					<Grid md={6}>
						<CardHeader title="Data sync of all meters for last 24 hours" />
					</Grid>

					{/* <Grid className='prepaidtimeclass'> */}
					<Grid md={6} sx={{ textAlign: "right" }} p={2} >
						<AccessAlarmIcon className="alarmicon" />{''}

						{(phase.phase == '1p') ? (`${!!timeInstantSingle?.data?.data[0]?.server_timestamp
							? format(
								new Date(timeInstantSingle?.data?.data[0]?.server_timestamp),
								'dd/MM/yyyy HH:mm:ss'
							)
							: '--'
							}`) : (phase.phase == '3p') ? (`${!!timeInstantThree?.data?.data[0]?.server_timestamp
								? format(
									new Date(timeInstantThree?.data?.data[0]?.server_timestamp),
									'dd/MM/yyyy HH:mm:ss'
								)
								: '--'
								}`) : (`${!!timeInstantSingle?.data?.data[0]?.server_timestamp
									? format(
										new Date(timeInstantSingle?.data?.data[0]?.server_timestamp),
										'dd/MM/yyyy HH:mm:ss'
									)
									: '--'
									}`)
						}

						{/* {`${!!timeInstantThree?.data?.data[0]?.server_timestamp
						? format(
							new Date(timeInstantThree?.data?.data[0]?.server_timestamp),
							'dd/MM/yyyy HH:mm:ss'
						)
						: '--'
						}`} */}


						{/* {`${!!time?.data?.data[0]?.server_date_time
						? format(
							new Date(time?.data?.data[0]?.server_date_time),
							'dd/MM/yyyy HH:mm:ss'
						)
						: '--'
						}`} */}


					</Grid>
				</Grid>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label='basic tabs example'
						className="meter-data-navigation-2"
						sx={{ padding: '0px 16px' }}
					>
						<Tab label='Instantaneous data' {...a11yProps(0)} />
						<Tab label='Block load data' {...a11yProps(1)} />
						<Tab label='Daily load data' {...a11yProps(2)} />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					{/* <DataSyncInstant /> */}
					{/* <DataSyncInstantSingle /> */}
					{/* <DataSyncInstantThree /> */}
					{(phase.phase == '1p') ? <DataSyncInstantSingle /> : (phase.phase == '3p') ? <DataSyncInstantThree /> : <DataSyncInstantAll />}
				</TabPanel>
				<TabPanel value={value} index={1}>
					{/* <DataSync2 /> */}
					{/* <DataSync2BlockLoadSingle /> */}
					{/* <DataSync2BlockLoadThree />  */}

					{(phase.phase == '1p') ? <DataSync2BlockLoadSingle /> : (phase.phase == '3p') ? <DataSync2BlockLoadThree /> : <DataSync2BlockLoadAll />}

				</TabPanel>
				<TabPanel value={value} index={2}>
					{/* <DataSync3 /> */}
					{/* <DataSyncDailySingle /> */}
					{/* <DataSyncDailyThree /> */}

					{(phase.phase == '1p') ? <DataSyncDailySingle /> : (phase.phase == '3p') ? <DataSyncDailyThree /> : <DataSyncDailyAll />}

				</TabPanel>
				

			</Card>

		</>
	)
}

export default MeterDataSyncGraph

function TabPanel(props) {
	const { children, value, index, ...other } = props

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
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
