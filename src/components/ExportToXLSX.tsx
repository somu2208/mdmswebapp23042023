import ExcelExport from 'export-xlsx'
import {Button, CircularProgress} from '@mui/material'
import {Fragment, useEffect, useRef, useState} from 'react'
import {add5Hr30Min} from 'utils'

const ExportExcel = ({
	asyncExportMethod,
	headers = {},
	dataPrepare,
	disabled = false,
}) => {
	const [csvData, setCsvData]: any[] = useState([])
	const [loading, setLoading] = useState(false)
	const csvInstance = useRef<any | null>(null)
	const excelExport = new ExcelExport()

	const asyncExportMethodExcel = async () => {
		try {
			setLoading(true)
			const res = await asyncExportMethod()
			const data = await dataPrepare(res.data)
			setCsvData(data)
			setLoading(false)
			const dd = [
				{
					data: data,
				},
			]
			excelExport.downloadExcel(headers, dd)
		} catch (error) {
			console.log(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		if (
			csvData &&
			csvInstance &&
			csvInstance.current &&
			csvInstance.current.link
		) {
			setTimeout(() => {
				csvInstance.current.link.click()
				setCsvData([])
			})
		}
	}, [csvData])

	return (
		<Fragment>
			<div
				onClick={() => {
					if (disabled) return
					asyncExportMethodExcel()
				}}
			>
				<Button
					disabled={loading || disabled}
					className='bg-white hover:bg-gray-100'
					endIcon={
						loading ? <CircularProgress color='secondary' size={15} /> : null
					}
					component='span'
					size='small'
					color='secondary'
					variant='outlined'
				>
					Export to XLSX
				</Button>
			</div>
		</Fragment>
	)
}

export default ExportExcel
