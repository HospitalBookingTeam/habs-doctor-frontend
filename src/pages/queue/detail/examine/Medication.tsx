import { useGetCheckupRecordByIdQuery } from '@/store/queue/api'
import {
	useGetMedicineListQuery,
	useUpdateCheckupRecordMedicationByIdMutation,
} from '@/store/record/api'
import { useEffect } from 'react'
import { NumberInput } from '@mantine/core'
import { Button } from '@mantine/core'
import { ActionIcon } from '@mantine/core'
import { createStyles } from '@mantine/core'
import { Textarea } from '@mantine/core'
import { Text } from '@mantine/core'
import { Accordion } from '@mantine/core'
import {
	Stack,
	Grid,
	Divider,
	ScrollArea,
	Center,
	Loader,
	Box,
	Select,
	LoadingOverlay,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconPlus, IconTrash } from '@tabler/icons'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MedicineRequest } from '@/entities/medicine'

const DEFAULT_MED = {
	key: randomId(),
	medicineId: '',
	usage: '',
	quantity: undefined,
	morningDose: undefined,
	middayDose: undefined,
	eveningDose: undefined,
	nightDose: undefined,
}

const useStyles = createStyles((theme) => ({
	accordion: {
		border: `2px solid ${theme.colors.gray[2]}`,
	},
}))
const Medication = () => {
	const [value, setValue] = useState<string[]>(['0'])
	const { data: medData, isLoading } = useGetMedicineListQuery()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})

	const [
		updateRecordPrescriptionMutation,
		{ isLoading: isLoadingUpdateRecordPrescription },
	] = useUpdateCheckupRecordMedicationByIdMutation()

	const { classes } = useStyles()

	const form = useForm<MedicineRequest>({
		initialValues: {
			note: '',
			details: [],
		},
	})

	const onSubmit = async (values: MedicineRequest) => {
		console.log('values', values)
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
			return
		}
		console.log('values', values)
		await updateRecordPrescriptionMutation({
			id: checkupData.id,
			...values,
			details: values.details.map((item) => {
				const { key, ...restOfItem } = item
				return restOfItem
			}),
		})
			.unwrap()
			.then(() =>
				showNotification({
					title: 'Kê thuốc thành công',
					message: <Text>Đơn thuốc đã được cập nhật.</Text>,
				})
			)
	}

	const rows = form.values.details?.map((item, index: number) => (
		<Accordion.Item
			key={item.key}
			value={index.toString()}
			className={classes.accordion}
		>
			<Stack
				sx={{ flexDirection: 'row' }}
				align="center"
				justify="space-between"
			>
				<Accordion.Control>
					<Box>
						Thuốc {index + 1} -{' '}
						{medData?.find((_item) => _item.id === item.medicineId)?.name}
					</Box>
				</Accordion.Control>
				<ActionIcon
					color="red"
					size="sm"
					mr="sm"
					onClick={() => form.removeListItem('details', index)}
				>
					<IconTrash />
				</ActionIcon>
			</Stack>
			<Accordion.Panel>
				<Grid>
					<Grid.Col span={6}>
						<Select
							size="sm"
							label="Tên thuốc"
							placeholder="Thuốc"
							data={
								medData?.map((item) => ({
									value: item.id,
									label: item.name,
									...item,
								})) ?? []
							}
							searchable
							nothingFound="Không có dữ liệu"
							{...form.getInputProps(`details.${index}.medicineId`)}
						/>
					</Grid.Col>

					<Grid.Col span={6}>
						<NumberInput
							label="Số lượng"
							hideControls={true}
							{...form.getInputProps(`details.${index}.quantity`)}
						/>
					</Grid.Col>

					<Grid.Col span={3}>
						<NumberInput
							label="Sáng"
							{...form.getInputProps(`details.${index}.morningDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							label="Trưa"
							{...form.getInputProps(`details.${index}.middayDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							label="Chiều"
							{...form.getInputProps(`details.${index}.eveningDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							label="Tối"
							{...form.getInputProps(`details.${index}.nightDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={12}>
						<Textarea
							label="Hướng dẫn sử dụng"
							placeholder="Vd. Uống 3 buổi"
							autosize
							minRows={2}
							maxRows={4}
							{...form.getInputProps(`details.${index}.usage`)}
						/>
					</Grid.Col>
				</Grid>
			</Accordion.Panel>
		</Accordion.Item>
	))

	useEffect(() => {
		if (isCheckupDataSuccess) {
			form.setValues({
				note: checkupData?.prescription?.note,
				details: checkupData?.prescription?.details?.map((item) => ({
					...item,
					key: item.id.toString(),
				})),
			})
		}
	}, [isCheckupDataSuccess, checkupData])

	return (
		<Box mt="md">
			<form onSubmit={form.onSubmit(onSubmit)}>
				<LoadingOverlay visible={isLoadingUpdateRecordPrescription} />
				<ScrollArea sx={{ maxHeight: '100%' }}>
					<Center
						sx={{
							height: 100,
							width: '100%',
							display: isLoading ? 'flex' : 'none',
						}}
					>
						<Loader size="lg" />
					</Center>

					<Accordion
						// color="gray"
						variant="separated"
						chevronPosition="left"
						radius="sm"
						multiple={true}
						value={value}
						onChange={setValue}
						mb="md"
					>
						{rows}
					</Accordion>
				</ScrollArea>

				<Textarea
					sx={{
						display: form.values.details.length ? 'block' : 'none',
					}}
					label="Lưu ý"
					placeholder="Vd. Không uống nước có ga sau khi uống thuốc"
					autosize
					minRows={2}
					maxRows={4}
					{...form.getInputProps('note')}
				/>

				<Stack align={'center'} my="sm" sx={{ width: '100%' }}>
					<Button
						size="md"
						disabled={isLoading}
						fullWidth
						color="cyan"
						sx={{ maxWidth: 250 }}
						variant="outline"
						leftIcon={<IconPlus />}
						onClick={() => form.insertListItem('details', DEFAULT_MED)}
					>
						Thêm thuốc
					</Button>

					<Button
						type="submit"
						size="md"
						color="cyan"
						disabled={isLoading}
						fullWidth
						sx={{ maxWidth: 250 }}
					>
						Xác nhận kê thuốc
					</Button>
				</Stack>
			</form>
		</Box>
	)
}
export default Medication

/*
    1 row: text inputs ->

*/
