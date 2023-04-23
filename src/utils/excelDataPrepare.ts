interface ExcelPrepare {
	name: string
	render?: (value: string | number | any) => any
	// dataType: string;
	key: string
}

export function excelDataPrepare(
	data: ExcelPrepare[],
	fileName: string,
	sheetName?: string
) {
	const headers = {
		fileName: fileName,
		workSheets: [
			{
				sheetName: sheetName || fileName,
				startingRowNumber: 0,
				gapBetweenTwoTables: 0,
				tableSettings: {
					data: {
						tableTitle: 'Score',
						headerGroups: [
							{
								name: 'Score',
								key: 'score',
							},
						],
						headerDefinition: data?.map((item) => ({
							name: item.name,
							key: item.key,
							width: 25,
						})),
					},
				},
			},
		],
	}

	return {headers}
}
