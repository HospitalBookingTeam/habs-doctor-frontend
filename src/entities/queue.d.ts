import { SessionType } from '@/utils/renderEnums'

export type CheckupQueueItem = {
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	patientName: string
	patientId: number
	isReExam: boolean
	session: SessionType
}

export type CheckupQueue = CheckupQueueItem[]

export type QueueState = {
	checkupQueue: CheckupQueue
}
