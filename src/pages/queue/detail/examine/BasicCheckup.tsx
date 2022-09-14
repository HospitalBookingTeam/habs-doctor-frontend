import { Icd } from '@/entities/icd'
import { useGetIcdListQuery } from '@/store/queue/api'

import {
	Stack,
	Title,
	Grid,
	Box,
	Select,
	NumberInput,
	Divider,
	Text,
	Textarea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconTemperatureCelsius } from '@tabler/icons'

const BasicCheckup = () => {
	const { data, isLoading } = useGetIcdListQuery()

	const form = useForm({
		initialValues: {
			bloodPressure: '',
			pulse: '',
			temperature: '',
			doctorAdvice: '',
			diagnosis: '',
			icdDisease: '',
		},

		validate: {},
	})

	return (
		<Stack mt={'md'}>
			<Stack>
				<Title order={3} size="h6">
					Chỉ số đo
				</Title>

				<Grid gutter="xl">
					<Grid.Col span={4}>
						<NumberInput
							label="Nhịp tim"
							placeholder="vd. 100"
							size="sm"
							rightSectionWidth={60}
							rightSection={
								<Text px="sm" color="gray">
									BPM
								</Text>
							}
							{...form.getInputProps('bloodPressure')}
						/>
					</Grid.Col>
					<Grid.Col span={4}>
						<NumberInput
							label="Huyết áp"
							placeholder="vd. 100"
							size="sm"
							rightSectionWidth={60}
							rightSection={
								<Text px="sm" color="gray">
									mmHg
								</Text>
							}
							{...form.getInputProps('pulse')}
						/>
					</Grid.Col>
					<Grid.Col span={4}>
						<NumberInput
							label="Nhiệt độ"
							placeholder="vd. 37.5"
							size="sm"
							rightSectionWidth={60}
							rightSection={<IconTemperatureCelsius color="gray" stroke={1} />}
							{...form.getInputProps('temperature')}
						/>
					</Grid.Col>

					<Grid.Col span={12}>
						<Divider />
					</Grid.Col>

					<Grid.Col span={12}>
						<Select
							size="sm"
							label="Chẩn đoán"
							placeholder="Pick one"
							data={
								data?.map((item: Icd) => ({
									value: item.id,
									label: `${item.code} - ${item.name}`,
									...item,
								})) ?? []
							}
							searchable
							nothingFound="Không có dữ liệu"
							{...form.getInputProps('icdDisease')}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Textarea
							label="Chẩn đoán cận lâm sàng"
							placeholder="Vd. Đau họng"
							autosize
							minRows={2}
							maxRows={4}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<Textarea
							label="Lời khuyên"
							placeholder="Vd. Uống nước"
							autosize
							minRows={2}
							maxRows={4}
						/>
					</Grid.Col>
				</Grid>
			</Stack>
		</Stack>
	)
}

export default BasicCheckup
