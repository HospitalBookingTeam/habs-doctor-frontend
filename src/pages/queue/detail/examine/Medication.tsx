import { useGetMedicineListQuery } from '@/store/record/api'
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
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { IconPlus, IconTrash } from '@tabler/icons'
import { Fragment, useState } from 'react'

type MedForm = {
	key: string
	medicineId: string
	usage: string
	quantity?: number
	morningDose?: number
	middayDose?: number
	eveningDose?: number
	nightDose?: number
}
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
	const { classes } = useStyles()

	const form = useForm({
		initialValues: {
			note: '',
			medicines: [],
		},
	})

	const rows = form.values.medicines?.map((item: MedForm, index) => (
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
						{
							medData?.find((_item) => _item.id.toString() === item.medicineId)
								?.name
						}
					</Box>
				</Accordion.Control>
				<ActionIcon
					color="red"
					size="sm"
					mr="sm"
					onClick={() => form.removeListItem('medicines', index)}
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
									value: item.id.toString(),
									label: item.name,
									...item,
								})) ?? []
							}
							searchable
							nothingFound="Không có dữ liệu"
							{...form.getInputProps(`medicines.${index}.medicineId`)}
						/>
					</Grid.Col>

					<Grid.Col span={6}>
						<NumberInput
							label="Số lượng"
							hideControls={true}
							{...form.getInputProps(`medicines.${index}.quantity`)}
						/>
					</Grid.Col>

					<Grid.Col span={3}>
						<NumberInput
							label="Sáng"
							{...form.getInputProps(`medicines.${index}.morningDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							label="Trưa"
							{...form.getInputProps(`medicines.${index}.middayDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							label="Chiều"
							{...form.getInputProps(`medicines.${index}.eveningDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<NumberInput
							label="Tối"
							{...form.getInputProps(`medicines.${index}.eveningDose`)}
						/>
					</Grid.Col>
					<Grid.Col span={12}>
						<Textarea
							label="Hướng dẫn sử dụng"
							placeholder="Vd. Uống 3 buổi"
							autosize
							minRows={2}
							maxRows={4}
							{...form.getInputProps(`medicines.${index}.usage`)}
						/>
					</Grid.Col>
				</Grid>
			</Accordion.Panel>
		</Accordion.Item>
	))

	return (
		<Box mt="md">
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

			<Stack align={'center'} my="sm" sx={{ width: '100%' }}>
				<Button
					size="md"
					disabled={isLoading}
					fullWidth
					color="cyan"
					sx={{ maxWidth: 250 }}
					variant="outline"
					leftIcon={<IconPlus />}
					onClick={() => form.insertListItem('medicines', DEFAULT_MED)}
				>
					Thêm thuốc
				</Button>

				<Button
					size="md"
					color="cyan"
					disabled={isLoading}
					fullWidth
					sx={{ maxWidth: 250 }}
				>
					Xác nhận kê thuốc
				</Button>
			</Stack>

			<Stack align={'flex-end'} mb="sm" sx={{ width: '100%' }}></Stack>
		</Box>
	)
}
export default Medication

/*
    1 row: text inputs ->

*/
