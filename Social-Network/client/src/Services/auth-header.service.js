export const authHeader = () => {
    const token = JSON.parse(localStorage.getItem("jwt"));
    if (token) return {'Authorization': `Bearer ${token}`};
    return {};
};
