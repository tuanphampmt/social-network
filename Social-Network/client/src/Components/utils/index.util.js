const TOKEN_KEY = 'jwt';

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem("users");
};

export const isLogin = () => !!localStorage.getItem(TOKEN_KEY);
