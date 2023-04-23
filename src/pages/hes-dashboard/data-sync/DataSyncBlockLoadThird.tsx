import {CircularProgress} from '@mui/material'
import {ApexOptions} from 'apexcharts'
import {fetchTodaysDataSyncBlockLoadThree} from 'api/services/dashboard'
import {CHART_HEIGHT} from 'constants/index'
import Chart from 'react-apexcharts'
import { useEffect, useState } from 'react'
import {useQuery} from 'react-query'
import { useMutation } from 'react-query'
import {format, sub} from 'date-fns'

const DataSync2BlockLoadThree = () => {
	const {data, isLoading, error} = useQuery(
		'dataSyncInstantBlockLoad',
		fetchTodaysDataSyncBlockLoadThree
	)
	// console.log("Block Load Three Phase Data: ",data)


	if (isLoading) return <CircularProgress />

	return (
		<div className='max-h-[500px]'>
			{data?.y?.length ? (
				<Chart
					height={CHART_HEIGHT}
					series={[
						{
							type: 'line',
							name: 'Block Load',
							// data: data?.map((item) => item?.value),
							data: data?.y,
						},
					]}
					options={{
						chart: {
							type: 'line',
							toolbar: {
								show: true,
								tools: {
									download: false,
								},
							},
							zoom: {
								enabled: false,
							},
						},
						dataLabels: {
							enabled: true,
							style: {
								fontSize: '12px',
							},
						},
						tooltip: {
							x: {},
						},
						xaxis: {
							type: 'category',
							overwriteCategories: data?.x?.map((item, index) =>
								format(sub(new Date(), {hours: index}) as any, 'dd-MM hh:mm:a')
							),
							title: {text: 'Time', style: {fontSize: '12px'}},
							labels: {
								rotate: -45,
								rotateAlways:true,
								style: {
									fontSize: '12px',
								},
								minHeight: 100,
							},
						},
						yaxis: {
							title: {text: 'Count', style: {fontSize: '12px'}},
							labels: {
								style: {
									fontSize: '12px',
								},
								minWidth: 40,
							},
						},
						...chartOptions,
					}}
				/>
			) : (
				<div className=''>No data available</div>
			)}
		</div>
	)
}

export default DataSync2BlockLoadThree

const chartOptions: ApexOptions = {
	legend: {
		position: 'top',
		offsetY: 0,
	},
	stroke: {
		curve: 'smooth',
	},
	plotOptions: {
		bar: {},
	},
}
