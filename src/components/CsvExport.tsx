import {Button, CircularProgress} from '@mui/material'
import {Fragment, useEffect, useRef, useState} from 'react'
import {CSVLink} from 'react-csv'

const CsvExport = ({asyncExportMethod, headers = [], disabled = false}) => {
	const [csvData, setCsvData]: any[] = useState([])
	const [loading, setLoading] = useState(false)
	const csvInstance = useRef<any | null>(null)

	const asyncExportMethodCSV = async () => {
		try {
			setLoading(true)
			const res = await asyncExportMethod()
			// const formatted = res?.replace(/"/g, '')
			setCsvData(res?.data)
			setLoading(false)
		} catch (error) {
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

	const csvLinkProps = {
		data: csvData,
		headers: headers,
		filename: 'export.csv',
	}

	return (
		<Fragment>
			<div
				onClick={() => {
					if (disabled) return
					asyncExportMethodCSV()
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
					Export to CSV
				</Button>
			</div>
			{csvData?.length > 0 ? (
				<CSVLink {...csvLinkProps} ref={csvInstance} />
			) : undefined}
		</Fragment>
	)
}

export default CsvExport
