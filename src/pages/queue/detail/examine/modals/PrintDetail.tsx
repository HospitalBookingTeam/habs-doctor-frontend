import { CheckupRecord } from '@/entities/record'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { Button, Stack, Group, Text, Divider } from '@mantine/core'
import { IconPrinter, IconTemperatureCelsius } from '@tabler/icons'
import { useRef, useState } from 'react'
import Barcode from 'react-barcode'
import { useReactToPrint } from 'react-to-print'
import { formatDate, renderDoseContent } from '@/utils/formats'

const PrintDetail = ({ data }: { data?: CheckupRecord }) => {
	const [opened, setOpened] = useState(false)
	const componentRef = useRef(null)
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	})
	const authData = useAppSelector(selectAuth)

	const roomLabel = `${authData?.information?.room?.roomNumber} -
    ${authData?.information?.room?.roomTypeName}
    ${authData?.information?.room?.departmentName}`

	return (
		<>
			<Button
				fullWidth={true}
				color="green"
				variant="outline"
				onClick={handlePrint}
				leftIcon={<IconPrinter />}
			>
				In bệnh án
			</Button>
			<Stack sx={{ overflow: 'hidden', height: 0 }}>
				<Stack ref={componentRef} p="md">
					<Group position="apart" align="center">
						<Stack spacing={'xs'} align="center">
							<Text size="sm">SỞ Y TẾ TP. Hồ Chí Minh</Text>
							<Text size="sm" weight="bold">
								BỆNH VIỆN NHI ĐỒNG 2
							</Text>
							<Divider variant="dotted" color="dark" size="md" />
							<Text size="xs" weight="bold">
								Khoa khám bệnh
							</Text>
							<Text size="xs">{roomLabel}</Text>
						</Stack>
						<Text size="lg" weight="bold">
							KẾT QUẢ KHÁM BỆNH
						</Text>
						<Stack align="flex-end">
							<Barcode
								value={data?.id?.toString() ?? ''}
								height={40}
								displayValue={false}
							/>

							<Text size="xs">Mã khám bệnh: {data?.id}</Text>
							<Text size="xs">Mã toa thuốc: {data?.prescription?.id}</Text>
						</Stack>
					</Group>

					<Stack spacing="xs" p="md">
						<Group>
							<Text>Họ tên: {data?.patientData?.name}</Text>
							<Text>
								Ngày sinh:{' '}
								{data?.patientData?.dateOfBirth
									? formatDate(data?.patientData?.dateOfBirth)
									: '---'}
							</Text>
							<Text>
								Giới tính: {data?.patientData?.gender === 0 ? 'Nam' : 'Nữ'}
							</Text>
						</Group>
						<Text>SĐT: {data?.patientData?.phoneNumber}</Text>
						<Text>Biểu hiện lâm sàng: {data?.diagnosis}</Text>
						<Group>
							<Text>
								Nhiệt độ: {data?.temperature}
								<IconTemperatureCelsius color="gray" size={14} stroke={1} />
							</Text>
							<Text>Cân nặng: {data?.bloodPressure}kg</Text>
							<Text>Chiều cao: {data?.pulse}cm</Text>
						</Group>
						<Text>Chẩn đoán: {data?.icdDiseaseIds?.join(', ')}</Text>
						<Text mt="sm" weight="bold">
							Chỉ định dùng thuốc
						</Text>
						{data?.prescription?.details?.map((item, index) => (
							<Stack spacing={'xs'} key={item.id}>
								<Group>
									<Text weight={'bold'}>{index + 1}</Text>
									<Text>
										{item.medicineName} - {item.unit}
									</Text>
									<Text weight={'bold'}>{item.quantity}</Text>
								</Group>
								<Text>Dùng {renderDoseContent(item)}</Text>
							</Stack>
						))}

						<Stack mt="xl">
							<Text>Ghi chú: {data?.doctorAdvice}</Text>
							<Group position="apart" align="baseline">
								<Stack>
									<Text weight={'bold'}>
										TÁI KHÁM:{' '}
										{data?.reExam?.date
											? formatDate(data?.reExam?.date)
											: 'Không'}
									</Text>
									<Text>Lưu ý: {data?.reExam?.note}</Text>
								</Stack>
								<Stack align="center">
									<Text size="xs">
										{formatDate(new Date().toString(), 'HH:mm, DD/MM/YYYY')}
									</Text>
									<Text mb="xl" transform="uppercase">
										Bác sĩ khám bệnh
									</Text>
									<Text mt="xl" weight={'bold'} transform="uppercase">
										BS {data?.doctorName}
									</Text>
								</Stack>
							</Group>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</>
	)
}
export default PrintDetail