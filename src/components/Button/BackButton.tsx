import { Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
	const navigate = useNavigate();
	return (
		<Button variant="subtle" color="grape" onClick={() => navigate("/")} leftIcon={<IconChevronLeft />} pl={0}>
			Quay lại
		</Button>
	);
};
export default BackButton;
