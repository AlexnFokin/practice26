import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { routes, type AppRoute } from './routes/routes';
import { Context } from './providers/StoreProvider';

export const AppRouter = observer(() => {
    const { store } = useContext(Context);

    return (
        <Routes>
            {routes.map((route: AppRoute) => {
                const element = route.authOnly && !store.isAuth
                    ? <Navigate to="/login" replace />
                    : route.element;

                return (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={element}
                    />
                );
            })}
        </Routes>
    );
});