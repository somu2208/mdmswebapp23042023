import { Button, Grid, Typography, TextField as MuiTextField  } from '@mui/material'
import styled from "styled-components/macro";
import { spacing } from "@mui/system";

const TextFieldSpacing = styled(MuiTextField)(spacing);
const TextField = styled(TextFieldSpacing)`width: 100%;background-color: #efefef8a`;

interface ICardProps {
	children: any
	icon?: any
	title: string
	subtitle?: string
}

const DetailsCard = ({ children, title, icon: Icon, subtitle }: ICardProps) => {
	return (
		// <div className='bg-white shadow-sm rounded-lg border border-gray-200 border-opacity-30 w-full'>
		<Grid md={12} sx={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 3, }}>
			{/* <div className='bg-gray-200 p-2 px-4 rounded-t-lg flex gap-2 items-center justify-between'> */}
			<Grid sx={{borderBottom:"1px solid #eee", p: 1 }}>
				<Typography variant="h6" p={1} sx={{ fontWeight: 500, color: "black" }}>{title}</Typography>
				<Typography variant="h6" sx={{ color: "gray" }}>{subtitle}</Typography>
			</Grid>
			<Grid>
				<Typography p={2}>{children}</Typography>
			</Grid>
		</Grid>
	)
}

DetailsCard.Image = ({ src }) => {
	return (
		<img src={`/images/${src}.png`} className='w-full h-full object-contain' />
	)
}

DetailsCard.Item = ({ label, value, isLarge = false }) => {
	return (
		<Grid p={2}>
			{/* <p className='text-sm text-gray-500 mb-1.5'>{label}</p> */}
			{/* <Typography variant="h6" mb={1} sx={{ color: "gray", fontWeight: 500 }}> {label} </Typography>
			<Typography sx={{ fontSize: 14 }}> {value === null || value === undefined ? '--' : value} </Typography> */}
			<TextField						
				value={value === null || value === undefined ? '--' : value}
				label={label}
				id="standard-read-only-input"
				variant="outlined"	
				InputLabelProps={{
					shrink: true,
				}}
				InputProps={{
					readOnly: true,
				}}
			/>
		</Grid>
	)
}

DetailsCard.Button = ({ label, onClick, startIcon }) => {
	return (
		<Button
			startIcon={startIcon}
			className='font-medium text-sm px-7'
			size='small'
			variant='outlined'
			color='secondary'
			onClick={onClick}
		>
			{label}
		</Button>
	)
}

export default DetailsCard
