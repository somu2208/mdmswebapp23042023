import React from "react";
import styled, { withTheme } from "styled-components/macro";
import Chart from "react-chartjs-2";
import { MoreVertical } from "react-feather";
import { rgba } from "polished";

import { fetchLast30DaysActiveMeters } from 'api/services/dashboard'
import { fetchLast30DaysActiveMetersAll9May, fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle} from 'api/services/dashboard'
import { useQuery } from 'react-query'
import { fetchLatestDateTimeForDataSync } from 'api/services/time-labels'
import { add, eachDayOfInterval, sub } from 'date-fns'
import format from 'date-fns/format'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";



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


const StackedBarApexes = ({ theme }) => {
  const firstDatasetColor = '#407ddd';
  const secondDatasetColor = '#dee2e6';

  const { data, isLoading, error } = useQuery(
    ['fetchLast30DaysActiveMetersAll'],
    fetchLast30DaysActiveMetersAll9May
  )

  let category = data?.category;
  let series= data?.series;
  // console.log("1/1/1//1/1/1/1",data)
  //let phase3 = data?.series?.series[1].data;
  // console.log("--------------",categories);
  // console.log("-/-/-/-/-/-/-/-/-/-/-/-/-/-",phase1);
  // console.log("/////////////",phase3);

  const {
    data: resTime,
    error: error1,
    isLoading: loading1
  } = useQuery('fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle',fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle);
  // console.log("response data",resTime)

  const datafinal = {
    labels: category,
    datasets: [
      {
        label: "All Phase",
        backgroundColor: firstDatasetColor,
        borderColor: firstDatasetColor,
        hoverBackgroundColor: firstDatasetColor,
        hoverBorderColor: firstDatasetColor,
        data: series,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
      /* {
        label: "3 Phase",
        backgroundColor: firstDatasetColor,
        borderColor: firstDatasetColor,
        hoverBackgroundColor: firstDatasetColor,
        hoverBorderColor: firstDatasetColor,
        data: phase3,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
        borderRadius: 6,
      }, */
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 1,
        max: 10,
        grid: {
          display: false,
        },
        stacked: true,
      },

      x: {
        stacked: true,
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <Card mb={6}>
      {/* <CardHeader title="Active Meters in Last 30 days"/> */}
      <Grid md={12} justifyContent="space-between" container>
        <Grid md={6} p={2} >
          <Typography variant="h6">
            Active meters in last 30 days
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
      <CardContent>
        <ChartWrapper>
          <Chart type="bar" data={datafinal} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(StackedBarApexes);
