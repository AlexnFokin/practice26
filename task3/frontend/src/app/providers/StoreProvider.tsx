import { createContext, type ReactNode } from 'react';
import Store from '../../features/auth/model/store';

const store = new Store();

export const Context = createContext<{ store: Store }>({ store });

export function StoreProvider({ children }: { children: ReactNode }) {
    return <Context.Provider value={{ store }}>{children}</Context.Provider>;
}