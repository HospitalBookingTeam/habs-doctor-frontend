import { Group, Badge } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Clock = () => {
	const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'))

	useEffect(() => {
		const interval = setInterval(
			() => setCurrentTime(dayjs().format('HH:mm')),
			1000
		)

		return () => clearInterval(interval)
	}, [])

	return (
		<Group>
			<Badge size="xl">{currentTime}</Badge>
		</Group>
	)
}
export default Clock
