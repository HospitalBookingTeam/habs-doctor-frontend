import { INextPatientResponse } from './base'
import { Patient } from './record'

export interface Operation {
	id: number
	name: string
	price: number
	insuranceStatus: number
	status: number
	type: number
	note: string
	roomTypeId: number
	departmentId?: any
	department?: any
}

export type RequestOperationsForm = Omit<RequestOperations, 'id'>
export type RequestOperations = {
	id: number
	examOperationIds: number[]
}

export type IncomingTestResponse = {
	numericalOrder?: number
	roomNumber: string
	floor: string
	operationId: number
	operationName: string
	qrCode: string
	patient: Patient
	doctor: string
	code?: string
}

export type RequestOperationsResponse = {
	incomingTests: IncomingTestResponse[]
} & INextPatientResponse

export type NewOperation = {
	id: number
	name: string
	data: Operation[]
}
