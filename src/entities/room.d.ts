export interface Room {
	id: number
	roomNumber: string
	floor: string
	note: string
	roomTypeId: number
	departmentId: number
	departmentName: string
	roomTypeName: string
	isGeneralRoom: boolean
}

export type TestRoom = {
	numericalOrder: number
	roomNumber: string
	floor: string
	operationId: number
	operationName: string
}
