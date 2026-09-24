import { useContext, useState, type FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { Context } from '../../../app/providers/StoreProvider';
import { Button, Input } from '../../../shared/ui';

const LoginForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { store } = useContext(Context);

    async function handleLogin() {
        setError(null);
        try {
            await store.login(email, password);
        } catch {
            setError('Неверный email или пароль');
        }
    }

    async function handleRegister() {
        setError(null);
        try {
            await store.register(email, password);
        } catch {
            setError('Не удалось зарегистрироваться');
        }
    }

    if (store.isAuth) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                className="m-4"
            />
            <Input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                className="m-4"
            />

            {error && <p className="m-4 text-sm text-red-500">{error}</p>}

            <Button onClick={handleLogin} className="m-2">
                Login
            </Button>
            <Button onClick={handleRegister} className="m-2">
                Register
            </Button>
        </div>
    );
};

export default observer(LoginForm);