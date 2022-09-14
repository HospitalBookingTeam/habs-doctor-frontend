export type CheckupQueueItem = {
	id: number
	status: number
	numericalOrder: number
	estimatedStartTime: string
	patientName: string
	patientId: number
	isReExam: boolean
}

export type CheckupQueue = CheckupQueueItem[]

export type QueueState = {
	checkupQueue: CheckupQueue
}
