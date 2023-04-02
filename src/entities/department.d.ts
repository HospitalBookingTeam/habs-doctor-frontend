import { INextPatientResponse } from './base'

export interface Department {
	id: number
	name: string
}

export type IRedirectResponse = {
	departmentName: string
	numericalOrder: number
	roomId: number
	roomNumber: string
	floor: string
}
export type IRedirectDepartmentResponse = {
	redirect: IRedirectResponse[]
} & INextPatientResponse

export type DepartmentRequestDetail = {
	departmentId?: number
	clinicalSymptom: string
}

export type DepartmentRequest = {
	id: number
	details: DepartmentRequestDetail[]
}
