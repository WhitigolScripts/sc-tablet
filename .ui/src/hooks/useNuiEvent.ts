import { MutableRefObject, useEffect, useRef } from "react";
import { noop } from "../utils/misc";

interface NuiMessageData<T = unknown> {
	type: string;
	data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param type The specific `type` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = unknown>(
	type: string,
	handler: (data: T) => void,
) => {
	const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop);

	// Make sure we handle for a reactive handler
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
			const { type: eventType, data } = event.data;

			if (savedHandler.current) {
				if (eventType === type) {
					savedHandler.current(data);
				}
			}
		};

		window.addEventListener("message", eventListener);
		// Remove Event Listener on component cleanup
		return () => window.removeEventListener("message", eventListener);
	}, [type]);
};
