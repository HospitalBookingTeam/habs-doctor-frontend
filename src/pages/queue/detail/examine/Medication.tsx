import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import {
	useGetMedicineListQuery,
	useUpdateCheckupRecordMedicationByIdMutation,
} from '@/store/record/api'
import { useEffect } from 'react'
import {
	Text,
	Accordion,
	Button,
	ActionIcon,
	Textarea,
	NumberInput,
	Stack,
	Grid,
	TextInput,
	ScrollArea,
	Center,
	Loader,
	Box,
	Select,
	LoadingOverlay,
	Group,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconPlus, IconTrash } from '@tabler/icons'
import { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MedicineRequest } from '@/entities/medicine'
import useGlobalStyles from '@/utils/useGlobalStyles'
import MedicationDoseInput from './MedicationDoseInput'
import { renderDoseContent } from '@/utils/formats'

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
type MedicationProps = {
	updateProgress: () => void
}
const Medication = ({ updateProgress }: MedicationProps) => {
	const { classes: globalClasses } = useGlobalStyles()
	const [value, setValue] = useState<string[]>(['0'])
	const { data: medData, isLoading } = useGetMedicineListQuery()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
			refetchOnMountOrArgChange: true,
		})

	const [
		updateRecordPrescriptionMutation,
		{ isLoading: isLoadingUpdateRecordPrescription },
	] = useUpdateCheckupRecordMedicationByIdMutation()

	const form = useForm<MedicineRequest>({
		initialValues: {
			note: '',
			details: [],
		},
		validateInputOnChange: true,
		validate: {
			details: {
				medicineId: (value) => (!value ? true : null),
				quantity: (value: number) => (value <= 0 || value > 1000 ? true : null),
				morningDose: (value) =>
					!value ? null : value <= 0 || value > 1000 ? true : null,
				middayDose: (value) =>
					!value ? null : value <= 0 || value > 1000 ? true : null,
				eveningDose: (value) =>
					!value ? null : value <= 0 || value > 1000 ? true : null,
				nightDose: (value) =>
					!value ? null : value <= 0 || value > 1000 ? true : null,
			},
		},
	})

	const onSubmit = async (values: MedicineRequest) => {
		if (!checkupData) {
			showNotification({
				title: 'Th??ng tin ng?????i b???nh kh??ng t???n t???i',
				message: <Text>Vui l??ng ki???m tra l???i th??ng tin kh??m b???nh.</Text>,
				color: 'red',
			})
			return
		}
		await updateRecordPrescriptionMutation({
			id: checkupData.id,
			...values,
			details: values.details.map((item) => {
				const { key, ...restOfItem } = item
				return restOfItem
			}),
		})
			.unwrap()
			.then(() => {
				showNotification({
					title: 'K?? thu???c th??nh c??ng',
					message: <Text>????n thu???c ???? ???????c c???p nh???t.</Text>,
				})
				updateProgress()
			})
	}

	const rows = form.values.details?.map((item, index: number) => {
		const medItem = medData?.find((_item) => _item.id === item.medicineId)

		return (
			<Accordion.Item
				key={item.key}
				value={index.toString()}
				className={globalClasses.accordion}
			>
				<Stack
					sx={{ flexDirection: 'row' }}
					align="center"
					justify="space-between"
				>
					<Accordion.Control>
						<Box>
							Thu???c {index + 1} - {medItem?.name} - {renderDoseContent(item)}
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
								label="T??n thu???c"
								placeholder="Thu???c"
								withAsterisk={true}
								data={
									medData?.map((item) => ({
										value: item.id,
										label: item.name,
									})) ?? []
								}
								searchable
								nothingFound="Kh??ng c?? d??? li???u"
								{...form.getInputProps(`details.${index}.medicineId`)}
							/>
						</Grid.Col>
						<Grid.Col span={2}>
							<TextInput
								readOnly={true}
								label="????n v???"
								defaultValue={medItem?.unit}
								variant="filled"
							/>
						</Grid.Col>

						<Grid.Col span={4}></Grid.Col>

						<Grid.Col span={2}>
							<MedicationDoseInput
								label="S??ng"
								amount={item?.morningDose}
								getInputProps={() =>
									form.getInputProps(`details.${index}.morningDose`)
								}
							/>
						</Grid.Col>
						<Grid.Col span={2}>
							<MedicationDoseInput
								label="Tr??a"
								amount={item?.middayDose}
								getInputProps={() =>
									form.getInputProps(`details.${index}.middayDose`)
								}
							/>
						</Grid.Col>
						<Grid.Col span={2}>
							<MedicationDoseInput
								label="Chi???u"
								amount={item?.eveningDose}
								getInputProps={() =>
									form.getInputProps(`details.${index}.eveningDose`)
								}
							/>
						</Grid.Col>
						<Grid.Col span={2}>
							<MedicationDoseInput
								label="T???i"
								amount={item?.nightDose}
								getInputProps={() =>
									form.getInputProps(`details.${index}.nightDose`)
								}
							/>
						</Grid.Col>
						<Grid.Col span={4}></Grid.Col>
						<Grid.Col span={2}>
							<NumberInput
								label="S??? ng??y s??? d???ng"
								hideControls={true}
								className={globalClasses.numberInput}
								defaultValue={1}
								{...form.getInputProps(`details.${index}.quantity`)}
							/>
						</Grid.Col>
						<Grid.Col span={12}>
							<Textarea
								label="H?????ng d???n s??? d???ng"
								placeholder="Vd. U???ng 3 bu???i"
								autosize
								minRows={2}
								maxRows={4}
								{...form.getInputProps(`details.${index}.usage`)}
							/>
						</Grid.Col>
					</Grid>
				</Accordion.Panel>
			</Accordion.Item>
		)
	})

	useEffect(() => {
		if (isCheckupDataSuccess) {
			form.setValues({
				note: checkupData?.prescription?.note,
				details:
					checkupData?.prescription?.details?.map((item) => ({
						...item,
						key: item.id.toString(),
					})) ?? [],
			})
		}
	}, [isCheckupDataSuccess, checkupData])

	return (
		<Box mt="md">
			<form onSubmit={form.onSubmit(onSubmit)} id="form">
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
						display: form.values.details?.length ? 'block' : 'none',
					}}
					label="L??u ??"
					placeholder="Vd. Kh??ng u???ng n?????c c?? ga sau khi u???ng thu???c"
					autosize
					minRows={2}
					maxRows={4}
					{...form.getInputProps('note')}
				/>

				<Group position={'center'} my="sm" sx={{ width: '100%' }}>
					<Button
						size="sm"
						disabled={isLoading}
						sx={{ maxWidth: 250 }}
						variant="outline"
						leftIcon={<IconPlus />}
						type="button"
						onClick={() => form.insertListItem('details', DEFAULT_MED)}
					>
						Th??m thu???c
					</Button>

					{/* <Button
						type="submit"
						size="sm"
						disabled={isLoading || !form.values.details?.length}
						sx={{ maxWidth: 250 }}
					>
						X??c nh???n k?? thu???c
					</Button> */}
				</Group>
			</form>
		</Box>
	)
}
export default Medication

/*
    1 row: text inputs ->

*/
