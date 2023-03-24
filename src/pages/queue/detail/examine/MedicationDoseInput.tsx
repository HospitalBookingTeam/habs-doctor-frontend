import { MedicineRequest } from '@/entities/medicine'
import useGlobalStyles from '@/utils/useGlobalStyles'
import { Chip, NumberInput, Stack } from '@mantine/core'
import { GetInputProps } from '@mantine/form/lib/types'
import { useEffect, useState } from 'react'

const MedicationDoseInput = ({
	label,
	amount,
	getInputProps,
	resetValue,
}: {
	label: string
	getInputProps: () => GetInputProps<MedicineRequest>
	resetValue: () => void
	amount?: number
}) => {
	const [checked, setChecked] = useState(false)
	const { classes: globalClasses } = useGlobalStyles()

	useEffect(() => {
		if (!!amount && amount > 0) setChecked(true)
	}, [amount])

	return (
		<Stack>
			<Chip
				checked={checked}
				onChange={() => {
					setChecked((v) => !v)
					resetValue()
				}}
			>
				{label}
			</Chip>
			{!!checked && (
				<NumberInput
					className={globalClasses.numberInput}
					{...getInputProps()}
				/>
			)}
		</Stack>
	)
}
export default MedicationDoseInput
