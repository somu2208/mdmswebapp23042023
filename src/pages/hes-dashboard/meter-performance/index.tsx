import {Box, Typography, Tabs, Tab} from '@mui/material'
import {fetchLatestDateTimeForDataSync} from 'api/services/time-labels'
import {add} from 'date-fns'
import format from 'date-fns/format'
import {useState} from 'react'
import {useQuery} from 'react-query'
import Daily from './Daily'
import Monthly from './Monthly'
import Yearly from './Yearly'

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

const MeterPerformancePanel = () => {
	const [value, setValue] = useState(0)
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const {
		data: latestTime,
		isLoading,
		error,
	} = useQuery('latestTime', fetchLatestDateTimeForDataSync)

	// console.log(latestTime.data.data[0].source_date_time)
	const date = latestTime?.data?.data[0]?.source_date_time
	const addedDate = add(new Date(date), {
		hours: 5,
		minutes: 30,
	})

	if (isLoading || !latestTime) return <div className='h-[540px]'></div>

	return (
		<div className='h-[80vh] border border-gray-50 shadow-lg rounded-lg'>
			<div className='flex items-center justify-between'>
				<h1 className='text-xl font-bold px-5 py-3'>Meter Performance</h1>
				<div className='pr-5'>
					<span>Lastest updated time : </span>
					{latestTime && (
						<span className='text-sm text-gray-600'>
							{format(addedDate, 'yyyy-MM-dd HH:mm')}
						</span>
					)}
				</div>
			</div>
			<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label='basic tabs example'
				>
					<Tab label='Day' {...a11yProps(0)} />
					<Tab label='Monthly' {...a11yProps(1)} />
					<Tab label='Yearly' {...a11yProps(2)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<Daily />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Monthly />
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Yearly />
			</TabPanel>
		</div>
	)
}

export default MeterPerformancePanel
