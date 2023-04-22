import { SessionType } from '@/utils/renderEnums'

export type CheckupQueueItem = {
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	checkinTime: string
	patientName: string
	patientId: number
	isReExam: boolean
	isKickedFromQueue?: any
	session: SessionType
}

export type CheckupQueue = CheckupQueueItem[]

export type QueueState = {
	checkupQueue: CheckupQueue
}

export interface ITestingQueueItem {
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	patientName: string
	patientId: number
	isReExam: boolean
	operationList: string[]
}
export type ITestingQueue = ITestingQueueItem[]
