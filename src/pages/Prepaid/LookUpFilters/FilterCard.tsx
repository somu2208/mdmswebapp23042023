import styled, { css } from "styled-components/macro";
import { rgba } from "polished";

import {
  Box,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

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


interface IProps {
	title?: string
	children: any
}

const FilterCard = ({title, children}: IProps) => {
	return (
		<Card>
			<CardContent>
				{title && (
					<Typography variant="h6" mb={3}>
						{title}
					</Typography>
				)}
				<div>{children}</div>
			</CardContent>
		</Card>
	)
}

export default FilterCard
