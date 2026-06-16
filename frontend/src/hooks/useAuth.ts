import {  useEffect, useMemo, useState } from "react";
import { getToken } from "@/api/client";

const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => getToken());

  useEffect(() => {
    setToken(getToken());
  }, []);

  

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  return {
    isAuthenticated,
  };
};

export default useAuth;
