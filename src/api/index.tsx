import axios from "axios";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { UserInfo } from "./User";

const client = axios.create({
  baseURL: "http://localhost:8080",
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log("error 401");
    } else if (error.response.status === 400) {
      console.log("error 400");
    } else if (error.response.status === 403) {
      console.log("error 403");
      deleteCookie("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
client.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const api = client;

export async function getUser(id: number) {
  try {
    const response = await api.get(`/auth/getUsers/${id}`);
    return response.data as UserInfo;
  } catch (error) {
    console.log(error);
  }
}

export function getUsers() {
  return async () => {
    const token = getCookie("token");
    const { data } = await api.get("/auth/getUsers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };
}
const tokenPayload = async () => {
  const token = await getCookie("token");
  if (!token) return null;
  const payload = token?.split(".")[1];
  console.log(payload);
  const decoded = jwtDecode(token);
  console.log(decoded);

  return decoded?.sub;
};
export function getCurrentUser() {
  return async () => {
    const userName = await tokenPayload();
    if (!userName) return null;
    const token = getCookie("token");
    const { data } = await api.get("/auth/User/" + userName, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  };
}

// Logout function
export const logout = async () => {
  deleteCookie("token"); // Delete token cookie
  // Additional logic for clearing user data, redirecting, etc.
  window.location.href = "/login";
};
