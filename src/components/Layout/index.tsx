import { ReactNode, useState } from 'react'
import {
	AppShell,
	Header,
	Text,
	MediaQuery,
	Burger,
	useMantineTheme,
	Box,
} from '@mantine/core'
import { NavbarSimpleColored } from '../NavBar'

type LayoutAppShellProps = {
	children: ReactNode
}
const LayoutAppShell = ({ children }: LayoutAppShellProps) => {
	const theme = useMantineTheme()
	const [opened, setOpened] = useState(false)
	return (
		<AppShell
			styles={{
				main: {
					background:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[2],
					maxHeight: '100vh',
				},
			}}
			navbar={<NavbarSimpleColored opened={!!opened} />}
			// footer={<FooterApp />}
		>
			<Box
				sx={{
					background:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[2],
				}}
			>
				{children}
			</Box>
		</AppShell>
	)
}

export default LayoutAppShell
