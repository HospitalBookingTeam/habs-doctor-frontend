import { CheckupRecordStatus } from '../utils/renderEnums'
import { PaginationData } from './base'

export interface Patient {
	id: number
	phoneNumber: string
	name: string
	gender: number
	dateOfBirth: string
	address: string
	bhyt: string
}

export interface TestRecord {
	id: number
	date: string
	numericalOrder: number
	status: number
	resultFileLink: string
	resultDescription?: string
	patientName: string
	operationId: number
	operationName: string
	roomNumber: string
	floor: string
	roomId: number
	patientId: number
	checkupRecordId: number
	doctorName: any
	doctorId: any
}

export interface Detail {
	id: number
	quantity: number
	usage: string
	unit: string
	morningDose: number
	middayDose: number
	eveningDose: number
	nightDose: number
	medicineName: string
	prescriptionId: number
	medicineId: number
}

export interface Prescription {
	id: number
	timeCreated: string
	note: string
	checkupRecordId: number
	details: Detail[]
}

export interface ReExamCheckup {
	date: string
	operationIds: number[]
	note: string
}

export interface IcdDiseases {
	icdDiseaseId: number
	icdDiseaseName: string
	icdCode: string
}

export interface CheckupRecord {
	patientData: Patient
	testRecords: TestRecord[]
	prescription: Prescription
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	reExamDate: string
	date: string
	clinicalSymptom: string
	diagnosis: string
	doctorAdvice: string
	pulse: number
	bloodPressure: number
	temperature: number
	doctorName: string
	patientName: string
	departmentName: string
	patientId: number
	doctorId: number
	departmentId: number
	icdDiseases: IcdDiseases[]
	icdCode: string
	isReExam: boolean
	hasReExam: boolean
	reExamNote: string | null
	reExam: ReExamCheckup | null
	reExamTreeCode: string | null
	floor?: string
	roomNumber?: string
}

export type RecordItem = {
	id: number
	status: CheckupRecordStatus
	numericalOrder: any
	date: any
	doctorName: any
	patientName: string
	departmentName: any
	isReExam: boolean
}

export type CheckupRecordByIdResponse = {
	data: RecordItem[]
} & PaginationData

export type CheckupFormData = {
	bloodPressure?: number
	temperature?: number
	pulse?: number
	doctorAdvice?: string
	diagnosis?: string
	icdDiseaseIds?: number[]
}

export type RequiredTestReExam = {
	examOperationIds?: number[]
}
export type RequestReExam = {
	id: number
	patientId: number
	departmentId: number
	requiredTest: RequiredTestReExam
	note?: string
	reExamDate?: string
}

export type RequestReExamForm = Omit<
	RequestReExam,
	'id' | 'patientId' | 'departmentId' | 'requiredTest' | 'reExamDate'
> &
	RequiredTestReExam & { reExamDate?: Date }
