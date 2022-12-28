import { formatDate } from '@/utils/formats'
import { Group, Badge, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Clock = () => {
	const [currentTime, setCurrentTime] = useState(
		formatDate(new Date().toString(), 'DD/MM/YYYY, HH:mm')
	)

	useEffect(() => {
		const interval = setInterval(
			() =>
				setCurrentTime(formatDate(new Date().toString(), 'DD/MM/YYYY, HH:mm')),
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
