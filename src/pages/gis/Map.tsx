import {CircularProgress} from '@mui/material'
import {useRef, useEffect} from 'react'

const Map = ({mutate, locations, error, loading, state}) => {
	const ref = useRef()

	useEffect(() => {
		mutate({areaId: state.areaId})
	}, [])

	useEffect(() => {
		if (!ref.current || !locations) return
		
		const styledMapType = new google.maps.StyledMapType(
			[
			  { elementType: "geometry", stylers: [{ color: "#e3eaef" }] },
			  { elementType: "labels.text.fill", stylers: [{ color: "#000000" }] },
			  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
			  {
				featureType: "landscape.natural",
				elementType: "geometry",
				stylers: [{ color: "#e3eaef" }],
			  },
			  {
				featureType: "poi",
				elementType: "geometry",
				stylers: [{ color: "#e3eaef" }],
				// need to change color code
			  },
			  {
				featureType: "poi",
				elementType: "labels.text.fill",
				stylers: [{ color: "#000000" }],
			  },
			  {
				featureType: "poi.park",
				elementType: "geometry.fill",
				stylers: [{ color: "#e3eaef" }],
			  },
			  {
				featureType: "poi.park",
				elementType: "labels.text.fill",
				stylers: [{ color: "#447530" }],
			  },
			  {
				featureType: "road",
				elementType: "geometry",
				stylers: [{ color: "#f5f1e6" }],
			  },
			  {
				featureType: "road.arterial",
				elementType: "geometry",
				stylers: [{ color: "#fdfcf8" }],
			  },
			  {
				featureType: "road.highway",
				elementType: "geometry",
				stylers: [{ color: "#f8c967" }],
			  },
			  {
				featureType: "road.highway",
				elementType: "geometry.stroke",
				stylers: [{ color: "#e9bc62" }],
			  },
			  {
				featureType: "road.highway.controlled_access",
				elementType: "geometry",
				stylers: [{ color: "#e98d58" }],
			  },
			  {
				featureType: "road.highway.controlled_access",
				elementType: "geometry.stroke",
				stylers: [{ color: "#db8555" }],
			  },
			  {
				featureType: "road.local",
				elementType: "labels.text.fill",
				stylers: [{ color: "#806b63" }],
			  },
			  {
				featureType: "transit.line",
				elementType: "geometry",
				stylers: [{ color: "#dfd2ae" }],
			  },
			  {
				featureType: "transit.line",
				elementType: "labels.text.fill",
				stylers: [{ color: "#8f7d77" }],
			  },
			  {
				featureType: "transit.line",
				elementType: "labels.text.stroke",
				stylers: [{ color: "#ebe3cd" }],
			  },
			  {
				featureType: "transit.station",
				elementType: "geometry",
				stylers: [{ color: "#e3eaef" }],
			  },
			  {
				featureType: "water",
				elementType: "geometry.fill",
				stylers: [{ color: "#3b7ddd" }],
			  },
			  {
				featureType: "water",
				elementType: "labels.text.fill",
				stylers: [{ color: "#3b7ddd" }],
			  },
			],
			{ name: "Styled Map" }
		)
		
		const map = new google.maps.Map(ref.current, {
			zoom: 13,
			center: {
				lat: locations[Math.floor(locations.length / 2)]?.lat,
				lng: locations[Math.floor(locations.length / 2)]?.long,
			},
			mapTypeControlOptions: {
				mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"],
			},
			  
		})
		map.mapTypes.set("styled_map", styledMapType);
		map.setMapTypeId("styled_map");
		
		var infoWindow = (location) =>
			new google.maps.InfoWindow({
				content: `<div>
        <p>Meter Number : ${location?.meterId || '-'}</p>
        </div>`,
			})

		const svgMarker = (fillColor: string) => ({
			path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
			fillColor,
			fillOpacity: 1,
			strokeWeight: 0,
			rotation: 0,
			scale: 1.4,
			anchor: new google.maps.Point(15, 30),
		})

		locations.forEach((location) => {
			const marker = new google.maps.Marker({
				position: new google.maps.LatLng(location?.lat, location?.long),
				map: map,
				// icon: location.isActive
				// 	? `/images/green_marker.png`
				// 	: `/images/red_marker.png`,
				icon: location.isActive ? svgMarker('#4CBB17') : svgMarker('#ff0000'),
				clickable: true,
			})
			google.maps.event.addDomListener(marker, 'click', function () {
				infoWindow(location).open(map, marker)
			})
		})
	}, [locations])

	// if (!state.area || !state.section)
	// 	return (
	// 		<div className='text-center pt-5'>Please select section and area</div>
	// 	)
	if (loading)
		return (
			<div className='flex justify-center pt-10'>
				<CircularProgress />
			</div>
		)
	if (locations && !locations.length)
		return <p className='text-center'>No locations found</p>
	return (
		<div>
			<section ref={ref} id='google_map' style={{height: '500px'}}></section>
		</div>
	)
}

export default Map
