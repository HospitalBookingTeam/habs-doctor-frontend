import {
	Department,
	DepartmentRequest,
	DepartmentResponse,
} from '@/entities/department'
import { Icd } from '@/entities/icd'
import { Medicine } from '@/entities/medicine'
import {
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

export const recordApi = api.injectEndpoints({
	endpoints: (build) => ({
		getMedicineList: build.query<Medicine[], void>({
			query: () => ({
				url: 'medicines',
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Record', field: 'medicine', id } as const)
				),
				{ type: 'Record' as const, field: 'medicine' as const, id: 'LIST' },
			],
		}),
		getCheckupRecordByPatientId: build.query<
			CheckupRecordByIdResponse,
			{ patientId?: number; pageIndex?: number; pageSize?: number }
		>({
			query: ({ patientId, pageIndex, pageSize }) => ({
				url: 'checkup-records',
				params: {
					'patient-id': patientId,
					pageIndex,
					pageSize,
				},
			}),
			providesTags: (result, error, { patientId }) => [
				{ type: 'Record' as const, id: 'HISTORY', patientId },
			],
		}),
		getCheckupRecordById: build.query<CheckupRecord, number>({
			query: (id) => ({
				url: `checkup-records/${id}`,
			}),
			providesTags: (result) => [{ type: 'Record' as const, id: result?.id }],
		}),
		getReExamTree: build.query<ReExamTree, string>({
			query: (id) => ({
				url: `re-exam-tree/${id}`,
			}),
			providesTags: (result) => [{ type: 'Record' as const, id: result?.id }],
		}),
		getReExamTreeByPatientId: build.query<ReExamTree[], string>({
			query: (id) => ({
				url: `re-exam-tree/patient/${id}`,
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Record', field: 'reExamTree', id } as const)
				),
				{ type: 'Record' as const, patient: true, id: 'ListReExamTree' },
			],
		}),
		getIcdList: build.query<Icd[], void>({
			query: () => ({
				url: `icd`,
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Record', id } as const)),
				{ type: 'Record' as const, id: 'LIST' },
			],
		}),
		getOperationList: build.query<Operation[], void>({
			query: () => ({
				url: 'operations',
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Record', field: 'operation', id } as const)
				),
				{ type: 'Record' as const, field: 'operation' as const, id: 'LIST' },
			],
		}),
		getDepartmentList: build.query<Department[], void>({
			query: () => ({
				url: 'departments',
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Record', field: 'department', id } as const)
				),
				{ type: 'Record' as const, field: 'department' as const, id: 'LIST' },
			],
		}),
		updateCheckupRecordById: build.mutation<
			void,
			CheckupFormData & { id: number; patientId: number }
		>({
			query: (body) => {
				const { bloodPressure, pulse, temperature, ...restOfBody } = body
				return {
					url: `checkup-records/${body.id}`,
					method: 'PUT',
					body: {
						bloodPressure: bloodPressure || null,
						pulse: pulse || null,
						temperature: temperature || null,
						...restOfBody,
					},
				}
			},
		}),
		updateCheckupRecordMedicationById: build.mutation<
			void,
			{ id: number; note?: string; details?: any[] }
		>({
			query: (body) => ({
				url: `checkup-records/${body.id}/prescription`,
				method: 'POST',
				body,
			}),
		}),
		requestReExamById: build.mutation<void, RequestReExam>({
			query: (body) => ({
				url: `patient/${body.id}/reexam`,
				method: 'POST',
				body,
			}),
		}),
		deleteReExamById: build.mutation<void, { id: number }>({
			query: (body) => ({
				url: `patient/${body.id}/reexam`,
				method: 'DELETE',
			}),
		}),
		updateStatusRecord: build.mutation<
			void,
			{ status: number; id: number; patientId: number }
		>({
			query: (body) => ({
				url: `checkup-records/${body.id}`,
				method: 'PUT',
				body,
			}),
		}),
		requestRedirectDepartmentsById: build.mutation<
			DepartmentResponse[],
			DepartmentRequest
		>({
			query: (body) => ({
				url: `checkup-records/${body.id}/redirect`,
				method: 'POST',
				body,
			}),
		}),
		requestOperationsById: build.mutation<
			RequestOperationsResponse[],
			RequestOperations
		>({
			query: (body) => ({
				url: `checkup-records/${body.id}/tests`,
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const {
	useGetMedicineListQuery,
	useGetCheckupRecordByPatientIdQuery,
	useGetCheckupRecordByIdQuery,
	useGetIcdListQuery,
	useGetOperationListQuery,
	useGetDepartmentListQuery,
	useGetReExamTreeQuery,
	useGetReExamTreeByPatientIdQuery,
	useUpdateCheckupRecordByIdMutation,
	useUpdateCheckupRecordMedicationByIdMutation,
	useRequestReExamByIdMutation,
	useDeleteReExamByIdMutation,
	useUpdateStatusRecordMutation,
	useRequestRedirectDepartmentsByIdMutation,
	useRequestOperationsByIdMutation,
} = recordApi

export const {
	endpoints: {
		getMedicineList,
		getCheckupRecordByPatientId,
		getCheckupRecordById,
		getIcdList,
		getOperationList,
		getDepartmentList,
		getReExamTree,
		getReExamTreeByPatientId,
		updateCheckupRecordById,
		updateCheckupRecordMedicationById,
		requestReExamById,
		deleteReExamById,
		updateStatusRecord,
		requestRedirectDepartmentsById,
		requestOperationsById,
	},
} = recordApi
