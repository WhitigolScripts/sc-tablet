import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRef, useState } from "react";
import { Button } from "./components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import {
	IconChevronLeft,
	IconChevronRight,
	IconHome,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import useCadState from "./hooks/useCadState";
import { useNuiEvent } from "./hooks/useNuiEvent";

type State = {
	show: boolean;
	name: string;
	url: string;
};

declare function GetParentResourceName(): string;

export default function App() {
	const state = useCadState((state) => state.cadState);
	const setState = useCadState((state) => state.setCadState);

	const frame = useRef<HTMLIFrameElement>(null);
	function handleFrameNav(nav: "home" | "back" | "forward") {
		switch (nav) {
			case "home":
				frame.current?.contentWindow?.location.replace(state.url);
				break;
			case "back":
				frame.current?.contentWindow?.history.back();
				break;
			case "forward":
				frame.current?.contentWindow?.history.forward();
				break;
		}
	}

	useNuiEvent<{ name: string; url: string }>("init", (data) => {
		setState({
			...state,
			name: data.name,
			url: data.url,
		});
		toast.success(`Tablet ready!\nName: ${data.name}\nURL: ${data.url}`);
	});

	useNuiEvent("close", () => {
		setState({
			...state,
			show: false,
		});
		toast.info("Tablet closed");
	});

	useNuiEvent("open", () => {
		setState({
			...state,
			show: true,
		});
		toast.info("Tablet opened");
	});

	function close() {
		setState({
			name: state.name,
			url: state.url,
			show: false,
		});

		toast.info("Tablet closed");

		fetch(`https://${GetParentResourceName()}/close`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=UTF-8",
			},
		});
	}

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			{process.env.NODE_ENV === "development" && (
				<>
					<DevTools state={state} setState={setState} />
					<img
						src="https://media.rockstargames.com/rockstargames/img/global/news/upload/15_gtavpc_03272015.jpg"
						className="absolute h-full w-full object-cover -z-1"
						alt="Background"
					/>
				</>
			)}
			<Card
				className="h-3/4 w-3/4 opacity-95 p-0 m-0 flex flex-col select-none border-2"
				style={{
					display: state.show ? "flex" : "none",
				}}
			>
				<CardHeader className="border-b px-2 py-3 space-y-0 flex flex-row items-center justify-between relative">
					<div className="flex flex-row gap-2">
						{/* Icons for back home and forward */}
						<Button
							size="icon"
							className="size-7"
							variant="ghost"
							onClick={() => handleFrameNav("back")}
						>
							<IconChevronLeft className="size-4" />
						</Button>
						<Button
							size="icon"
							className="size-7"
							variant="ghost"
							onClick={() => handleFrameNav("home")}
						>
							<IconHome className="size-4" />
						</Button>
						<Button
							size="icon"
							className="size-7"
							variant="ghost"
							onClick={() => handleFrameNav("forward")}
						>
							<IconChevronRight className="size-4" />
						</Button>
					</div>
					<div className="text-center absolute inset-x-0 -z-10">
						<CardTitle className="text-xl">{state.name}</CardTitle>
						<CardDescription className="text-xs">
							Tablet resource created by Whitigol
						</CardDescription>
					</div>
					<div>
						<Button
							size="icon"
							className="size-7"
							variant="ghost"
							onClick={close}
						>
							<IconX className="size-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0 grow">
					<iframe
						className="h-full w-full rounded-b-md select-none"
						src={state.url}
						ref={frame}
					></iframe>
				</CardContent>
			</Card>
		</div>
	);
}

interface DevToolsProps {
	state: State;
	setState: (state: State) => void;
}
function DevTools(props: DevToolsProps) {
	const [url, setUrl] = useState(props.state.url);
	const [name, setName] = useState(props.state.name);
	return (
		<div className="absolute top-3 left-3 p-2 bg-zinc-950 rounded-md z-10">
			<h1 className="text-white text-md font-bold mb-1 border-b-2">
				Dev Tools
			</h1>
			<div className="flex flex-row items-center gap-2">
				<Button
					onClick={() =>
						props.setState({
							name: props.state.name,
							url: props.state.url,
							show: !props.state.show,
						})
					}
					size="sm"
				>
					{props.state.show ? "Hide" : "Show"} CAD
				</Button>
				<Dialog>
					<DialogTrigger asChild>
						<Button size="sm">Change URL</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Change URL</DialogTitle>
							<DialogDescription>
								Change the URL of the CAD
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col gap-2">
							<Label>
								<span>URL</span>
								<Input
									className="mt-1"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
								/>
							</Label>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button
									onClick={() => {
										props.setState({
											name: props.state.name,
											show: props.state.show,
											url,
										});
									}}
								>
									Save
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<Dialog>
					<DialogTrigger asChild>
						<Button size="sm">Change Name</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Change Name</DialogTitle>
							<DialogDescription>
								Change the name of the CAD
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col gap-2">
							<Label>
								<span>Name</span>
								<Input
									className="mt-1"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</Label>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button
									onClick={() => {
										props.setState({
											show: props.state.show,
											url: props.state.url,
											name,
										});
									}}
								>
									Save
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
