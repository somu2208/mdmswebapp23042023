import React from "react";
import { Speed } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import {
	fetchDisconnectedMeters,
	fetchMtd,
	fetchRelayDisconnectedMeters,
	fetchTotalDeployedMeters,
	fetchTotalInstalledMeters,
	fetchTotalMeterCount,
	fetchYtd,
} from 'api/services/dashboard'
import {
	fetchLatestDateTimeForDailyLoadSync,
	fetchLatestDateTimeForDataSyncForMeters,
	fetchSyncTimeForInactiveMeters,
} from 'api/services/time-labels'
import { MetricsCard } from 'pages/dashboard'
import MeterDataSyncGraph from 'pages/hes-dashboard/data-sync'
import { useQueries } from 'react-query'
import { Link } from 'react-router-dom'
import {
	Grid,
	Divider as MuiDivider,
	Typography as MuiTypography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { spacing } from "@mui/system";
import styled from "styled-components/macro";

import Stats from "./Stats";
import DoughnutChart from "./DoughnutChart";
import DoughnutChartAll from "./DoughnutChartAll";
import DoughnutChartSingle from "./DoughnutChartSingle";
import DoughnutChartThird from "./DoughnutChartThird";
import add from 'date-fns/add'
import format from 'date-fns/format'
import { useState } from 'react'
// import DataSyncInstantSinglePhase from '../hes-dashboard/data-sync/DataSyncInstantSinlePhase'

// import DataSyncInstantBarAllPhase from '../hes-dashboard/data-sync/DataSyncInstantBarAllPhase'

const Divider = styled(MuiDivider)(spacing);
const Typography = styled(MuiTypography)(spacing);

const HesDashboard = () => {
	const [
		{ data: totalDeployedMeters, error: error2, isLoading: loading2 },
		{ data: totalMeters, error: error5, isLoading: loading5 },
		{ data: installedMeters, error: error3, isLoading: loading3 },
		{ data: disconnectedMeters, error: error6, isLoading: loading6 },
		{ data: mtd, error: error7, isLoading: loading7 },
		{ data: ytd, error: error8, isLoading: loading8 },
		{ data: relayDiconnected, error: error9, isLoading: loading9 },
		{ data: meterLatestSycTime, error: error10, isLoading: loading10 },
		{ data: dailyLoadSyncTime, error: error11, isLoading: loading11 },
		{ data: inactiveSyncTime, error: error12, isLoading: loading12 },
	] = useQueries([
		{ queryKey: 'totalDeployedMeters', queryFn: fetchTotalDeployedMeters },
		{ queryKey: 'totalMeters', queryFn: fetchTotalMeterCount },
		{ queryKey: 'installedMeters', queryFn: fetchTotalInstalledMeters },
		{ queryKey: 'disconnectedMeters', queryFn: fetchDisconnectedMeters },
		{ queryKey: 'mtd', queryFn: fetchMtd },
		{ queryKey: 'ytd', queryFn: fetchYtd },
		{ queryKey: 'relayDisconnected', queryFn: fetchRelayDisconnectedMeters },
		{
			queryKey: 'latestSyncTimeForMeters',
			queryFn: fetchLatestDateTimeForDataSyncForMeters,
		},
		{
			queryKey: 'latestSyncTimeForDailyLoad',
			queryFn: fetchLatestDateTimeForDailyLoadSync,
		},
		{
			queryKey: 'syncTimeForInactiveMeters',
			queryFn: fetchSyncTimeForInactiveMeters,
		},
	])


	const [phase, setPhase] = useState<any>({
		phase: 'all',
	})


	const [totalmeter, setTotalmeter] = useState<any>("");
	const [disconnect, setDisconnect] = useState<any>("");
	const [instalm, setInstalm] = useState<any>("");
	const [totalcommunication, setTotalcommunication] = useState<any>("");
	const [installcommunication, setInstallcommunication] = useState<any>("");

	const meterLatest = meterLatestSycTime?.data?.data[0].latest_sync_date;
	const commundate = inactiveSyncTime?.data?.data[0].date_updated;
	const meterLatestSyc = add(new Date(meterLatest), {
		hours: 5,
		minutes: 30,
	})


	const constcommunicationdate = add(new Date(commundate), {
		hours: 5,
		minutes: 30,
	})


	const handleUpdateKpData = (ev) => {

		setPhase({
			phase: ev.currentTarget.dataset.data_kp
		})
		let selectedVal = ev.currentTarget.dataset.data_kp;

		let listItems = document.querySelectorAll(".list-group-item");

		for (let i = 0; i < listItems.length; i++) {
			listItems[i].classList.remove("active-a");
		}

		ev.currentTarget.classList.add("active-a");

		if (selectedVal == '1p') {
			var totalmeter = totalDeployedMeters?.data?.data[0]?.count.meter_serial_number || '-';
			var instalm = installedMeters?.data?.data[0]?.count?.meter_serial_number || '-';

			var totalcommunication = totalMeters?.data?.data[0]?.count?.meter_serial_number || '0';
			var installcommunication = (installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number) || '0';
			var disconnect = relayDiconnected?.data?.data[0]?.count?.meter_serial_number || '0';
			// setDisconnect(relayDiconnected?.data?.data[0]?.reduce((acc, meter) => acc + meter?.count?.meter_serial_number, 0));
			// console.log("1p data : ", disconnect)
		} else if (selectedVal == '3p') {

			var totalmeter = totalDeployedMeters?.data?.data[1]?.count.meter_serial_number || '-';
			var instalm = installedMeters?.data?.data[1]?.count?.meter_serial_number || '-';

			var totalcommunication = totalMeters?.data?.data[1]?.count?.meter_serial_number || '0';
			var installcommunication = (installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number) || '0';
			var disconnect = relayDiconnected?.data?.data[1]?.count?.meter_serial_number || '0';
			// console.log("3p data : ", disconnect)
			// // setDisconnect(relayDiconnected?.data?.data[1]?.reduce((acc, meter) => acc + meter?.count?.meter_serial_number, 0))
			// console.log("installcommunication", disconnect)
		}
		else if(selectedVal == 'all'){

			var totalmeter1p = totalDeployedMeters?.data?.data[0]?.count.meter_serial_number || '';
			var totalmeter3p = totalDeployedMeters?.data?.data[1]?.count.meter_serial_number || '';
			var totalmeter = totalmeter1p + totalmeter3p;

			var instalm1p = installedMeters?.data?.data[0]?.count?.meter_serial_number || '';
			var instalm3p = installedMeters?.data?.data[1]?.count?.meter_serial_number || '';
			var instalm = instalm1p + instalm3p;

			var totalcommunication1p = totalMeters?.data?.data[0]?.count?.meter_serial_number || '';
			var totalcommunication3p = totalMeters?.data?.data[1]?.count?.meter_serial_number || '';
			var totalcommunication = totalcommunication1p + totalcommunication3p;

			var installcommunication1p = installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number;
			var installcommunication3p = installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number;
			var installcommunication = (installcommunication1p + installcommunication3p) || '0';

			var disconnect = (relayDiconnected?.data?.data[0]?.count?.meter_serial_number || 0) + (relayDiconnected?.data?.data[1]?.count?.meter_serial_number || 0);
			// console.log("All data : ", disconnect)
			// setDisconnect(relayDiconnected?.data?.data[0]?.reduce((acc, meter) => acc + meter?.count?.meter_serial_number, 0) + relayDiconnected?.data?.data[1]?.reduce((acc, meter) => acc + meter?.count?.meter_serial_number, 0) )

			// console.log("1p data : ", totalmeter)
			// var totalmeter = totalDeployedMeters?.data?.data.reduce((acc, meter) => acc + +meter?.count?.meter_serial_number,0) || '-';
			// var instalm = installedMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0) || '-';

			// var totalcommunication = totalMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0) || '-';
			// var installcommunication = installedMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0) - totalMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0);
		}

		setTotalmeter(totalmeter);
		setInstalm(instalm);
		setTotalcommunication(totalcommunication);
		setInstallcommunication(installcommunication);
		setDisconnect(disconnect);
	}

	const isLoading =
		loading2 ||
		loading3 ||
		loading5 ||
		loading6 ||
		loading7 ||
		loading8 ||
		loading9 ||
		loading10 ||
		loading11 ||
		loading12
	if (isLoading)
		return (
			<div className='flex items-center justify-center w-full h-screen'>
				<CircularProgress />
			</div>
		)

	if (error2 || error3 || error7) return <p>Error</p>

	const totalamount = (totalmeter) ? totalmeter : (totalDeployedMeters?.data?.data[0]?.count.meter_serial_number + totalDeployedMeters?.data?.data[1]?.count.meter_serial_number);
	const amount = (instalm) ? instalm : (installedMeters?.data?.data[0]?.count?.meter_serial_number + installedMeters?.data?.data[1]?.count?.meter_serial_number);
	const percent = ((amount / totalamount) * 100).toFixed(2);

	// console.log("totalamount",totalamount)
	// console.log("amount",amount)

	
	let chk_percent = '';
	if(percent === 'NaN'){
		chk_percent = "100.00";
	}else{
		chk_percent = percent;
	}
	

	const com_amount=((totalcommunication) ? totalcommunication : (totalMeters?.data?.data[0]?.count?.meter_serial_number + totalMeters?.data?.data[1]?.count?.meter_serial_number)) || '0';
	const com_totalamount=((installcommunication) ? installcommunication :((installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number) + (installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number))) || '0';
	// const com_percent = ((com_totalamount / com_amount) * 100).toFixed(2);
	// console.log("com_amount",com_amount)
	// console.log("com_totalamount",com_totalamount)
	// console.log("installcommunication",installcommunication)


	const com_data = com_amount - Number(com_totalamount);
	const com_percent = ((com_data / com_amount) * 100).toFixed(2);
	// console.log("com_data",com_data)
	// console.log("com_percent",com_percent)
	// const disconnect_load = totalamount - amount;
	// console.log("relayDiconnected?.data?.data",disconnect_load)


	const disconnect_data = ((relayDiconnected?.data?.data[0]?.count?.meter_serial_number || 0) + (relayDiconnected?.data?.data[1]?.count?.meter_serial_number || 0));
	// console.log("disconnect_data 0000000",relayDiconnected?.data?.data[0]?.count?.meter_serial_number || 0)
	// console.log("disconnect_data 333333",relayDiconnected?.data?.data[1]?.count?.meter_serial_number || 0)

	// console.log("disconnect_data",disconnect_data)
	// console.log("disconnect",disconnect)

	// let abc = (disconnect) ? disconnect : disconnect_data;
	// console.log("abc",abc)


	let percent_chk = '';
	if(com_percent === 'NaN'){
		percent_chk = "100.00";
	}else{
		percent_chk = com_percent;
	}

	return (
		<React.Fragment>
			<Grid justifyContent="space-between" container spacing={6} className="anshu_siddharth">
				<Grid item xs={12} lg={9}>
					<Typography variant="h3" gutterBottom>
						HES
					</Typography>
				</Grid>
				<Grid item xs={12} lg={3} className="text-right phasebutton">
					<div className="btn-group btn-group-sm p-formselect activebutton" role="group" aria-label="Small button group">
						<button type="button" className="list-group-item active-a" data-data_kp="all" onClick={handleUpdateKpData}>All</button>
						<button type="button" className="list-group-item" data-data_kp="1p" onClick={handleUpdateKpData}>1P</button>
						<button type="button" className="list-group-item" data-data_kp="3p" onClick={handleUpdateKpData}>3P</button>
					</div>
				</Grid>
			</Grid>
			<Divider my={3} />
			<Grid container spacing={6} mb={6}>
				<Grid item xs={12} lg={7}>
					<Grid container spacing={3} className="icons_for_card">
						<Grid item xs={12} sm={12} md={6}>
							{/* <Stats
							title="INSTALLED METERS"
							totalamount = {(totalmeter)?totalmeter:totalDeployedMeters?.data?.data.reduce(
								(acc, meter) => acc + +meter?.count?.meter_serial_number,0)}
							amount={(instalm)?instalm:installedMeters?.data?.data.reduce((acc, meter) => acc + meter?.count?.meter_serial_number,0)} 
							chip=""
							statstime = {meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
							percentagetext="+14%"
							percentagecolor={green[500]}
							illustration="/static/img/illustrations/ibot/1.installed-meter.png"
						/> */}

							<Stats
								title="TOTAL/INSTALLED METERS"
								amount={(totalmeter) ? totalmeter : (totalDeployedMeters?.data?.data[0]?.count.meter_serial_number + totalDeployedMeters?.data?.data[1]?.count.meter_serial_number) || totalDeployedMeters?.data?.data[0]?.count.meter_serial_number}
								totalamount={(instalm) ? instalm : (installedMeters?.data?.data[0]?.count?.meter_serial_number + installedMeters?.data?.data[1]?.count?.meter_serial_number) || installedMeters?.data?.data[0]?.count?.meter_serial_number}
								chip=""
								statstime={meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
								percentagetext={"+" + chk_percent + "%"}
								percentagecolor={green[500]}
								illustration="/static/img/illustrations/ibot/1.installed-meter.png"
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							{/* <Link to='/meters/data?phase=single-phase'> */}
								{/* <Stats
									title="COMMUNICATION"
									totalamount={(totalcommunication) ? totalcommunication : totalMeters?.data?.data.reduce(
										(acc, meter) => acc + meter?.count?.meter_serial_number,
										0
									)}
									amount={(installcommunication) ? installcommunication :
										installedMeters?.data?.data.reduce(
											(acc, meter) => acc + meter?.count?.meter_serial_number,
											0
										) -
										totalMeters?.data?.data.reduce(
											(acc, meter) => acc + meter?.count?.meter_serial_number,
											0
										)
									}
									chip=""
									statstime={commundate && format(constcommunicationdate, 'dd/MM/yyyy HH:mm:ss')}
									percentagetext="+14%"
									percentagecolor={green[500]}
									illustration="/static/img/illustrations/working.png"
								/> */}

								<Stats
									title="COMM/NON-COMM METERS"
									amount={(totalcommunication) ? totalcommunication : (totalMeters?.data?.data[0]?.count?.meter_serial_number + totalMeters?.data?.data[1]?.count?.meter_serial_number) || totalMeters?.data?.data[0]?.count?.meter_serial_number}
									totalamount={(installcommunication) ? installcommunication :((installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number) + (installedMeters?.data?.data[1]?.count?.meter_serial_number - totalMeters?.data?.data[1]?.count?.meter_serial_number)) || (installedMeters?.data?.data[0]?.count?.meter_serial_number - totalMeters?.data?.data[0]?.count?.meter_serial_number)}
									chip=""
									statstime={commundate && format(constcommunicationdate, 'dd/MM/yyyy HH:mm:ss')}
									percentagetext={"+" + percent_chk + "%"}
									percentagecolor={green[500]}
									illustration="/static/img/illustrations/working.png"
								/>

							{/* </Link> */}
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Stats
								title="DISMANTLE METERS"
								totalamount=""
								amount={disconnectedMeters?.data?.data?.reduce(
									(acc, meter) => acc + meter?.count?.meter_serial_number,
									0
								)}
								chip=""
								statstime={meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
								percentagetext="NA"
								percentagecolor={green[500]}
								illustration="/static/img/illustrations/ibot/3.dismanteledmeters.png"
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Stats
								title="LOAD DISCONNECTED METERS"
								totalamount=""
								amount={(disconnect) ? disconnect : disconnect_data}
								// amount={relayDiconnected?.data?.data?.reduce((acc, meter) => acc + meter?.count?.meter_serial_number, 0)}
								chip=""
								statstime={meterLatest && format(meterLatestSyc, 'dd/MM/yyyy HH:mm:ss')}
								percentagetext="NA"
								percentagecolor={green[500]}
								illustration="/static/img/illustrations/ibot/4.loaddisconnectedmeters.png"
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} lg={5} className="docnutsection">
					{ (phase.phase=='1p')?<DoughnutChartSingle />:(phase.phase=='3p')?<DoughnutChartThird />:<DoughnutChartAll /> }
				</Grid>
			</Grid>
			<Grid justifyContent="space-between" container>
				<Grid item xs={12} lg={12} spacing={6}>
					<MeterDataSyncGraph phase={phase} />
				</Grid>
				{/* <Grid item xs={12} lg={12} spacing={6}>
					<DataSyncInstantSinglePhase />
				</Grid> */}
			</Grid>
		</React.Fragment>
	)
}

export default HesDashboard
HesDashboard.title = 'HES'