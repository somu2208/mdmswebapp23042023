import { CircularProgress, Pagination } from '@mui/material'
import {
	fetchTotalUnitConsumed,
	lastUpdateTimeForMeters,
	latestSyncDateRevenue,
	totalRevenueGenerated,
	unitConsumptionReport,
} from 'api/services/prepaid'
import ExportExcel from 'components/ExportToXLSX'
import Table from 'components/NewTable'
import TableWrapper from 'components/TableWrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, useNavigate } from 'react-router-dom'
import { add5Hr30Min, showLakThousand } from 'utils'
import excelHeaders from 'utils/prepaidExcelHeaders'
import LookUpFilters from '../LookUpFilters'
import { usePrepaid } from '../Provider'
import { DataGrid, GridValueFormatterParams } from '@mui/x-data-grid';
import { green, red } from "@mui/material/colors";
import {
	Grid,
	Divider as MuiDivider,
	Typography as MuiTypography,
	Chip,
} from "@mui/material";
import styled from "styled-components/macro";
import { spacing } from "@mui/system";
import PrepaidStats from "../PrepaidStats";
import { format } from 'date-fns'
import clsx from "clsx";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import React from "react";

/* progress bar style */
const defaultTheme = createTheme();
const useStyles = makeStyles(
	(theme) =>
		createStyles({
			root: {
				border: `1px solid ${theme.palette.divider}`,
				position: "relative",
				overflow: "hidden",
				width: "100%",
				height: 26,
				borderRadius: 10
			},
			value: {
				position: "absolute",
				lineHeight: "24px",
				width: "100%",
				display: "flex",
				justifyContent: "center",
				color: '#e5e2e2'
			},
			bar: {
				height: "100%",
				"&.low": {
					backgroundColor: "#e52525"
				},
				"&.medium": {
					backgroundColor: "#e58309"
				},
				"&.high": {
					backgroundColor: "#758bf3"
				},
				"&.upermedium": {
					backgroundColor: "#088208"
				}
			}
		}),
	{ defaultTheme }
);
/* end of progress bar style */




