import {Box, styled, Tab, Tabs, Grid, Typography, Divider as MuiDivider,} from '@mui/material'
import {ChangeEvent, useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import Billing from './Billing'
import BlockLoad from './BlockLoad'
import DailyLoad from './DailyLoad'
import Instantaneous from './Instantaneous'
import { spacing } from "@mui/system";

const Divider = styled(MuiDivider)(spacing);
const TabsContainerWrapper = styled(Box)(
	({theme}) => `
    padding: ${theme.spacing(2)};
    padding-bottom: 0;
  `
)

const MetersDataPage = () => {
	const [currentTab, setCurrentTab] = useState('single-phase')
	const [search, setSearch] = useSearchParams()

	const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value)
		setSearch({phase: value})
	}

	useEffect(() => {
		setSearch({phase: 'single-phase'})
	}, [])

	return (
		<>
			<Grid justifyContent="space-between" container>
				<Typography variant="h3" gutterBottom sx={{ color: "black"}} >
					Meter Data
				</Typography>

				<TabsContainerWrapper className="phasebutton1">
					<Tabs
						onChange={handleTabsChange}
						value={currentTab}
						variant='scrollable'
						scrollButtons='auto'
						textColor='primary'
						indicatorColor='primary'
					>
						{tabs.map((tab) => (
							<Tab key={tab.key} label={tab.label} value={tab.key} className="meter-data-meternavigation-2" />
						))}
					</Tabs>
				</TabsContainerWrapper>

				<Grid md={12} >
				<Box>
					{currentTab === 'single-phase' && <SinglePhase phase={currentTab} />}
					{currentTab === 'three-phase' && <ThreePhase phase={currentTab} />}
				</Box>
				</Grid>
			</Grid>
		</>
	)
}

const tabs = [
	{
		label: '1P',
		key: 'single-phase',
	},
	{
		label: '3P',
		key: 'three-phase',
	},
]

const SinglePhase = ({phase}) => {
	const [currentTab, setCurrentTab] = useState('instantaneous')

	const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value)
	}

	return (
		<>
			<TabsContainerWrapper>
				<Tabs
					onChange={handleTabsChange}
					value={currentTab}
					variant='scrollable'
					scrollButtons='auto'
					textColor='primary'
					indicatorColor='primary'
					className='meter-data-navigation-2'
				>
					{tabs2.map((tab) => (
						<Tab key={tab.key} label={tab.label} value={tab.key} />
					))}
				</Tabs>
			</TabsContainerWrapper>
			<Box sx={{p: 1}} className="tabboxborder">
				{currentTab === 'instantaneous' && <Instantaneous />}
				{currentTab === 'block-load' && <BlockLoad />}
				{currentTab === 'daily-load' && <DailyLoad />}
				{currentTab === 'billing' && <Billing />}
			</Box>
		</>
	)
}
const ThreePhase = ({phase}) => {
	const [currentTab, setCurrentTab] = useState('instantaneous')

	const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value)
	}

	return (
		<>
			<TabsContainerWrapper>
				<Tabs
					onChange={handleTabsChange}
					value={currentTab}
					variant='scrollable'
					scrollButtons='auto'
					textColor='primary'
					indicatorColor='primary'
					className='meter-data-meternavigation-3'
				>
					{tabs2.map((tab) => (
						<Tab key={tab.key} label={tab.label} value={tab.key} className="meter-data-meternavigation-3" />
					))}
				</Tabs>
			</TabsContainerWrapper>
			<Box sx={{p: 1}} className="tabboxborder">
				{currentTab === 'instantaneous' && <Instantaneous />}
				{currentTab === 'block-load' && <BlockLoad />}
				{currentTab === 'daily-load' && <DailyLoad />}
				{currentTab === 'billing' && <Billing />}
			</Box>
		</>
	)
}

export default MetersDataPage
const tabs2 = [
	{
		key: 'instantaneous',
		label: 'Instantaneous',
	},
	{
		key: 'block-load',
		label: 'Block Load',
	},
	{
		key: 'daily-load',
		label: 'Daily Load',
	},
	{
		key: 'billing',
		label: 'Billing',
	},
]
