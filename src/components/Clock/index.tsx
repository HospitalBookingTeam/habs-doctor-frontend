import { Group, Badge, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Clock = () => {
	const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'))

	useEffect(() => {
		const interval = setInterval(
			() => setCurrentTime(dayjs().format('HH:mm')),
			10000
		)

		return () => clearInterval(interval)
	}, [])

	return (
		<Tooltip label={currentTime} position="right" transitionDuration={0}>
			<Group>
				<Badge size="xl">{currentTime}</Badge>
			</Group>
		</Tooltip>
	)
}
export default Clock
