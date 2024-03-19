import { Toaster } from "../ui/sonner";

interface Props {
	children: React.ReactNode;
}
export default function Providers(props: Props) {
	return (
		<>
			<Toaster />
			<>{props.children}</>
		</>
	);
}
