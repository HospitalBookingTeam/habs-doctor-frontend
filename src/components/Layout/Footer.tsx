import {
	IconBrandTwitter,
	IconBrandYoutube,
	IconBrandInstagram,
	IconBuildingHospital,
} from '@tabler/icons'
import { createStyles, Container, Group, ActionIcon, Text } from '@mantine/core'
import { Footer } from '@mantine/core'

const useStyles = createStyles((theme) => ({
	inner: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		[theme.fn.smallerThan('xs')]: {
			flexDirection: 'column',
		},
		background: theme.colors.green[6],
	},

	links: {
		[theme.fn.smallerThan('xs')]: {
			marginTop: theme.spacing.md,
		},
	},
}))

export function FooterApp() {
	const { classes } = useStyles()

	return (
		<Footer height={60} p="md" className={classes.inner}>
			<IconBuildingHospital size={28} />
			<Group spacing={0} className={classes.links} position="right" noWrap>
				<Text color="dimmed" size="sm">
					© 2022 HABS. All rights reserved.
				</Text>
			</Group>
		</Footer>
	)
}
