import {InsertPhotoOutlined, LocationOn} from '@mui/icons-material'
import { TextField as MuiTextField, } from '@mui/material'
import Card from './components/DetailsCard'
import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import styled from "styled-components/macro";
import { spacing } from "@mui/system";

const TextFieldSpacing = styled(MuiTextField)(spacing);

const TextField = styled(TextFieldSpacing)`
  width: 100%;
`;

const PersonalDetails = ({c}) => {
	const handleViewOnMap = () => {}
	const handleViewImage = () => {}

	return (
		<Card title='Customer information'>
			<Grid item xs={12} lg={12} md={12} className='grid gap-4 grid-cols-3 gap-y-8'>
				<Card.Item
					label='Customer name'
					value={[c?.first_name, c?.last_name].join(' ')}
					isLarge={true}
				/>
				<Card.Item label='Customer service number' value={c?.usc_number} />
				<Card.Item label='Tarrif' value={c?.tarrif} />
				<Card.Item label='Contact number' value={c?.phone1} />
				<Card.Item label='Address' value={c?.address} />
				<Card.Item label='Circle' value={c?.circle_id?.circle_name} />
				<Card.Item label='Division' value={c?.division_id?.division_name} />
				<Card.Item
					label='Sub division'
					value={c?.sub_division_id?.sub_division_name}
				/>
				<Card.Item
					label='Sub station'
					value={c?.sub_station_id?.sub_station_name}
				/>
				<Card.Item label='Feeder' value={c?.feeder_id?.feeder_name} />
				<Card.Item label='Dtc' value={c?.dtc_id?.dtc_name} />
				<Card.Item
					label='Meter number'
					isLarge={true}
					value={c?.meter_serial_number?.meter_serial_number}
				/>
				<Card.Item
					label='Meter make'
					value={c?.meter_serial_number?.meter_make}
				/>
				<Card.Item
					label='Protocol type'
					value={c?.meter_serial_number?.meter_protocol_classification_id?.name}
				/>
				{/* <Card.Item label='CT.Ratio' value={c?.meter_serial_number?.ct_ratio} />
				<Card.Item label='PT.Ratio' value={c?.meter_serial_number?.pt_ratio} /> */}
				{/* <div className='col-span-4 flex gap-4 items-center mt-5'>
					<Card.Button
						startIcon={<LocationOn />}
						label='View On Map'
						onClick={handleViewOnMap}
					/>
					<Card.Button
						startIcon={<InsertPhotoOutlined />}
						label='View Image'
						onClick={handleViewImage}
					/>
				</div> */}
			</Grid>
		</Card>
	)
}

export default PersonalDetails
