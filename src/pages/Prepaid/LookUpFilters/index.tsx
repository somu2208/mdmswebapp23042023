import React, { useState } from 'react'
import FilterCard from './FilterCard'
import { format } from 'date-fns'
import { add5Hr30Min, showLakThousand } from '../../../utils'
import {
	Box,
	Card as MuiCard,
	CardContent as MuiCardContent,
	Chip as MuiChip,
	Typography as MuiTypography,
	Grid
} from "@mui/material";
import { spacing } from "@mui/system";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import styled, { css } from "styled-components/macro";

const Typography = styled(MuiTypography)(spacing);
interface IState {
	idType: 'customer_id' | 'meter_id'
	searchValue: string
}
const initialState: IState = {
	idType: 'customer_id',
	searchValue: '',
}

const LookUpFilters = ({
	totalUnitConsumed,
	latest_sync_date,
	recharge_amount,
	latestSyncDate,
}) => {
	return (
		<div className='grid grid-cols-3 gap-5 icons_for_card'>
			<FilterCard title='TOTAL UNITS CONSUMED' >
				<img src="/static/img/illustrations/ibot/1.unitsconsumed.png" className="prepaid_icon_size"/>
				<Typography variant="h3" mb={3}>
					{(totalUnitConsumed?.data / 1000)?.toFixed(2) || 0.0} kWh
				</Typography>
				<Typography variant="caption">
					<Grid className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{latest_sync_date?.data && add5Hr30Min(latest_sync_date?.data)}</Grid>
				</Typography>

			</FilterCard>
			<FilterCard title='REVENUE FOR UNITS CONSUMED'>
				<img src="/static/img/illustrations/ibot/2.revenueforunits.png" className="prepaid_icon_size"/>
				<Typography variant="h3" mb={3}>
					Rs. {((totalUnitConsumed?.data / 1000) * 5.5)?.toFixed(2) || 0.0}
				</Typography>
				<Typography variant="caption">
					<Grid className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{latest_sync_date?.data && add5Hr30Min(latest_sync_date?.data)}{' '}</Grid>
				</Typography>

			</FilterCard>
			<FilterCard title='TOTAL REVENUE GENERATED'>
				<img src="/static/img/illustrations/ibot/3.revenuegenerated.png" className="prepaid_icon_size"/>
				<Typography variant="h3" mb={3}>
					Rs.{' '}
					{(recharge_amount?.data &&
						showLakThousand(recharge_amount?.data)) ||
						0.0}
				</Typography>
				<Typography variant="caption">
					<Grid className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{latestSyncDate?.data && add5Hr30Min(latestSyncDate?.data)}</Grid>
				</Typography>

			</FilterCard>
		</div>
	)
}

export default LookUpFilters
