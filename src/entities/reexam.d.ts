export interface CheckupRecordInReExamTree {
	department: string
	doctor: string
	testQuantity: number
	id: number
	parentId?: any
	date: string
}

export interface DetailInReExamTree {
	date: string
	checkupRecords: CheckupRecordInReExamTree[]
}

export interface ReExamTree {
	id: string
	testQuantity: number
	checkupRecordQuantity: number
	startDate: string
	endDate: string
	relatedDepartments: string[]
	details: DetailInReExamTree[]
}
