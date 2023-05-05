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
		pageStyle: `@media print {
      @page {
        size: A5 landscape;
        margin: 0;
      }
    }`,
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
								<Stack spacing={1} align="center">
									<Text size="xs">SỞ Y TẾ TP. Hồ Chí Minh</Text>
									<Text size="xs" weight="bold">
										BỆNH VIỆN NHI ĐỒNG 2
									</Text>
									<Divider variant="dotted" color="dark" size="md" />
									<Text size={10} weight="bold">
										Khoa khám bệnh
									</Text>
									<Text size={10}>{roomLabel}</Text>
								</Stack>
								<Stack align="center">
									<Text size="md" weight="bold">
										PHIẾU CHỈ ĐỊNH
									</Text>
									<Text
										size={'lg'}
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
									<Text size={10}>Mã số: {item?.code}</Text>
								</Stack>
							</Group>

							<Stack spacing="xs" p="sm">
								<Group position="apart">
									<Stack>
										<Group>
											<Text size="sm">Họ tên: {item?.patient?.name}</Text>
											<Text size="sm">
												Ngày sinh:{' '}
												{item?.patient?.dateOfBirth
													? formatDate(item?.patient?.dateOfBirth)
													: '---'}
											</Text>
											<Text size="sm">
												Giới tính: {item?.patient?.gender === 0 ? 'Nam' : 'Nữ'}
											</Text>
										</Group>
										<Text size="sm">SĐT: {item?.patient?.phoneNumber}</Text>

										<Text size="sm" weight="bold">
											Yêu cầu xét nghiệm
										</Text>
										<Text size="sm">
											Phòng {item.roomNumber} - Tầng {item.floor}
										</Text>
									</Stack>
									<Stack spacing={'xs'} align="center">
										<QRCodeSVG value={item.qrCode} size={120} />
									</Stack>
								</Group>
								<Divider />
								<Stack mt="sm" spacing="xs">
									<Group position="apart" align="start">
										<Stack sx={{ maxWidth: '45%' }} spacing="xs">
											<Text size="sm">HƯỚNG DẪN THỰC HIỆN CẬN LÂM SÀNG</Text>
											<Text size="sm">
												Bước 1: Đóng tiền qua app hoặc quầy thu ngân
											</Text>
											<Text size="sm">
												Bước 2: Nộp phiếu chỉ định và làm theo hướng dẫn của
												nhân viên
											</Text>
											<Text size="sm" weight={'bold'}>
												Bước 3: Sau khi có đầy đủ kết quả, đưa bệnh nhi quay lại
												phòng khám đã cho chỉ định để khám lại
											</Text>
										</Stack>
										<Stack align="center" spacing="xs">
											<Text size="xs">
												{formatDate(
													dayjs().valueOf() + (configTime ?? 0),
													DATE_FORMAT
												)}
											</Text>
											<Text size="sm" transform="uppercase">
												Bác sĩ khám bệnh
											</Text>
											<Signature date={dayjs().valueOf() + (configTime ?? 0)} />
											<Text size="sm" weight={'bold'} transform="uppercase">
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
