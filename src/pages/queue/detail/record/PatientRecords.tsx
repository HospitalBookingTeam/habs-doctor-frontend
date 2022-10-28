import { Patient, RecordItem } from '@/entities/record'
import { useGetReExamTreeQuery } from '@/store/record/api'
import { formatDate } from '@/utils/formats'
import {
	Paper,
	Stack,
	Title,
	Button,
	Text,
	createStyles,
	Group,
	LoadingOverlay,
	Box,
	Switch,
} from '@mantine/core'
import { IconChevronRight } from '@tabler/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PatientRecordTree from './PatientRecordTree'

const useStyles = createStyles((theme) => ({
	date: {
		color: theme.colors.gray[6],
	},
	card: {
		transition: 'all 0.2s ease',
		backgroundColor: theme.colors.gray[1],
		'&:hover': {
			backgroundColor: theme.colors.green[1],
		},
	},
}))

const PatientRecords = ({
	data,
	reExamTreeCode,
}: {
	data?: RecordItem[]
	reExamTreeCode?: string | null
}) => {
	const [isViewTree, setIsViewTree] = useState(false)

	const { data: reExamTree, isLoading: isLoadingTree } = useGetReExamTreeQuery(
		reExamTreeCode as string,
		{
			skip: !reExamTreeCode || !isViewTree,
		}
	)

	return (
		<Stack>
			<Group position="apart">
				<Title order={3} size="h4">
					Lịch sử khám bệnh
				</Title>
				<Box sx={{ alignSelf: 'end' }}>
					<Switch
						checked={isViewTree}
						onChange={(e) => setIsViewTree(e.target.checked)}
						size="md"
						label="Xem dạng cây"
					/>
				</Box>
			</Group>

			<Stack sx={{ position: 'relative' }}>
				<LoadingOverlay visible={isLoadingTree} />
				{isViewTree ? (
					<PatientRecordTree data={reExamTree} />
				) : (
					data?.map((item) => (
						<PatientRecordRow
							key={item.id}
							id={item.id}
							doctorName={item?.doctorName}
							departmentName={item?.departmentName}
							date={item?.date}
						/>
					))
				)}
			</Stack>
		</Stack>
	)
}

const PatientRecordRow = ({
	id,
	departmentName = '---',
	doctorName = '---',
	date,
}: Partial<RecordItem>) => {
	const { classes } = useStyles()
	return (
		<Paper
			component={Link}
			to={`/records/${id}`}
			target="_blank"
			p="md"
			className={classes.card}
		>
			<Stack
				sx={{ flexDirection: 'row' }}
				align="center"
				justify="space-between"
			>
				<Stack>
					<Text>
						{departmentName} - {doctorName}
					</Text>
					<Text className={classes.date}>
						{date ? formatDate(date) : '---'}
					</Text>
				</Stack>
				<Button variant="subtle" rightIcon={<IconChevronRight />}>
					Xem chi tiết
				</Button>
			</Stack>
		</Paper>
	)
}

export default PatientRecords
