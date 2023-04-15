import { CheckupRecord } from '@/entities/record'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { Button, Stack, Group, Text, Divider } from '@mantine/core'
import { IconPrinter, IconTemperatureCelsius } from '@tabler/icons'
import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { formatDate, renderDoseContent } from '@/utils/formats'
import Signature from '@/components/Signature'
import { selectTime } from '@/store/config/selectors'
import dayjs from 'dayjs'
import Barcode from 'react-barcode'

const DATE_FORMAT = 'DD/MM/YYYY, HH:mm'

const PrintDetail = ({ data }: { data?: CheckupRecord }) => {
	const [opened, setOpened] = useState(false)
	const componentRef = useRef(null)
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	})
	const authData = useAppSelector(selectAuth)
	const configTime = useAppSelector(selectTime)

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
					<Group position="apart" align="start">
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
						<Text size="xl" weight="bold">
							KẾT QUẢ KHÁM BỆNH
						</Text>

						<Stack align="end" spacing={0}>
							<Barcode
								height={40}
								width={1}
								value={data?.code?.split('_')?.[1] ?? '---'}
								displayValue={false}
							/>
							<Text size="xs">Mã số: {data?.code}</Text>
						</Stack>
					</Group>

					<Stack spacing="xs" p="md">
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
						<Text>SĐT: {data?.patientData?.phoneNumber}</Text>
						<Divider />
						<Text>Biểu hiện lâm sàng: {data?.diagnosis}</Text>
						<Group>
							<Text>
								Nhiệt độ: {data?.temperature}
								<IconTemperatureCelsius color="gray" size={14} stroke={1} />
							</Text>
							<Text>Cân nặng: {data?.bloodPressure}kg</Text>
							<Text>Chiều cao: {data?.pulse}cm</Text>
						</Group>
						<Text>
							Chẩn đoán:{' '}
							{data?.icdDiseases
								?.map((item) => item.icdDiseaseName)
								?.join(', ')}
						</Text>
						<Divider />
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
						<Divider />
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
										{formatDate(
											dayjs().valueOf() + (configTime ?? 0),
											DATE_FORMAT
										)}
									</Text>
									<Text mb="xl" transform="uppercase">
										Bác sĩ khám bệnh
									</Text>
									<Signature />
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
