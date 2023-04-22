import { ReactNode, useState } from 'react'
import { AppShell, useMantineTheme, Box, Aside } from '@mantine/core'
import { NavbarSimpleColored } from '../NavBar'
import LayoutHeader from './Header'

type LayoutAppShellProps = {
	children: ReactNode
}
const LayoutAppShell = ({ children }: LayoutAppShellProps) => {
	const theme = useMantineTheme()
	const [opened, setOpened] = useState(false)
	return (
		<AppShell
			styles={{
				root: {
					width: '100%',
				},
				main: {
					background:
						theme.colorScheme === 'dark'
							? theme.colors.dark[8]
							: theme.colors.gray[2],
					width: 'calc(100vw - 17px)',
				},
			}}
			navbar={<NavbarSimpleColored opened={!!opened} />}
			header={<LayoutHeader />}
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
