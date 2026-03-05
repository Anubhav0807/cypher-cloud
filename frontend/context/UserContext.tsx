"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [files, setFiles] = useState([]);
  const [storage, setStorage] = useState({ total: 0, used: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard`,
        { withCredentials: true }
      );
      console.log(res.data);

      const { user, stats, files } = res.data;

      setUser(user);
      setStats(stats);
      setFiles(files);
      setStorage(user.storage?.storage || { total: 0, used: 0 });
      console.log("Currently"+files);
      console.log("Currently"+storage);

    } catch (err) {
      console.error("Dashboard fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        stats,
        files,
        storage,
        loading,
        refreshDashboard: fetchDashboard, // 👈 expose this
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);