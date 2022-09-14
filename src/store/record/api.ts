import { Medicine } from '@/entities/medicine'
import { CheckupRecordByIdResponse } from '@/entities/record'
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
	}),
})

export const { useGetMedicineListQuery, useGetCheckupRecordByPatientIdQuery } =
	recordApi

export const {
	endpoints: { getMedicineList, getCheckupRecordByPatientId },
} = recordApi
