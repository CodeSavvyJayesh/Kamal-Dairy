import { createContext } from "react";

/** Shared context object - kept in its own module so the provider file only exports a component. */
export const WalletContext = createContext(null);
