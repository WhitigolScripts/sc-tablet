import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function App() {
	type State = {
		show: boolean;
		name: string;
		url: string;
	};
	const [state, setState] = useState();
	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<Card className="h-3/4 w-3/4 opacity-90">
				<CardHeader className="border-b p-2">
					<CardTitle>Test</CardTitle>
					<CardDescription>
						Tablet resource created by Whitigol
					</CardDescription>
				</CardHeader>
				<CardContent className="p-4">
					<p>Test</p>
				</CardContent>
			</Card>
		</div>
	);
}
