import LayoutAppShell from '@/components/Layout'
import { QueueTable } from '@/components/Table'
import ProgressQueueTable from '@/components/Table/ProgressQueueTable'
import { CheckupQueue } from '@/entities/queue'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import {
	useGetCheckupQueueQuery,
	useGetFinishedCheckupQueueQuery,
	useGetTestingCheckupQueueQuery,
} from '@/store/queue/api'
import { Stack, Title, Grid, TextInput, Paper, Loader } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons'
import Fuse from 'fuse.js'
import { useEffect, useState } from 'react'

const SEARCH_OPTIONS = {
	includeScore: true,
	keys: ['patientName'],
}

const TestingQueue = () => {
	const authData = useAppSelector(selectAuth)

	const [queueData, setQueueData] = useState<CheckupQueue | undefined>(
		undefined
	)
	const [value, setValue] = useDebouncedState('', 200)

	const { data, isLoading } = useGetTestingCheckupQueueQuery(
		authData?.information?.room?.id as number,
		{
			refetchOnFocus: true,
			skip: !authData?.information,
		}
	)

	useEffect(() => {
		if (!data?.length) return
		if (value === '') {
			setQueueData(data)
			return
		}
		const fuse = new Fuse(data, SEARCH_OPTIONS)
		const results: CheckupQueue = fuse.search(value).map(({ item }) => item)
		setQueueData(results)
	}, [value, data])

	return (
		<Stack p="md">
			<Stack
				sx={{ flexDirection: 'row' }}
				align="center"
				justify={'space-between'}
				mb="sm"
			>
				<Title order={1} size="h3">
					Danh sách người bệnh đã khám
				</Title>
				<TextInput
					placeholder="Tìm kiếm người bệnh"
					size="md"
					sx={{ minWidth: 450 }}
					icon={<IconSearch size={16} stroke={1.5} />}
					defaultValue={value}
					onChange={(event) => setValue(event.currentTarget.value)}
				/>
			</Stack>
			<Paper p="md">
				<ProgressQueueTable data={queueData} isLoading={isLoading} />
			</Paper>
		</Stack>
	)
}
export default TestingQueue
