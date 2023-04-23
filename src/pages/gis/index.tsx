import Filters from './Filters'
import LocationOn from '@mui/icons-material/LocationOn'
import Map from './Map'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { fetchAreas, fetchMapData, fetchSections } from 'api/services/gis'
import { CircularProgress, Grid, Typography, Divider } from '@mui/material'

const Gis = () => {
	const [count, setCount] = useState({
		active: 0,
		inActive: 0,
	})

	const {
		data: areas,
		error: areasError,
		isLoading: areasLoading,
		mutate: mutateAreas,
	} = useMutation('areas', fetchAreas)

	const {
		data: sections,
		isLoading: sectionsLoading,
		error: sectionsError,
	} = useQuery('sections', fetchSections)

	const {
		data: locations,
		isLoading: mapDataLoading,
		error: mapDataError,
		mutate,
	} = useMutation('mapData', fetchMapData, {
		onSuccess: (locations) => {
			setCount({
				active: locations?.activeCount,
				inActive: locations?.inactiveCount,
			})
		},
	})

	const [state, setState] = useState({
		area: '',
		section: '',
		meterState: 'all',
	})

	const handleChange = (name, value) => {
		setState((prev) => ({ ...prev, [name]: value }))
	}

	useEffect(() => {
		mutate({})
	}, [])

	if (sectionsLoading)
		return (
			<Grid sx={{display:"flex",textAlign:"center",pt:5}}>
				<CircularProgress />
			</Grid>
		)
	return (
		<>

			<Grid>
				<Typography variant="h3" pb={2}> Geographic Info System </Typography>
			</Grid>

			<Divider />

			<Grid pt={3}>
				{sections && (
					<Filters
						state={state}
						handleChange={handleChange}
						sections={sections}
						areas={areas}
						mutate={mutate}
						setState={setState}
						mutateAreas={mutateAreas}
					/>
				)}
			</Grid>
			<Grid pt={2}>
				<div className='min-h-[500px] rounded-lg bg-white'>
					<header className='p-4 flex justify-between'>
						{/* <h3 className='font-bold text-lg'>Google Map</h3> */}
						<Typography variant="h3" sx={{fontWeight:"bold"}}> Google Map </Typography>
						<div className='flex gap-10'>
							<div className='space-y-1 flex gap-4'>
								<LocationOn color='success' />
								{/* <p className='font-bold'>Active Meters ({count.active})</p> */}
								<Typography sx={{fontWeight:"bold"}}> Active Meters ({count.active}) </Typography>
							</div>
							<div className='space-y-1 flex gap-4'>
								<LocationOn color='error' />
								{/* <p className='font-bold'>Outage Meters ({count.inActive})</p> */}
								<Typography sx={{fontWeight:"bold"}}> Outage Meters ({count.inActive}) </Typography>
							</div>
						</div>
					</header>
					<Map
						locations={locations?.data}
						loading={mapDataLoading}
						error={mapDataError}
						mutate={mutate}
						state={state}
					/>
				</div>
			</Grid>
		</>
	)
}

export default Gis
Gis.title = 'Geographic Info System'
