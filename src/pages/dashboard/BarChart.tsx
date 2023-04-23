import React from "react";
import styled, { withTheme } from "styled-components/macro";
import Chart from "react-chartjs-2";
import { MoreVertical } from "react-feather";
import { rgba } from "polished";

import { fetchLast30DaysActiveMetersAll9May } from 'api/services/dashboard'
import { useQuery } from 'react-query'
import { fetchLatestDateTimeForDataSync } from 'api/services/time-labels'
import { add, eachDayOfInterval, sub } from 'date-fns'
import format from 'date-fns/format'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import faker from "faker";
//import { add5Hr30Min } from 'utils'

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

const BarChart= ({ theme }) => {
  const firstDatasetColor = '#407ddd';
  const secondDatasetColor = '#dee2e6';

  const { data, isLoading, error } = useQuery(
    'last30DaysActiveMetersSingle',
    fetchLast30DaysActiveMetersAll9May
  )
  //console.log(data?.data?.data?.countDistinct.meter_serial_number);
//console.log(data.category);

// console.log(data.series);


const datafinal = {
    labels: data.category,
    // labels,
    datasets: [
      {
        label: "All Phase",
        backgroundColor: firstDatasetColor,
        borderColor: firstDatasetColor,
        hoverBackgroundColor: firstDatasetColor,
        hoverBorderColor: firstDatasetColor,
        data: data.series,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
        borderRadius: 6,
        // datafinal: labels.map(() => faker.datatype.number({ min: 0, max: 10 })),
      }
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
        // labels:2,
        // min: 1,
        // max: 5,
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
          <Typography variant="caption">
            <div className="prepaidtimeclass" ><AccessAlarmIcon className="alarmicon" />{''}{localStorage.getItem('syncdatetime')}</div>
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

export default withTheme(BarChart);