const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const PrepaidTable = () => {
	const [page, setPage] = useState<number>(1)
	// const [limit, setLimit] = useState<number>(100)
	const [limit, setLimit] = useState([])

	const handleChange = (event, value) => {
		setPage(value)
		return mutatePrepaidList({ page: value, limit })
	}

	const totalUnitConsumed = useQuery('totalUnitConsumed', () =>
		fetchTotalUnitConsumed()
	)
	const latest_sync_date = useQuery('lastUpdateTimeForMeters', () =>
		lastUpdateTimeForMeters()
	)
	const recharge_amount = useQuery('totalRevenueGenerated', () =>
		totalRevenueGenerated()
	)
	const latestSyncDate = useQuery('latestSyncDateRevenue', () =>
		latestSyncDateRevenue()
	)

	const {
		prepaidList,
		listLoading: loading,
		mutatePrepaidList,
		error,
	} = usePrepaid()

	useEffect(() => {
		mutatePrepaidList({ limit, page })
	}, [])

	const dataPrepare = (data) => {
		return data?.map((item, i) => {
			const latest_reading_kWhVal =
				item?.meter_serial_number?.latest_reading_kWh / 1000
			return {
				...item,
				serialnumber: i + 1,
				usc_number: item.usc_number,
				total_amount_paid: item?.total_amount_paid?.toFixed(2) || '',
				...item.meter_serial_number,
				...item.area_id,
				...item.ero_id,
				...item.section_id,
				...item.consumer_phase_id,
				latest_reading_kWh: latest_reading_kWhVal || '',
				current_balance_timestamp: item?.meter_serial_number
					?.current_balance_timestamp
					? add5Hr30Min(item?.meter_serial_number?.current_balance_timestamp)
					: '',
				current_balance:
					item?.meter_serial_number?.current_balance?.toFixed(2) || '',
				date_of_last_recharge: item?.date_of_last_recharge
					? add5Hr30Min(item?.date_of_last_recharge)
					: '',
				totalAmountConsumed:
					(
						latest_reading_kWhVal * item?.meter_serial_number?.unit_rate
					)?.toFixed(2) || '',
				remainingUnitsLeft:
					(
						item?.meter_serial_number?.current_balance /
						(item?.meter_serial_number?.unit_rate || 1)
					)?.toFixed(2) || '',
			}
		})
	}

	return (
		<Grid justifyContent="space-between" container spacing={6}>
			<Grid item xs={12} lg={12}>
				<Typography variant="h3" gutterBottom>
					Prepaid
				</Typography>
				<Divider my={3} />
				<Grid container mb={3} spacing={3} className="icons_for_card">
					<Grid item xs={12} sm={12} md={4}>
						<PrepaidStats
							title="TOTAL UNITS CONSUMED"
							totalamount={(totalUnitConsumed?.data / 1000)?.toFixed(2) || 0.0}
							unittext="kWh"
							unittext2=""
							chip=""
							// percentagetext="+14%"
							// percentagecolor={green[500]}
							statstime={latest_sync_date?.data && add5Hr30Min(latest_sync_date?.data)}
							illustration="/static/img/illustrations/ibot/1.unitsconsumed.png"
						/>
					</Grid>

					<Grid item xs={12} sm={12} md={4}>
						<PrepaidStats
							title="REVENUE FOR UNITS CONSUMED"
							totalamount={((totalUnitConsumed?.data / 1000) * 5.5)?.toFixed(2) || 0.0}
							unittext=""
							unittext2="Rs."
							chip=""
							// percentagetext="+18%"
							// percentagecolor={green[500]}
							statstime={latest_sync_date?.data && add5Hr30Min(latest_sync_date?.data)}
							illustration="/static/img/illustrations/ibot/2.revenueforunits.png"
						/>
					</Grid>

					<Grid item xs={12} sm={12} md={4}>
						<PrepaidStats
							title="TOTAL REVENUE GENERATED"
							totalamount={(recharge_amount?.data && showLakThousand(recharge_amount?.data)) || 0.0}
							unittext=""
							unittext2=""
							chip=""
							// percentagetext="+12%"
							// percentagecolor={red[500]}
							statstime={latestSyncDate?.data && add5Hr30Min(latestSyncDate?.data)}
							illustration="/static/img/illustrations/ibot/3.revenuegenerated.png"
						/>
					</Grid>
				</Grid>
				{/* <Link to="https://mui.com/components/grid/">Link</Link> */}
				<Grid justifyContent="space-between" container spacing={6}>
					<Grid item xs={12} lg={12} spacing={6}>
						<div className='pb-2 flex justify-end'>

						</div>
						<TableWrapper error={error}>
							<>
								{loading ? (
									// <div className='flex items-center justify-center pt-10'>
									<Grid sx={{ textAlign: "center", pt: 10 }}>
										<CircularProgress />
									</Grid>
								) : (
									<>
										{prepaidList && (
											<Grid>
												{/* <div className='text-sm-count text-right'> */}
												<Grid sx={{textAlign:"right"}} mr={2} className='text-sm-count'>
													<Typography>Total Count: {prepaidList?.meta?.filter_count}</Typography>
												</Grid>
												<Table
													loading={loading}
													tableData={prepaidList?.data}
													columns={columns}
												/>
											</Grid>
										)}
									</>
								)}
							</>
						</TableWrapper>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default PrepaidTable;

const findAvailBalance = (item) => {
	return item.rowcolor = item?.meter_serial_number?.current_balance <= (item?.total_amount_paid / 100 * 30) ? 'soon-empty' : item?.meter_serial_number?.current_balance <= (item?.total_amount_paid / 100 * 40) ? 'soon-avg' : 'full-bal';
}

const convertPercentage = (item) => {
	return item?.total_amount_paid > 0 ? (item?.meter_serial_number?.current_balance / item?.total_amount_paid * 100).toFixed(2) : !isNaN(item?.meter_serial_number?.current_balance / item?.total_amount_paid * 100) && '-';
}


/* progress bar component */
const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
	const { value } = props;
	const valueInPercent = value;
	const classes = useStyles();

	return (
		<Grid className={classes.root}>
			<Grid
				className={classes.value} >{`${valueInPercent.toLocaleString()} %`}</Grid>
			<Grid
				className={clsx(classes.bar, {
					low: valueInPercent <= 30,
					medium: valueInPercent > 30 && valueInPercent <= 70,
					upermedium: valueInPercent > 70 && valueInPercent < 90,
					high: valueInPercent >= 90
				})}
				style={{ maxWidth: `${valueInPercent}%` }}
			/>
		</Grid>
	);
});
interface ProgressBarProps {
	value: number;
}
export function renderProgress(item) {
	return <ProgressBar value={Number(item.row.total_amount_paid > 0 ? (item?.row?.meter_serial_number?.current_balance / item.row.total_amount_paid * 100).toFixed(2) : !isNaN(item?.row?.meter_serial_number?.current_balance / item.row.total_amount_paid * 100) && '-')!} />;
}
/*end of progress bar component */


