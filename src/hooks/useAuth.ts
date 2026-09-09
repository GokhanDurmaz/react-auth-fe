import { useLocalStorage } from './useLocalStorage';
import { User } from '../types/user';

export const useAuth = () => {
    const [token, setToken, removeToken] = useLocalStorage<string | null>('token', null);
    const [user, setUser, removeUser] = useLocalStorage<User | null>('user', null);

    const isAuthenticated = !!token || !!window.localStorage.getItem('token');

    const login = (authToken: string, userData: User) => {
        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        removeToken();
        removeUser();
    };

    return {
        token: token || window.localStorage.getItem('token'),
        user,
        isAuthenticated,
        login,
        logout,
    };
};