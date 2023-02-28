import { selectTime } from '@/store/config/selectors'
import { useAppSelector } from '@/store/hooks'
import { formatDate } from '@/utils/formats'
import { Group, Badge, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const DATE_FORMAT = 'DD/MM/YYYY, HH:mm'
const Clock = () => {
	const [currentTime, setCurrentTime] = useState(
		formatDate(new Date().toString(), DATE_FORMAT)
	)
	const configTime = useAppSelector(selectTime)

	useEffect(() => {
		setCurrentTime(
			formatDate(dayjs().valueOf() + (configTime ?? 0), DATE_FORMAT)
		)
	}, [])

	useEffect(() => {
		const interval = setInterval(
			() =>
				setCurrentTime(
					formatDate(dayjs().valueOf() + (configTime ?? 0), DATE_FORMAT)
				),
			10000
		)

		return () => clearInterval(interval)
	}, [])

	return (
		<Tooltip label={currentTime} position="right" transitionDuration={0}>
			<Group>
				<Badge size="lg">{currentTime}</Badge>
			</Group>
		</Tooltip>
	)
}
export default Clock
