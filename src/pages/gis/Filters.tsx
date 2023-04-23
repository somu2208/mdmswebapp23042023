import { Button, MenuItem, TextField, Grid, Typography } from '@mui/material'
import { useState } from 'react'

const Filters = ({
	state,
	handleChange,
	sections = [],
	areas = [],
	mutate,
	setState,
	mutateAreas,
}) => {
	const handleResetFilters = () => {
		setState({
			area: '',
			section: '',
		})
		mutate({
			areaId: '',
		})
	}

	return (
		<>
			<div className='grid grid-cols-4 gap-2'>
				{/* <FilterCard title='Zone'>
					<TextField
						fullWidth
						size='small'
						select
						value={state?.zone}
						onChange={(e) => handleChange('zone', e.target.value)}
					>
						<MenuItem value=''>All</MenuItem>
					</TextField>
				</FilterCard>
				<FilterCard title='Circle'>
					<TextField
						fullWidth
						size='small'
						select
						value={state?.circle}
						onChange={(e) => handleChange('circle', e.target.value)}
					>
						<MenuItem value=''>All</MenuItem>
					</TextField>
				</FilterCard>
				<FilterCard title='Division'>
					<TextField
						fullWidth
						select
						size='small'
						value={state?.division}
						onChange={(e) => handleChange('division', e.target.value)}
					>
						<MenuItem value=''>All</MenuItem>
					</TextField>
				</FilterCard>
				*/}
				<FilterCard title=''>
					<TextField
						size='small'
						select
						fullWidth
						value={state?.section}

						label="Section"
						id="standard-required"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}

						onChange={(e) => {
							handleChange('section', e.target.value)
							mutateAreas({ sectionId: e.target.value })
						}}
					>
						{sections?.map((section) => (
							<MenuItem key={section.section_id} value={section.section_id}>
								{section.section_name}
							</MenuItem>
						))}
					</TextField>
				</FilterCard>
				<FilterCard title=''>
					<TextField
						size='small'
						fullWidth
						select
						value={state?.area}

						label="Area"
						id="standard-required"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}

						onChange={(e) => {
							handleChange('area', e.target.value)
							mutate({ areaId: e.target.value, meterState: 'all' })
						}}
					>
						{areas.map((area) => (
							<MenuItem key={area.area_id} value={area.area_id}>
								{area.area_name}
							</MenuItem>
						))}
					</TextField>
				</FilterCard>
				<FilterCard title=''>
					<TextField
						size='small'
						fullWidth
						select
						value={state?.meterState}

						label="Meter state"
						id="standard-required"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}

						onChange={(e) => {
							handleChange('meterState', e.target.value)
							mutate({ meterState: e.target.value, areaId: state.area })
						}}
					>
						<MenuItem value='all'>All</MenuItem>
						<MenuItem value='active'>Active Meters</MenuItem>
						<MenuItem value='inactive'>Outage Meters</MenuItem>
					</TextField>
				</FilterCard>
				<FilterCard title=''>
					<Button
						onClick={handleResetFilters}
						color='primary'
						variant='contained'
					>
						Reset Filters
					</Button>
				</FilterCard>
			</div>
		</>
	)
}

export default Filters

const FilterCard = ({ title, children }) => {
	return (
		// <div className='bg-white rounded-lg flex flex-col items-center justify-center gap-4 p-2 px-6'>
		<Grid sx={{backgroundColor:"white", p:2, borderRadius:2}}>
			<Grid spacing={1} sx={{ width: "100%" }}>
				{/* //  <div className='space-y-1 w-full'> 
				//  {title && (
				// 	<h4 className='text-secondary font-bold text-[14px] text-center'>
				// 		{title}
				// 	</h4>
				// )}  */}
				<Grid sx={{ textAlign: "center" }}>{children}</Grid>
			</Grid>
		</Grid>
	)
}
