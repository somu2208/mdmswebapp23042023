import React from "react";
import styled, { withTheme } from "styled-components/macro";
import Chart from "react-chartjs-2";
import { MoreVertical } from "react-feather";
import { rgba } from "polished";

import { fetchLast30DaysActiveMetersThird,fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle } from 'api/services/dashboard'
import { useQuery } from 'react-query'
import { fetchLatestDateTimeForDataSync } from 'api/services/time-labels'
import { add, eachDayOfInterval, sub } from 'date-fns'
import format from 'date-fns/format'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { add5Hr30Min } from 'utils';

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

const BarChartThird = ({ theme }) => {
  const secondDatasetColor = '#407ddd';

  const { data, isLoading, error } = useQuery(
    ['last30DaysActiveMetersthird'],
    fetchLast30DaysActiveMetersThird
  )

  const values = data?.data?.data?.map((item) =>
    (item.countDistinct.meter_serial_number)
  )

//console.log(values);

const {
  data: resTime,
  error: error1,
  isLoading: loading11
} = useQuery('fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle',fetchLatestTimeForPowerConsumptionMonthlyAndYearlyDonutSingle);

  const arr=[];
  const xaxis = data?.data?.data?.map((item) =>
     arr.push(`${item.source_timestamp_day}/${item.source_timestamp_month}/${item.source_timestamp_year}`)
  )

  const datafinal = {
    labels: arr,
    datasets: [
      {
        label: "3 Phase",
        backgroundColor: secondDatasetColor,
        borderColor: secondDatasetColor,
        hoverBackgroundColor: secondDatasetColor,
        hoverBorderColor: secondDatasetColor,
        data: values,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
        borderRadius: 6,
      },
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

export default withTheme(BarChartThird);
