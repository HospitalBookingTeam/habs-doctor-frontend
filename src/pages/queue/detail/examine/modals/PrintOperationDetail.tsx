import { CheckupRecord } from '@/entities/record'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import { Button, Stack, Group, Text, Divider } from '@mantine/core'
import { IconPrinter, IconTemperatureCelsius } from '@tabler/icons'
import { useRef, useState } from 'react'
import Barcode from 'react-barcode'
import { useReactToPrint } from 'react-to-print'
import { formatDate, renderDoseContent } from '@/utils/formats'
import { RequestOperationsResponse } from '@/entities/operation'
import { QRCodeSVG } from 'qrcode.react'

const PrintOperationDetail = ({
	data,
}: {
	data?: RequestOperationsResponse[]
}) => {
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
				In phiếu chỉ định
			</Button>
			<Stack sx={{ overflow: 'hidden', height: 0 }}>
				<Stack ref={componentRef}>
					{data?.map((item, index) => (
						<Stack p="md" key={item.operationId}>
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
								<Stack align="center">
									<Text size="xl" weight="bold">
										PHIẾU CHỈ ĐỊNH
									</Text>
									<Text size="lg" weight="bold">
										{item.operationName}
									</Text>
								</Stack>
								<Stack align="flex-end">
									<Barcode
										value={item?.operationId?.toString() ?? ''}
										height={40}
										displayValue={false}
									/>

									<Text size="xs">Số hồ sơ: {item?.numericalOrder}</Text>
								</Stack>
							</Group>

							<Stack spacing="xs" p="md">
								<Group>
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
								</Group>
								<Text>SĐT: {item?.patient?.phoneNumber}</Text>

								<Text mt="sm" weight="bold">
									Yêu cầu xét nghiệm
								</Text>
								<Stack spacing={'xs'} align="center" mb="xl">
									<Group>
										<Text>
											Phòng {item.roomNumber} - Tầng {item.floor}
										</Text>
										<Text>Số khám bệnh: {item.numericalOrder}</Text>
									</Group>
									<Text>
										Mã QR: <QRCodeSVG value={item.qrCode} />
									</Text>
								</Stack>

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
												{formatDate(new Date().toString(), 'HH:mm, DD/MM/YYYY')}
											</Text>
											<Text mb="xl" transform="uppercase">
												Bác sĩ khám bệnh
											</Text>
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
