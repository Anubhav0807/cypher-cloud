"use client";

import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [files, setFiles] = useState([]);
  const [storage, setStorage] = useState({ total: 0, used: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/dashboard");
      console.log("Responses now : ", res.data);

      const { user, stats, files } = res.data;
      setUser(user);
      setStats(stats);
      setFiles(files);
      setStorage(user.storage || { total: 0, used: 0 });
      console.log("Currently" + files);
      console.log("Currently" + storage);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.replace("/sign-in");
      } else {
        console.error("Dashboard fetch failed", err);
      }
    } finally {
      setLoading(false);
    }
  };
  const resetUserState = () => {
    setUser(null);
    setStats(null);
    setFiles([]);
    setStorage({ total: 0, used: 0 });
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