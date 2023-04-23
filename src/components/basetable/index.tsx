import {
	CircularProgress,
	IconButton,
	Pagination,
	Typography,
	Box,
} from '@mui/material'
import { SystemStyleObject } from '@mui/system'
import _ from 'lodash'
import React, { useState } from 'react'
import { StyledTable } from './styles'
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { DoorBack } from '@mui/icons-material'

interface TableProps {
	// columns: Array<{
	// 	key: string
	// 	title: string
	// 	render?: (item: any) => any
	// }>
	columns: any[]
	tableData: any[]
	loading: boolean
	sx?: SystemStyleObject
	onRowClick?: (v: any) => void
	pageSize: 10
	actions?: Array<{
		icon?: React.ReactElement
		text?: string
		action: (v: any) => void
	}>
	pagination?: {
		totalCount: number
		pageCount: number		
		onChange: (v: number) => void
	}
}

function Table(props: TableProps) {
	const {
		columns,
		tableData,
		sx,
		pagination,
		loading = false,
		onRowClick,
		actions,		
	} = props
	const [page, setPage] = useState(1)

	const handleRowClick = (item: any) => {
		if (!onRowClick) return
		onRowClick(item)
	}

	if (loading && !tableData) {
		return (
			<div className='flex items-center justify-center w-full py-40'>
				<CircularProgress />
			</div>
		)
	}

	// const data={
	// 	columns:columns,
	// 	rows:tableData
	// }

	const data = {
		columns: columns,
		rows: tableData,
		initialState: {}
	}

	//console.log(columns, tableData)
	//console.log(data)
	return (
		<>
			<div style={{ height: 350, width: 'auto' }}>
				<DataGrid
					rows={data.rows}
					
					columns={data.columns}
					getRowId={(row) =>row.usc_number || row.date || row.server_timestamp || row.datetime}
					initialState={{
						...data.initialState,
					}}
				/>
			</div>			
		</>
	)
}

export default Table
