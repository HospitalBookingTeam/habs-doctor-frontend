import { useState, useEffect } from 'react'
import {
	createStyles,
	Navbar,
	Group,
	Code,
	Text,
	Button,
	Stack,
} from '@mantine/core'
import { IconList, IconZoomCheck, IconLogout, IconPackage } from '@tabler/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/auth/slice'
import { selectAuth } from '@/store/auth/selectors'
import Clock from '../Clock'

const useStyles = createStyles((theme, _params, getRef) => {
	const icon: string = getRef('icon')
	return {
		navbar: {
			backgroundColor: theme.fn.variant({
				variant: 'filled',
				color: theme.primaryColor,
			}).background,
			top: 0,
		},
		title: {
			textTransform: 'uppercase',
			letterSpacing: -0.25,
			color: theme.white,
		},

		version: {
			backgroundColor: theme.fn.lighten(
				theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
					.background,
				0.1
			),
			color: theme.white,
			fontWeight: 700,
		},

		header: {
			paddingBottom: theme.spacing.md,
			marginBottom: theme.spacing.md * 1.5,
			borderBottom: `1px solid ${theme.fn.lighten(
				theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
					.background,
				0.1
			)}`,
		},

		footer: {
			paddingTop: theme.spacing.md,
			marginTop: theme.spacing.md,
			borderTop: `1px solid ${theme.fn.lighten(
				theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
					.background,
				0.1
			)}`,
		},

		link: {
			...theme.fn.focusStyles(),
			display: 'flex',
			alignItems: 'center',
			textDecoration: 'none',
			fontSize: theme.fontSizes.sm,
			color: theme.white,
			padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
			borderRadius: theme.radius.sm,
			fontWeight: 500,

			'&:hover': {
				backgroundColor: theme.fn.lighten(
					theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
						.background,
					0.1
				),
			},
		},

		linkIcon: {
			ref: icon,
			color: theme.white,
			opacity: 0.75,
			marginRight: theme.spacing.sm,
		},

		linkActive: {
			'&, &:hover': {
				backgroundColor: theme.fn.lighten(
					theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
						.background,
					0.15
				),
				[`& .${icon}`]: {
					opacity: 0.9,
				},
			},
		},
	}
})

const data = [
	{ link: '/', label: 'Hàng chờ khám', icon: IconList },
	{ link: '/testing', label: 'Đợi kết quả', icon: IconPackage },
	{ link: '/finished', label: 'Người bệnh đã khám', icon: IconZoomCheck },
]

export function NavbarSimpleColored({ opened }: { opened: boolean }) {
	const location = useLocation()
	const { classes, cx } = useStyles()
	const [active, setActive] = useState(location.pathname)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const authData = useAppSelector(selectAuth)

	const links = data.map((item) => (
		<a
			className={cx(classes.link, {
				[classes.linkActive]: item.link === active,
			})}
			href={item.link}
			key={item.label}
			onClick={(event) => {
				event.preventDefault()
				setActive(item.link)
				navigate(item.link)
			}}
		>
			<item.icon className={classes.linkIcon} stroke={1.5} />
			<span>{item.label}</span>
		</a>
	))

	useEffect(() => {
		console.log('authData', authData)
		if (!authData?.isAuthenticated) {
			navigate('/login')
		}
	}, [authData])

	return (
		<Navbar
			p="md"
			hidden={!opened}
			width={{ sm: 200, lg: 300 }}
			className={classes.navbar}
			hiddenBreakpoint="sm"
		>
			<Navbar.Section grow>
				<Text weight={500} size="sm" className={classes.title} mb="xs">
					Bác sĩ {authData?.information?.name}
				</Text>
				<Stack className={classes.header}>
					{/* <MantineLogo size={28} inverted /> */}
					<Code className={classes.version}>
						Phòng {authData?.information?.room?.roomNumber} -{' '}
						{authData?.information?.room?.roomTypeName}{' '}
						{authData?.information?.room?.departmentName}
					</Code>

					<Clock />
				</Stack>
				{links}
			</Navbar.Section>

			<Navbar.Section className={classes.footer}>
				{/* <a
					href="#"
					className={classes.link}
					onClick={(event) => event.preventDefault()}
				>
					<IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
					<span>Change account</span>
				</a> */}

				{/* <a
					href="#"
					className={classes.link}
					onClick={(event) => {
						event.preventDefault()
						dispatch(logout())
					}}
				>
					<span>Đăng xuất</span>
				</a> */}
				<Button
					leftIcon={<IconLogout className={classes.linkIcon} stroke={1.5} />}
					className={classes.link}
					fullWidth
					variant="subtle"
					onClick={() => {
						dispatch(logout())
					}}
				>
					Đăng xuất
				</Button>
			</Navbar.Section>
		</Navbar>
	)
}
