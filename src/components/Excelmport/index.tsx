import { Alert, Button, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import XLSX from 'xlsx'
import FileDownloadIcon from '@mui/icons-material/FileDownload';


export default function ExcelImport({ postTo, redirectPath }) {
	const [data, setData] = useState([])
	const [error, setError] = useState('')
	const naviagte = useNavigate()

	const handleFile = async (file) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			/* Parse data */
			const ab = e.target.result
			const wb = XLSX.read(ab, { type: 'array' })
			/* Get first worksheet */
			const wsname = wb.SheetNames[0]
			const ws = wb.Sheets[wsname]
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws)
			if (data.length > 100) {
			}
			/* Update state */
			setData(data)
		}
		reader.readAsArrayBuffer(file)
	}

	const submit = async () => {
		try {
			await postTo(data)
			toast.success('Successfully imported data')

			naviagte(redirectPath)
		} catch (error) {
			setError(
				error.response.data?.errors?.map((item) => item?.message).join('\n') ??
				'Server Error'
			)
		}
	}

	return (
		<Grid className='space-y-5 max-w-screen-md'>
			<Grid md={12} container>
				<Grid md={6}>
					<Typography>Upload excel sheet (Max rows: 200)</Typography>
				</Grid>
				<Grid md={6} sx={{ textAlign: "right" }}>
					{/* <Typography> Download sample excel <a href="/static/img/illustrations/Prepaid_customers.xlsx" download> */}
					<Typography> Download sample <a href="http://52.172.182.71:8055/assets/a63a8f99-21e3-4b23-a0f3-02ae8e95d092.xlsx?access_token=1234" download>
						 <FileDownloadIcon />
					</a> </Typography>
				</Grid>
			</Grid>

			<DataInput handleFile={handleFile} />
			<Button
				color='primary'
				variant='contained'
				disabled={!data.length || data.length > 200}
				onClick={submit}
				className="submit_btn_add"
			>
				Submit
			</Button>
			{error && (
				<Grid>
					<Alert severity='error'>{error}</Alert>
				</Grid>
			)}
		</Grid>
	)
}
// ;[
// 	{
// 		message: 'Field has to be unique.',
// 		extensions: {
// 			code: 'RECORD_NOT_UNIQUE',
// 			collection: 'consumer',
// 			field: null,
// 			invalid: 'asd',
// 		},
// 	},
// ]

function DataInput({ handleFile }) {
	const handleChange = (e) => {
		const files = e.target.files
		if (files && files[0]) handleFile(files[0])
	}

	return (
		<form>
			<input
				className='form-control block w-full px-3 py-1.5 text-base font-normal  text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
				type='file'
				id='file'
				accept={SheetJSFT}
				onChange={handleChange}
			/>
		</form>
	)
}

/* list of supported file types */
const SheetJSFT = [
	'xlsx',
	'xlsb',
	'xlsm',
	'xls',
	'xml',
	'csv',
	'txt',
	'ods',
	'fods',
	'uos',
	'sylk',
	'dif',
	'dbf',
	'prn',
	'qpw',
	'123',
	'wb*',
	'wq*',
	'html',
	'htm',
]
	.map((x) => `.${x}`)
	.join(',')

/* generate an array of column objects */
const make_cols = (refstr) => {
	let o = [],
		C = XLSX.utils.decode_range(refstr).e.c + 1
	for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i }
	return o
}
