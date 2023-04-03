import { useLazyGetTimeQuery } from '@/store/config/api'
import { selectTime } from '@/store/config/selectors'
import { useAppSelector } from '@/store/hooks'
import { formatDate } from '@/utils/formats'
import { Button, Badge, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const DATE_FORMAT = 'DD/MM/YYYY, HH:mm'
const Clock = () => {
	const [currentTime, setCurrentTime] = useState(
		formatDate(new Date().toString(), DATE_FORMAT)
	)
	const configTime = useAppSelector(selectTime)
	const [triggerTimeConfig] = useLazyGetTimeQuery()

	useEffect(() => {
		setCurrentTime(
			formatDate(dayjs().valueOf() + (configTime ?? 0), DATE_FORMAT)
		)
	}, [configTime])

	useEffect(() => {
		const interval = setInterval(
			() =>
				setCurrentTime(
					formatDate(dayjs().valueOf() + (configTime ?? 0), DATE_FORMAT)
				),
			10000
		)

		return () => clearInterval(interval)
	}, [configTime])

	const updateTimeConfig = async () => {
		await triggerTimeConfig()
	}

	return (
		<Tooltip label={currentTime} position="right" transitionDuration={0}>
			<Button
				variant="white"
				size="md"
				sx={{ padding: '4px 8px', height: 'fit-content' }}
				onClick={updateTimeConfig}
			>
				{currentTime}
			</Button>
		</Tooltip>
	)
}
export default Clock
