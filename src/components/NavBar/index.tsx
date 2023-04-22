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
	Badge,
	ThemeIcon,
	MediaQuery,
	Group,
} from '@mantine/core'
import {
	IconList,
	IconZoomCheck,
	IconLogout,
	IconPackage,
	TablerIcon,
	IconUser,
	IconBuilding,
} from '@tabler/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/auth/slice'
import { selectAuth } from '@/store/auth/selectors'
import { useMediaQuery } from '@mantine/hooks'
import { removeLocalItem } from '@/utils/storage'
import { persistor } from '@/store'
import { clearConfig } from '@/store/config/slice'

const useStyles = createStyles((theme, _params, getRef) => {
	const icon: string = getRef('icon')
	return {
		navbar: {
			backgroundColor: theme.fn.variant({
				variant: 'filled',
				color: theme.primaryColor,
			}).background,
		},
		title: {
			textTransform: 'uppercase',
			letterSpacing: -0.25,
			color: theme.white,
		},

		version: {
			color: theme.white,
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
			width: '100%',

			'&:hover': {
				backgroundColor: theme.fn.lighten(
					theme.fn.variant({ variant: 'filled', color: theme.primaryColor })
						.background,
					0.1
				),
			},
			[`@media (max-width: ${theme.breakpoints.lg}px)`]: {
				span: {
					fontSize: theme.fontSizes.xs,
				},
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
	{ link: '', link2: '/', label: 'Chờ khám', icon: IconList },
	{ link: '/testing', label: 'Đợi kết quả', icon: IconPackage },
	{ link: '/finished', label: 'Đã khám', icon: IconZoomCheck },
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
	const theme = useMantineTheme()
	const matches = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`)
	return (
		<Tooltip
			label={label}
			position="right"
			transitionDuration={0}
			hidden={!matches}
		>
			<UnstyledButton
				onClick={onClick}
				className={cx(classes.link, { [classes.linkActive]: active })}
			>
				<Group align="center">
					<Icon stroke={1.5} />

					<MediaQuery
						query={`(max-width: ${theme.breakpoints.lg}px)`}
						styles={{ display: 'none' }}
					>
						<span>{label}</span>
					</MediaQuery>
				</Group>
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
	const matches = useMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`)

	const roomLabel = `${authData?.information?.room?.roomTypeName}
    ${authData?.information?.room?.departmentName} ${authData?.information?.room?.roomNumber}`

	const links = data.map((item) => (
		<NavbarLinkMobile
			key={item.label}
			onClick={(event) => {
				event.preventDefault()
				setActive(item.link)
				navigate(item.link)
			}}
			icon={item.icon}
			label={item.label}
			active={active === item.link || active === item?.link2}
		/>
	))

	useEffect(() => {
		if (!authData?.isAuthenticated) {
			navigate('/login')
		}
	}, [authData])

	return (
		<Navbar
			p={matches ? 'xs' : 'md'}
			width={{ base: 70, lg: 200 }}
			className={classes.navbar}
		>
			<Navbar.Section grow>
				<Stack align="center">
					<MediaQuery
						query={`(min-width: ${theme.breakpoints.lg}px)`}
						styles={{ display: 'none' }}
					>
						<Tooltip
							label={`Bác sĩ ${authData?.information?.name}`}
							position="right"
							transitionDuration={0}
						>
							<ThemeIcon variant="light" mb="xs">
								<IconUser />
							</ThemeIcon>
						</Tooltip>
					</MediaQuery>
					<MediaQuery
						query={`(max-width: ${theme.breakpoints.lg}px)`}
						styles={{ display: 'none' }}
					>
						<Text weight={500} size="sm" className={classes.title} mb="xs">
							Bác sĩ {authData?.information?.name}
						</Text>
					</MediaQuery>
				</Stack>
				<Stack className={classes.header} align={matches ? 'center' : 'start'}>
					<MediaQuery
						query={`(min-width: ${theme.breakpoints.lg}px)`}
						styles={{ display: 'none' }}
					>
						<Tooltip label={roomLabel} position="right" transitionDuration={0}>
							<ThemeIcon variant="light">
								<IconBuilding />
							</ThemeIcon>
						</Tooltip>
					</MediaQuery>
					<MediaQuery
						query={`(max-width: ${theme.breakpoints.lg}px)`}
						styles={{ display: 'none' }}
					>
						<Text size="xs" weight={500} className={classes.version}>
							{roomLabel}
						</Text>
					</MediaQuery>
				</Stack>
				{links}
			</Navbar.Section>

			<Navbar.Section className={classes.footer}>
				<NavbarLinkMobile
					icon={IconLogout}
					label="Đăng xuất"
					onClick={() => {
						dispatch(logout())
						dispatch(clearConfig())
						persistor.pause()
						persistor.flush().then(() => {
							return persistor.purge()
						})
					}}
				/>
			</Navbar.Section>
		</Navbar>
	)
}
