import type { AuthDto } from "../dto/AuthDto.ts";
import api from "../../api/axios.ts";
import type { RegisterDto } from "../dto/RegisterDto.ts";

const AUTH_URL = "/auth";

export const loginApicall = (loginDto: AuthDto) => api.post(`${AUTH_URL}/login`, loginDto);
export const registerApiCall = (registerDto: RegisterDto) => api.post(`${AUTH_URL}/register`, registerDto);
export const logoutApicall = () => api.post(`${AUTH_URL}/logout`);

export const setUser = (user: any) => {
    sessionStorage.setItem("user", JSON.stringify(user));
};
export const getUser = () => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
};

export const setLogeedInUsername = (username: string) => {
    sessionStorage.setItem("loggedInUsername", username);
};
export const getLogeedInUsername = () => {
    return sessionStorage.getItem("loggedInUsername");
};

export const setRoleName = (roleName: string) => {
    sessionStorage.setItem("roleName", roleName);
};
export const getRoleName = () => {
    return sessionStorage.getItem("roleName");
};

export const isLoggedIn = () => {
    return getUser() !== null;
};

export const isCustomer = () => {
    return getRoleName() === "ROLE_CUSTOMER";
};

export const isAdmin = () => {
    return getRoleName() === "ROLE_ADMIN";
};

export const setToken = (token: string) => {
    console.log("=== setToken called with token:", token);
    sessionStorage.setItem("token", token);
    console.log("Token saved to sessionStorage, now has:", sessionStorage.getItem("token"));
};

export const getToken = () => {
    const token = sessionStorage.getItem("token");
    console.log("=== getToken called, returning:", token);
    return token;
};

export const logout = async () => {
    try {
        await logoutApicall();
    } catch (e) {
        console.error("Logout failed", e);
    } finally {
        localStorage.clear();
        sessionStorage.clear();
    }
};
