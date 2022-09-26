import { Button } from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ route = '/' }: { route?: string }) => {
	const navigate = useNavigate()
	return (
		<Button
			variant="subtle"
			color="blue"
			onClick={() => navigate(route)}
			leftIcon={<IconChevronLeft />}
			pl={0}
		>
			Quay lại
		</Button>
	)
}
export default BackButton
