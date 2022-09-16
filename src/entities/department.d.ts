export interface Department {
	id: number
	name: string
}

export type DepartmentResponse = {
	departmentName: string
	numericalOrder: number
	roomId: number
	roomNumber: string
	floor: string
}

export type DepartmentRequestDetail = {
	departmentId: number
	clinicalSymptom: string
}

export type DepartmentRequest = {
	id: number
	details: DepartmentRequestDetail[]
}
