export interface Medicine {
	id: number
	name: string
	usage: string
	status: number
	unit: string
	note: string
	manufacturer: string
	manufacturingCountry: string
	medicineCategoryId: number
	medicineCategory: string
}

export interface MedicineDetail {
	quantity: number
	usage: string
	morningDose: number
	middayDose: number
	eveningDose: number
	nightDose: number
	medicineId: number
	medicineName: string
}

export interface MedicineRequest {
	note: string
	details: MedicineDetail[]
}
