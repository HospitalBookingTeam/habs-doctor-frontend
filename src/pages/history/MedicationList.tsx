import RowWithLabel from '@/components/Row'
import { MedicineDetail } from '@/entities/medicine'
import { Prescription } from '@/entities/record'
import { formatDate, renderDoseContent } from '@/utils/formats'
import useGlobalStyles from '@/utils/useGlobalStyles'
import { Accordion, Box, Grid, Stack, Title } from '@mantine/core'

const MedicationList = ({ data }: { data?: Prescription }) => {
	return (
		<Stack>
			<Title order={3} size="h4">
				Thông tin đơn thuốc
			</Title>
			<Stack>
				<RowWithLabel
					label="Thời gian"
					content={data?.timeCreated ? formatDate(data.timeCreated) : '---'}
				/>
				<Accordion
					variant="separated"
					chevronPosition="left"
					radius="sm"
					multiple={true}
				>
					{data?.details?.map((item, index) => (
						<MedicineDetailRow key={item.id} item={item} index={index} />
					))}
				</Accordion>
				<RowWithLabel label="Lưu ý" content={data?.note} />
			</Stack>
		</Stack>
	)
}

const MedicineDetailRow = ({
	item,
	index,
}: {
	item: MedicineDetail
	index: number
}) => {
	const { classes: globalClasses } = useGlobalStyles()

	const usageDaily = renderDoseContent(item)
	return (
		<Accordion.Item
			key={item.medicineId}
			value={item.medicineId.toString()}
			className={globalClasses.accordion}
		>
			<Stack
				sx={{ flexDirection: 'row' }}
				align="center"
				justify="space-between"
			>
				<Accordion.Control>
					<Box>
						Thuốc {index + 1} - {item?.medicineName} - {usageDaily}
					</Box>
				</Accordion.Control>
			</Stack>
			<Accordion.Panel>
				<Grid>
					<Grid.Col span={6}>
						<RowWithLabel label="Tên thuốc" content={item.medicineName} />
					</Grid.Col>
					<Grid.Col span={3}>
						<RowWithLabel labelSpan={5} label="Đơn vị" content={item.unit} />
					</Grid.Col>
					<Grid.Col span={3}></Grid.Col>

					<Grid.Col span={6}>
						<RowWithLabel label="Trong ngày" content={usageDaily} />
					</Grid.Col>
					<Grid.Col span={3}>
						<RowWithLabel
							labelSpan={8}
							label="Số ngày sử dụng"
							content={item?.quantity.toString() ?? '0'}
						/>
					</Grid.Col>
					<Grid.Col span={12}>
						<RowWithLabel
							labelSpan={2}
							label="Hướng dẫn sử dụng"
							content={item?.usage}
						/>
					</Grid.Col>
				</Grid>
			</Accordion.Panel>
		</Accordion.Item>
	)
}
export default MedicationList
