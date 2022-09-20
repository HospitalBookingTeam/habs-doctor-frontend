import { Chip, Stack } from '@mantine/core'

type MedDoseProps = {
	label: string
}
const MedDoseNumberInput = ({ label }: MedDoseProps) => {
	return (
		<Stack>
			<Chip>{label}</Chip>
		</Stack>
	)
}
export default MedDoseNumberInput

//TODO: Chip checked will enable dose input
