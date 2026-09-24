import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Header } from '../widgets/header/Header';
import { AppRouter } from './AppRouter';
import { Context } from './providers/StoreProvider';

function App() {
    const { store } = useContext(Context);
    const tokenName = import.meta.env.VITE_TOKEN_NAME;

    useEffect(() => {
        if (localStorage.getItem(tokenName)) {
            store.checkAuth();
        }
    }, []);

    if (store.isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-8">
                <AppRouter />
            </main>
        </div>
    );
}

export default observer(App);