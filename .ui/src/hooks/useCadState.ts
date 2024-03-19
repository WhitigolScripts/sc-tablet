import { create } from "zustand";

type CadStore = {
	cadState: {
		show: boolean;
		name: string;
		url: string;
	};
	setCadState: (state: CadStore["cadState"]) => void;
};

const useCadState = create<CadStore>((set) => ({
	cadState: {
		show: process.env.NODE_ENV === "development" ? true : false,
		name:
			process.env.NODE_ENV === "development" ? "Development Tablet" : "",
		url:
			process.env.NODE_ENV === "development"
				? "https://cad.venturerp.xyz/"
				: "",
	},
	setCadState: (state) => set({ cadState: state }),
}));

export default useCadState;
