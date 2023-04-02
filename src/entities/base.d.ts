export type PaginationData = {
	pageIndex: number
	pageSize: number
	totalItem: number
	totalPage: number
}

export type AutocompleteOption = {
	label: string
	value: string | number
}

export type INextPatientResponse = {
	success: boolean
	nextCheckupRecordId: number
	nextPatientName: string
}
