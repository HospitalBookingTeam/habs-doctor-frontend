import { forwardRef, useEffect, useState, useMemo } from 'react'
import { NewOperation, Operation } from '@/entities/operation'
import { useGetOperationListQuery } from '@/store/record/api'
import {
	Select,
	Button,
	Menu,
	Group,
	Checkbox,
	createStyles,
	Divider,
	Text,
	Stack,
} from '@mantine/core'
import { GetInputProps } from '@mantine/form/lib/types'
import { useListState } from '@mantine/hooks'
import { IconDirection } from '@tabler/icons'
import OperationsTable from '@/components/Table/OperationsTable'

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: 0,
		position: 'relative',
	},
}))

type OperationListProps = {
	updateSelectedOperationIds: (ids: number[]) => void
	editReExam?: boolean
}
const OperationList = ({
	updateSelectedOperationIds,
	editReExam = true,
}: OperationListProps) => {
	const { data: operationList, isLoading: isLoadingOperationList } =
		useGetOperationListQuery()
	const { classes } = useStyles()

	const [searchValue, onSearchChange] = useState('')
	const [selectedIds, setSelectedIds] = useState<number[]>([])

	const [typesSelected, setTypesSelected] = useListState<{
		label: string
		value: string
		checked: boolean
	}>(undefined)

	const allChecked = typesSelected.every((value) => value.checked)
	const indeterminate =
		typesSelected.some((value) => value.checked) && !allChecked
	const operationTypesReadonly = typesSelected
		?.filter((item) => item.checked)
		?.map((item) => item.value)

	const operationOptions = useMemo(
		() =>
			operationList?.reduce((prev: { value: string; label: string }[], cur) => {
				if (operationTypesReadonly?.includes(cur.id.toString())) {
					return [
						...prev,
						...cur.data.map((_item) => ({
							value: _item.id.toString(),
							label: _item.name,
						})),
					]
				}
				return prev
			}, []) ?? [],
		[operationList, operationTypesReadonly]
	)
	const selectedOperations = useMemo(
		() =>
			operationList?.reduce((prev: NewOperation[], cur) => {
				const curDataList = cur.data.filter((_item) =>
					selectedIds.includes(_item.id)
				)
				if (curDataList.length) {
					return [
						...prev,
						{
							...cur,
							data: curDataList,
						},
					]
				}
				return prev
			}, []) ?? [],
		[operationList, selectedIds]
	)

	const handleSelectOption = (val: string | null) => {
		if (!val) return
		setSelectedIds((ids) => [...ids, Number(val)])
		updateSelectedOperationIds([...selectedIds, Number(val)])
	}

	useEffect(() => {
		if (isLoadingOperationList || typesSelected.length) return
		if (!operationList) return
		setTypesSelected.setState(
			operationList.map((item) => ({
				value: item.id.toString(),
				label: item.name,
				checked: true,
			}))
		)
	}, [isLoadingOperationList, operationList, typesSelected])

	return (
		<>
			<Stack spacing={1}>
				<Text size="sm" weight={500}>
					Loại xét nghiệm
				</Text>
				{editReExam && (
					<Group align={'center'}>
						<Select
							placeholder="Tìm kiếm"
							searchable
							onChange={handleSelectOption}
							value={searchValue}
							nothingFound="Không tìm thấy dữ liệu"
							data={operationOptions}
							sx={{ flex: 1 }}
						/>
						<Menu closeOnItemClick={false}>
							<Menu.Target>
								<TypeButton />
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									onClick={() =>
										setTypesSelected.setState((current) =>
											current.map((value) => ({
												...value,
												checked: !allChecked,
											}))
										)
									}
								>
									<Checkbox
										label={'Tất cả'}
										checked={allChecked}
										indeterminate={indeterminate}
										readOnly={true}
									/>
								</Menu.Item>
								<Divider />
								{typesSelected?.map((item, index) => (
									<Menu.Item
										key={item.value}
										onClick={() =>
											setTypesSelected.setItemProp(
												index,
												'checked',
												!item.checked
											)
										}
									>
										<Checkbox
											value={item.value}
											label={item.label}
											checked={item.checked}
											readOnly={true}
										/>
									</Menu.Item>
								))}
							</Menu.Dropdown>
						</Menu>
					</Group>
				)}
			</Stack>
			<OperationsTable
				data={selectedOperations}
				onRemove={(val) => {
					setSelectedIds((ids) => ids.filter((item) => item !== val))
					updateSelectedOperationIds(selectedIds.filter((item) => item !== val))
				}}
				editReExam={editReExam}
			/>
		</>
	)
}

interface TypeButtonProps extends React.ComponentPropsWithoutRef<'button'> {}

const TypeButton = forwardRef<HTMLButtonElement, TypeButtonProps>(
	({ ...others }: TypeButtonProps, ref) => (
		<Button
			ref={ref}
			variant="outline"
			rightIcon={<IconDirection />}
			{...others}
		>
			Loại xét nghiệm
		</Button>
	)
)

export default OperationList
