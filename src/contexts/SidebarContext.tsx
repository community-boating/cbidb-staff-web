import React, { useState } from "react";

import { SIDEBAR_POSITION, SIDEBAR_BEHAVIOR } from "../constants";
import useSettingsState from "../hooks/useSettingsState";

const initialState = {
	isOpen: true,
	setIsOpen: null as any,
	position: SIDEBAR_POSITION.LEFT,
	setPosition: null as any,
	behavior: SIDEBAR_BEHAVIOR.STICKY,
	setBehavior: null as any
};

const SidebarContext = React.createContext(initialState);

function SidebarProvider({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	const [position, setPosition] = useSettingsState(
		"sidebarPosition",
		SIDEBAR_POSITION.LEFT
	);
	const [behavior, setBehavior] = useSettingsState(
		"sidebarBehavior",
		SIDEBAR_BEHAVIOR.STICKY
	);

	return (
		<SidebarContext.Provider
			value={{
				isOpen,
				setIsOpen,
				position,
				setPosition,
				behavior,
				setBehavior,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export { SidebarProvider, SidebarContext };
