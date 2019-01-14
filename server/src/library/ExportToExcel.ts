import { isEmpty, merge } from 'lodash'
const excel = require('node-excel-export')

export default function exportToExcel(name: string, data: object[], options: object) {
	const specification = {}
	let opt = {}
	const styles = {
		headerDark: {
			fill: {
				fgColor: {
					rgb: 'FFFFFFFF'
				}
			},
			font: {
				color: {
					rgb: '00000000'
				},
				sz: 14,
				bold: true,
				underline: true
			},
			alignment: {
				vertical: 'center',
				horizontal: 'center'
			}
		},
		cellDark: {
			font: {
				color: {
					rgb: '00000000'
				},
				sz: 12
			},
			alignment: {
				vertical: 'center',
				horizontal: 'bottom'
			},
			numFmt:'dd/mm/yyyy'
		}
	}

	for (const key in data[0]) {
		specification[`${key}`] = {
			displayName: `${key}`,
			headerStyle: styles.headerDark,
			width: 140,
			cellStyle: styles.cellDark
		}
	}

	if (!isEmpty(options)) {
		opt = merge({}, specification, options)
	}

	const report = excel.buildExport([
		{
			name,
			specification: !isEmpty(options) ? opt : specification,
			data
		}
	])

	return report
}
