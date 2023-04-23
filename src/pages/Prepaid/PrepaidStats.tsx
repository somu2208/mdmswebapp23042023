import React from "react";
import styled, { css } from "styled-components/macro";
import { rgba } from "polished";

import {
  Box,
  Grid,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

const Typography = styled(MuiTypography)(spacing);

const Card = styled(MuiCard)`
  position: relative;
  background: rgba(55,111,208,0.125);
  color: #376fd0;
  ${(props) =>
    props.illustration &&
    css`
        background: rgba(55,111,208,0.125);
		color: #376fd0;
    `}
`;

const CardContent = styled(MuiCardContent)`
  position: relative;

  &:last-child {
    padding-bottom: 16px;
  }
`;

const Chip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: #4782da;
  color: #fff;
  margin-bottom: 16px;

  span {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

const Percentage = styled(MuiTypography)`
  span {
    color: ${(props) => props.percentagecolor};
    font-weight: 600;
    background: ${(props) => rgba(props.percentagecolor, 0.1)};
    padding: 2px;
    border-radius: 3px;
    margin-right: 8px;
  }

  ${(props) =>
    props.illustration &&
    css`
      color: #4caf50;
    `}
`;

const IllustrationImage = styled.img`
  height: 120px;
  position: absolute;
  right: 4px;
  bottom: 4px;
  display: none;

  @media (min-width: 1700px) {
    display: block;
  }
`;

const PrepaidStats = ({
  title,
  totalamount,
  statstime,
  illustration,
  // percentagetext,
  // percentagecolor,
  unittext,
  unittext2,
  chip,
}) => {
  return (
    <Card illustration={illustration}>
      <CardContent>
        <Typography variant="h6" mb={3}>
          {title}
        </Typography>        
		<Typography variant="h3" mb={3}>
			<Box fontWeight="fontWeightRegular">
				{unittext2} {totalamount} {unittext}
			</Box>
		</Typography>   
		{/* <Percentage
          variant="subtitle2"
          color="textSecondary"
          // percentagecolor={percentagecolor}
          illustration={illustration}
        > */}
          {/* <span>{percentagetext}</span>  */}
          <Grid className="prepaidtimeclass" pb={1}><AccessAlarmIcon className="alarmicon" />{''} {statstime}</Grid>
        {/* </Percentage> */}
		{!illustration && !chip && <Chip label={chip} />}
      </CardContent>
      {!!illustration &&(
        <IllustrationImage src={illustration} alt="Illustration" />
      )}
    </Card>
  );
};

export default PrepaidStats;
