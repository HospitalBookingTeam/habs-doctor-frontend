import { MedicineRequest } from '@/entities/medicine'
import useGlobalStyles from '@/utils/useGlobalStyles'
import { Chip, NumberInput, Stack } from '@mantine/core'
import { GetInputProps } from '@mantine/form/lib/types'
import { useEffect, useState } from 'react'

const MedicationDoseInput = ({
	label,
	amount,
	getInputProps,
}: {
	label: string
	getInputProps: () => GetInputProps<MedicineRequest>
	amount?: number
}) => {
	const [checked, setChecked] = useState(false)
	const { classes: globalClasses } = useGlobalStyles()

	useEffect(() => {
		if (!!amount && amount > 0) setChecked(true)
	}, [amount])

	return (
		<Stack>
			<Chip checked={checked} onChange={() => setChecked((v) => !v)}>
				{label}
			</Chip>
			{!!checked && (
				<NumberInput
					defaultValue={1}
					className={globalClasses.numberInput}
					{...getInputProps()}
				/>
			)}
		</Stack>
	)
}
export default MedicationDoseInput
