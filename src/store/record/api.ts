import {
	Department,
	DepartmentRequest,
	DepartmentResponse,
} from '@/entities/department'
import { Medicine } from '@/entities/medicine'
import {
	Operation,
	RequestOperations,
	RequestOperationsResponse,
} from '@/entities/operation'
import {
	CheckupFormData,
	CheckupRecordByIdResponse,
	RequestReExam,
} from '@/entities/record'
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
	useGetOperationListQuery,
	useGetDepartmentListQuery,
	useUpdateCheckupRecordByIdMutation,
	useUpdateCheckupRecordMedicationByIdMutation,
	useRequestReExamByIdMutation,
	useUpdateStatusRecordMutation,
	useRequestRedirectDepartmentsByIdMutation,
	useRequestOperationsByIdMutation,
} = recordApi

export const {
	endpoints: {
		getMedicineList,
		getCheckupRecordByPatientId,
		getOperationList,
		getDepartmentList,
		updateCheckupRecordById,
		updateCheckupRecordMedicationById,
		requestReExamById,
		updateStatusRecord,
		requestRedirectDepartmentsById,
		requestOperationsById,
	},
} = recordApi
