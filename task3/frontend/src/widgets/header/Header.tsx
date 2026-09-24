import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '../../shared/ui';
import { Context } from '../../app/providers/StoreProvider';


export const Header = observer(() => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    async function handleLogout() {
        await store.logout();
        navigate('/');
    }

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                <Link to="/" className="text-xl font-bold text-gray-900">
                    Блог
                </Link>

                <div className="flex items-center gap-3">
                    {store.isAuth ? (
                        <>
                            <Link to="/posts/new">
                                <Button>Создать пост</Button>
                            </Link>
                            <span className="hidden text-sm text-gray-600 sm:inline">
                                {store.user.email}
                            </span>
                            <Button variant="ghost" onClick={handleLogout}>
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <Link to="/login">
                            <Button variant="secondary">Войти</Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
});