import { useState, useEffect } from 'react'
import {
	createStyles,
	Navbar,
	Tooltip,
	UnstyledButton,
	Code,
	Text,
	Button,
	Stack,
	useMantineTheme,
} from '@mantine/core'
import {
	IconList,
	IconZoomCheck,
	IconLogout,
	IconPackage,
	TablerIcon,
} from '@tabler/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/auth/slice'
import { selectAuth } from '@/store/auth/selectors'
import Clock from '../Clock'
import { useMediaQuery } from '@mantine/hooks'

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
			[`@media (max-width: ${theme.breakpoints.md}px)`]: {
				span: {
					fontSize: theme.fontSizes.xs,
				},
			},
		},

		linkIcon: {
			ref: icon,
			color: theme.white,
			opacity: 0.75,
			marginRight: theme.spacing.sm,
			[`@media (max-width: ${theme.breakpoints.md}px)`]: {
				marginRight: 0,
			},
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

interface NavbarLinkProps {
	icon: TablerIcon
	label: string
	active?: boolean
	onClick?: React.MouseEventHandler<HTMLButtonElement>
}

function NavbarLinkMobile({
	icon: Icon,
	label,
	active,
	onClick,
}: NavbarLinkProps) {
	const { classes, cx } = useStyles()
	return (
		<Tooltip label={label} position="right" transitionDuration={0}>
			<UnstyledButton
				onClick={onClick}
				className={cx(classes.link, { [classes.linkActive]: active })}
			>
				<Icon stroke={1.5} />
			</UnstyledButton>
		</Tooltip>
	)
}

export function NavbarSimpleColored({ opened }: { opened: boolean }) {
	const location = useLocation()
	const { classes, cx } = useStyles()
	const [active, setActive] = useState(location.pathname)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const authData = useAppSelector(selectAuth)

	const theme = useMantineTheme()
	const matches = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

	const links = data.map((item) =>
		matches ? (
			<NavbarLinkMobile
				key={item.label}
				onClick={(event) => {
					event.preventDefault()
					setActive(item.link)
					navigate(item.link)
				}}
				icon={item.icon}
				label={item.label}
			/>
		) : (
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
		)
	)

	useEffect(() => {
		if (!authData?.isAuthenticated) {
			navigate('/login')
		}
	}, [authData])

	return (
		<Navbar
			p={matches ? 'xs' : 'md'}
			width={{ base: 70, sm: 150, lg: 250 }}
			className={classes.navbar}
		>
			<Navbar.Section grow>
				{matches ? (
					<Tooltip
						label={`Bác sĩ ${authData?.information?.name}`}
						position="right"
						transitionDuration={0}
					>
						<Text weight={500} size="xs" className={classes.title} mb="xs">
							Bác sĩ
						</Text>
					</Tooltip>
				) : (
					<Text weight={500} size="sm" className={classes.title} mb="xs">
						Bác sĩ {authData?.information?.name}
					</Text>
				)}
				<Stack className={classes.header}>
					{matches ? (
						<Tooltip
							label={`${authData?.information?.room?.roomNumber} -
						${authData?.information?.room?.roomTypeName}
						${authData?.information?.room?.departmentName}`}
							position="right"
							transitionDuration={0}
						>
							<Code className={classes.version}>Phòng</Code>
						</Tooltip>
					) : (
						<Code className={classes.version}>
							Phòng {authData?.information?.room?.roomNumber} -{' '}
							{authData?.information?.room?.roomTypeName}{' '}
							{authData?.information?.room?.departmentName}
						</Code>
					)}

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
				{matches ? (
					<Tooltip label={'Đăng xuất'} position="right" transitionDuration={0}>
						<UnstyledButton
							sx={{ maxWidth: '100%' }}
							onClick={() => {
								dispatch(logout())
							}}
							className={cx(classes.link)}
						>
							<IconLogout className={classes.linkIcon} />
						</UnstyledButton>
					</Tooltip>
				) : (
					<Button
						leftIcon={<IconLogout className={classes.linkIcon} size={16} />}
						className={classes.link}
						fullWidth
						size="sm"
						variant="subtle"
						onClick={() => {
							dispatch(logout())
						}}
					>
						Đăng xuất
					</Button>
				)}
			</Navbar.Section>
		</Navbar>
	)
}
