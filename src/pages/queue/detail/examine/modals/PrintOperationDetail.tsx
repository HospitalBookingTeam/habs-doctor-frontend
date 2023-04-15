import { CheckupRecord } from '@/entities/record'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { Button, Stack, Group, Text, Divider } from '@mantine/core'
import { IconPrinter } from '@tabler/icons'
import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { formatDate } from '@/utils/formats'
import { IncomingTestResponse } from '@/entities/operation'
import { QRCodeSVG } from 'qrcode.react'
import Signature from '@/components/Signature'
import { selectTime } from '@/store/config/selectors'
import dayjs from 'dayjs'
import Barcode from 'react-barcode'
const DATE_FORMAT = 'DD/MM/YYYY, HH:mm'

const PrintOperationDetail = ({ data }: { data?: IncomingTestResponse[] }) => {
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
				In phiếu chỉ định
			</Button>
			<Stack sx={{ overflow: 'hidden', height: 0 }}>
				<Stack ref={componentRef}>
					{data?.map((item, index) => (
						<Stack p="md" py="lg" key={item.operationId}>
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
								<Stack align="center">
									<Text size="xl" weight="bold">
										PHIẾU CHỈ ĐỊNH
									</Text>
									<Text
										size={24}
										weight="bold"
										align="center"
										sx={{ maxWidth: 250 }}
									>
										{item.operationName}
									</Text>
								</Stack>
								<Stack align="end" spacing={0}>
									<Barcode
										height={40}
										width={1}
										value={item?.code?.split('_')?.[1] ?? '---'}
										displayValue={false}
									/>
									<Text size="xs">Mã số: {item?.code}</Text>
								</Stack>
							</Group>

							<Stack spacing="xs" p="md">
								<Group position="apart">
									<Stack>
										<Text>Họ tên: {item?.patient?.name}</Text>
										<Text>
											Ngày sinh:{' '}
											{item?.patient?.dateOfBirth
												? formatDate(item?.patient?.dateOfBirth)
												: '---'}
										</Text>
										<Text>
											Giới tính: {item?.patient?.gender === 0 ? 'Nam' : 'Nữ'}
										</Text>
										<Text>SĐT: {item?.patient?.phoneNumber}</Text>

										<Divider />
										<Text weight="bold">Yêu cầu xét nghiệm</Text>
										<Text>
											Phòng {item.roomNumber} - Tầng {item.floor}
										</Text>
									</Stack>
									<Stack spacing={'xs'} align="center">
										<QRCodeSVG value={item.qrCode} size={200} />
									</Stack>
								</Group>

								<Divider />
								<Stack mt="xl">
									<Text>HƯỚNG DẪN THỰC HIỆN CẬN LÂM SÀNG</Text>
									<Group position="apart" align="baseline">
										<Stack sx={{ maxWidth: '45%' }}>
											<Text>Bước 1: Đóng tiền qua app hoặc quầy thu ngân</Text>
											<Text>
												Bước 2: Nộp phiếu chỉ định và làm theo hướng dẫn của
												nhân viên
											</Text>
											<Text weight={'bold'}>
												Bước 3: Sau khi có đầy đủ kết quả, đưa bệnh nhi quay lại
												phòng khám đã cho chỉ định để khám lại
											</Text>
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
												BS {item?.doctor}
											</Text>
										</Stack>
									</Group>
								</Stack>
							</Stack>
							{index !== data?.length - 1 && <div className="page-break"></div>}
						</Stack>
					))}
				</Stack>
			</Stack>
		</>
	)
}
export default PrintOperationDetail
