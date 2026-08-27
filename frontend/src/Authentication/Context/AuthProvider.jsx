import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { BASE_URL } from "../../Utils/constants";

const api = axios.create({ baseURL: BASE_URL });

const authGetUser = () => {
  const token = localStorage.getItem("access-token");
  return api.get("/user", {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new citizen account
  const registerUser = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post("/register", payload);
      localStorage.setItem("access-token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Login against the CityFIX API
  const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("access-token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // Observer to restore auth state on page refresh
  useEffect(() => {
    const token = localStorage.getItem("access-token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    authGetUser()
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("access-token");
        setUser(null);
        setLoading(false);
      });
  }, []);

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    setUser(null);
    setLoading(false);
    return Promise.resolve();
  };

  const authInfo = {
    registerUser,
    signInUser,
    user,
    loading,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
