import {
	Department,
	DepartmentRequest,
	DepartmentResponse,
} from '@/entities/department'
import { Icd } from '@/entities/icd'
import { Medicine } from '@/entities/medicine'
import {
	NewOperation,
	Operation,
	RequestOperations,
	RequestOperationsResponse,
} from '@/entities/operation'
import {
	CheckupFormData,
	CheckupRecord,
	CheckupRecordByIdResponse,
	RequestReExam,
} from '@/entities/record'
import { ReExamTree } from '@/entities/reexam'
import { api } from '../api'

export const configApi = api.injectEndpoints({
	endpoints: (build) => ({
		getTime: build.query<{ time: number }, void>({
			query: () => ({
				url: 'time',
			}),
		}),
	}),
})

export const { useLazyGetTimeQuery } = configApi

export const {
	endpoints: { getTime },
} = configApi
