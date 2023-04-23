import {Download} from '@mui/icons-material'
import {Box, Button, CircularProgress} from '@mui/material'
import {useRef, useState} from 'react'
import ReactExport from 'react-data-export'
import {useMutation} from 'react-query'
import _ from 'lodash'
import {toast} from 'react-toastify'
const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

interface ExpotTpExcelProps {
	labels: {key: string; title: string; render?: any; excelRender?: any}[]
	asyncExportMethod: () => Promise<any>
}

const ExportToExcel = ({labels, asyncExportMethod}: ExpotTpExcelProps) => {
	const buttonRef = useRef<HTMLButtonElement>()
	const [excelData, setExcelData] = useState()

	const {isLoading, mutate} = useMutation('export', asyncExportMethod, {
		onSuccess: (data) => {
			const prepareData = data?.data?.map((dataItem) => {
				return labels
					.map((label) => ({
						[label.key]: label?.excelRender
							? label.excelRender(_.get(dataItem, label.key))
							: label.render
							? label.render(dataItem[label.key])
							: _.get(dataItem, label.key),
					}))
					.reduce((acc, curr) => ({...acc, ...curr}), {})
			})

			console.log(prepareData)

			setExcelData(prepareData)
			buttonRef.current.click()
		},
		onError: () => {
			toast.error('Something Went Wrong')
		},
	})
	return (
		<>
			<Button
				size='small'
				onClick={() => mutate()}
				endIcon={isLoading ? <CircularProgress size={20} /> : <Download />}
				className='bg-white hover:bg-gray-100'
				disabled={isLoading}
				variant='outlined'
				color='secondary'
			>
				Export to Excel
			</Button>

			<Box display='none'>
				<ExcelFile
					element={
						<Button
							ref={buttonRef}
							size='small'
							endIcon={<Download />}
							variant='outlined'
							color='secondary'
						>
							Download
						</Button>
					}
				>
					<ExcelSheet data={excelData || []} name='Employees'>
						{labels.map((label) => {
							return <ExcelColumn label={label.title} value={label.key} />
						})}
					</ExcelSheet>
				</ExcelFile>
			</Box>
		</>
	)
}

export default ExportToExcel
