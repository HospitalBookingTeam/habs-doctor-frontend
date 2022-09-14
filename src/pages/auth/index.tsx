import { AuthForm } from '@/entities/auth'
import { useGetRoomListQuery, useLoginMutation } from '@/store/auth/api'
import { createStyles, Image, Text } from '@mantine/core'
import { Stack } from '@mantine/core'
import {
	Paper,
	TextInput,
	PasswordInput,
	Button,
	Title,
	Select,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { openModal } from '@mantine/modals'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
	layout: {
		flexDirection: 'row',
		gap: 40,
	},
	imageHolder: {
		borderRadius: 4,
		overflow: 'hidden',
		[`@media (max-width: ${theme.breakpoints.xl}px)`]: {
			display: 'none',
		},
	},
	formHolder: {
		maxWidth: 450,
		width: '100%',
		margin: '0 auto',
	},
}))

const Login = () => {
	const { classes } = useStyles()
	const [login, { isLoading }] = useLoginMutation()
	const { data: roomData } = useGetRoomListQuery()

	const roomOptions = roomData?.map((item) => ({
		...item,
		value: item.id.toString(),
		label: `${item.roomTypeName} ${item.departmentName?.toLowerCase()} ${
			item.roomNumber
		} - Tầng ${item.floor}`,
	}))
	const navigate = useNavigate()

	const form = useForm({
		initialValues: {
			username: '',
			password: '',
			roomId: '',
		},

		validate: {
			username: (value) => (value.length > 0 ? null : 'Empty'),
			password: (value) => (value.length > 0 ? null : 'Empty'),
		},
	})

	const onSubmit = async (values: AuthForm) => {
		await login({ ...values, roomId: Number(values?.roomId) })
			.unwrap()
			.then(() => navigate('/'))
			.catch((error) => {
				openModal({
					children: (
						<>
							<Text color="red" weight={'bold'}>
								Lỗi đăng nhập. Vui lòng thử lại!
							</Text>
						</>
					),
					withCloseButton: false,
					centered: true,
				})
				form.reset()
			})
	}

	return (
		<Paper shadow="md" withBorder={true} p={30}>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack className={classes.layout}>
					<Stack justify="center" px={12} className={classes.formHolder}>
						<Title order={2} align="center" mt="md" mb={50}>
							Chào mừng bạn đến với Bệnh Viện
						</Title>

						<TextInput
							withAsterisk={true}
							label="Username"
							placeholder="doctor"
							size="md"
							{...form.getInputProps('username')}
						/>
						<PasswordInput
							withAsterisk={true}
							autoComplete="current-password"
							label="Password"
							placeholder="123123"
							mt="md"
							size="md"
							{...form.getInputProps('password')}
						/>

						<Select
							withAsterisk={true}
							mt="md"
							size="md"
							label="Phòng khám"
							placeholder="Vui lòng chọn một"
							data={roomOptions}
							searchable={true}
							nothingFound="Không có ai thay thế"
							{...form.getInputProps('roomId')}
						/>
						{/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
						<Button
							type="submit"
							fullWidth={true}
							mt="xl"
							size="md"
							loading={isLoading}
						>
							Đăng nhập
						</Button>
					</Stack>

					<Stack className={classes.imageHolder}>
						<Image src="images/auth-bg.jpg" />
					</Stack>
				</Stack>
			</form>
		</Paper>
	)
}

export default Login
