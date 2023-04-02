import { useState, useRef, useEffect } from 'react'
import {
	Anchor,
	Card,
	Stack,
	Text,
	Timeline,
	Group,
	ThemeIcon,
	Paper,
	Accordion,
} from '@mantine/core'
import { IconChevronDown, IconChevronUp } from '@tabler/icons'
import { formatDate } from '@/utils/formats'
import { Link } from 'react-router-dom'

import { ReExamTree } from '@/entities/reexam'

type TreeProps = {
	data?: ReExamTree
}

const PatientRecordTree = ({ data }: TreeProps) => {
	const [isClicked, setIsClicked] = useState(false)

	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isClicked) {
			ref.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			})
		}
	}, [isClicked])

	return (
		<Stack align="center" mt="md">
			<Card
				shadow="sm"
				p="lg"
				radius="md"
				withBorder
				component="button"
				onClick={() => {
					setIsClicked((checked) => !checked)
				}}
				sx={{
					width: '100%',
					'&:hover': {
						cursor: 'pointer',
					},
				}}
			>
				<Stack align="center">
					<Text weight={500} color="dimmed">
						Các khoa đã khám
					</Text>
					<Text weight={500}>
						{data?.relatedDepartments
							? [...new Set(data.relatedDepartments).values()].join(' | ')
							: '---'}
					</Text>
				</Stack>
				<Group position="apart" mb="xs">
					<Stack align="start">
						<Text>Số lần khám: {data?.checkupRecordQuantity ?? '0'}</Text>
						<Text>Số lần xét nghiệm: {data?.testQuantity ?? '0'}</Text>
					</Stack>
					<Stack align="end">
						<Text>
							Bắt đầu: {data?.startDate ? formatDate(data.startDate) : '---'}
						</Text>
						<Text>
							Kết thúc: {data?.endDate ? formatDate(data.endDate) : '---'}
						</Text>
					</Stack>
				</Group>

				<Group position="center" color="blue" mt="md">
					<Text color="blue">{isClicked ? 'Rút gọn' : 'Xem chi tiết'}</Text>
					<ThemeIcon color="blue" variant="outline" radius="lg" size="xs">
						{isClicked ? <IconChevronUp /> : <IconChevronDown />}
					</ThemeIcon>
				</Group>
			</Card>
			<Paper
				px="md"
				py={isClicked ? 'xs' : 0}
				shadow="md"
				ref={ref}
				sx={{
					width: '100%',
					overflow: 'hidden',
					height: isClicked ? 'auto' : 0,
					opacity: isClicked ? 1 : 0,
					transition: 'all 0.75s ease',
				}}
			>
				<Timeline active={1}>
					{data?.details?.map((item) => (
						<Timeline.Item title={formatDate(item.date)} key={item.date}>
							<Accordion multiple={true}>
								{item.checkupRecords.map((record) => (
									<Accordion.Item
										value={record.id.toString()}
										key={record.id}
										px={0}
									>
										<Accordion.Control px={0}>
											<Text size="sm">
												{record.department} - BS. {record.doctor}
											</Text>
										</Accordion.Control>
										<Accordion.Panel>
											<Group position="apart">
												<Text size="sm">
													Số xét nghiệm: {record.testQuantity}
												</Text>
												<Anchor
													component={Link}
													to={`/records/${record.id}`}
													target="_blank"
													color="blue"
												>
													<Text size="sm">Chi tiết</Text>
												</Anchor>
											</Group>
										</Accordion.Panel>
									</Accordion.Item>
								))}
							</Accordion>
						</Timeline.Item>
					))}
				</Timeline>
			</Paper>
		</Stack>
	)
}

export default PatientRecordTree