const columns = [
	{
		field: 'usc_number',
		headerName: 'Service number',
		width: 150,

		renderCell: (item) => {
			if (item?.row?.meter_serial_number) {
				if (item?.row?.meter_serial_number?.meter_serial_number) {
					return (
						<Link
							to={{
								pathname: 'meterdetails',
								// pathname: item?.row?.usc_number,
								search: `?usc_number=${item?.row?.usc_number}&meter_type=${item?.row?.meter_serial_number?.meter_connection_type}&meterId=${item?.row?.meter_serial_number?.meter_serial_number}`,
							}}
							className='hover:underline text-blue-600'
						>
							{item?.row?.usc_number}
						</Link>
					)
				}
				else {
					return (
						<Typography>{item?.row?.usc_number}</Typography>
					)
				}
			}
		}
	},
	{
		field: 'first_name',
		headerName: 'Name',
		width: 190,
	},
	{
		field: 'phone1',
		headerName: 'Phone ',
		width: 100,
	},
	{
		field: 'meter_serial_number',
		headerName: 'Meter serial number',
		width: 160,
		valueGetter: (params) => {
			// console.log("Test", {params});
			let result = [];
			if (params.row.meter_serial_number) {
				if (params.row.meter_serial_number.meter_serial_number) {
					result.push(params.row.meter_serial_number.meter_serial_number);
				}
			}
			return result;
		}
	},
	{
		field: 'latest_reading_kWh',
		headerName: 'Total power consumption (Kwh) ',
		width: 220,
		renderCell : (item) => {
			if(item?.row?.meter_serial_number){
				if(item?.row?.meter_serial_number?.latest_reading_kWh){
					const value = (item?.row?.meter_serial_number?.latest_reading_kWh / 1000).toFixed(2);
					return(value);
				}
			}
		}
	},
	{
		field: 'meter_serial_number.current_balance',
		headerName: 'Current balance (INR) ',
		width: 180,
		valueGetter: (params) => {
			let result = [];
			if (params?.row?.meter_serial_number) {
				if (params?.row?.meter_serial_number?.current_balance) {
					result.push(params?.row?.meter_serial_number?.current_balance?.toFixed(2) || '-');
				}
			}
			return result;
		}
	},
	{
		field: 'current_balance',
		headerName: '% of balance available ',
		type: 'number',
		width: 180,
		renderCell: renderProgress,
	},
	{
		field: 'current_balance_timestamp',
		headerName: 'Balance updated time ',
		hide: 'true',
		width: 170,
		valueGetter: (params) => {
			let result = [];
			if (params?.row?.meter_serial_number) {
				if (params?.row?.meter_serial_number?.current_balance_timestamp) {
					result.push(params?.row?.meter_serial_number?.current_balance_timestamp ? 
						add5Hr30Min(params?.row?.meter_serial_number?.current_balance_timestamp) : '-');
				}
			}
			return result;
		}
	},
	{
		field: 'last_recharge_amount',
		headerName: 'Last recharge amount (INR) ',
		hide: 'true',
		width: 210,
		renderCell: (item) => {
			if(item?.row?.last_recharge_amount){
				const value = (item?.row?.last_recharge_amount).toFixed(2) || '-';
				return(value);
			}
		}
		// render: (item) => {
		// 	return item?.last_recharge_amount?.toFixed(2) || '-'
		// },
	},
	{
		field: 'date_of_last_recharge',
		headerName: 'Latest recharge date ',
		hide: 'true',
		width: 170,
		renderCell: (item) => {
			if(item?.row?.date_of_last_recharge){
				const value = item?.row?.date_of_last_recharge ? add5Hr30Min(item?.row?.date_of_last_recharge) : '-';
				return(value);
			}
		},
	},
	{
		field: 'total_amount_paid',
		headerName: 'Total recharge amount (INR) ',
		hide: 'true',
		width: 210,
		renderCell: (item) => {
			if(item?.row?.total_amount_paid){
				const value = item?.row?.total_amount_paid?.toFixed(2);
				return(value);
			}
		},
	},
	{
		field: 'meter_id',
		headerName: 'Meter id ',
		hide: 'true',
		width: 150,
		valueGetter: (params) => {
			let result = [];
			if (params.row.meter_serial_number) {
				if (params.row.meter_serial_number.meter_id) {
					result.push(params.row.meter_serial_number.meter_id);
				}
			}
			return result;
		}
	},
	{
		field: 'address',
		headerName: 'Address ',
		hide: 'true',
		width: 150,
	}
]

