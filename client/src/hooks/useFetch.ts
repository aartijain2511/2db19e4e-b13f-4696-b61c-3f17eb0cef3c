import { useEffect, useRef } from "react";
import { STATUS } from "../constants";
import { useSetRecoilState } from "recoil";
import savingsDataState from "../state/atoms/savingsDataState";
import apiFetchState from "../state/atoms/apiFetchState";
import { Value } from "../types";
import roundMinutes from "../utils/roundMinutes";
import { API_URL } from "../config";

const useFetch = () => {
  const cache = useRef(new Map<string, JSON | null>());
  const setSavingsDataState: Function = useSetRecoilState(savingsDataState);
  const setApiFetchStatus = useSetRecoilState(apiFetchState);

  useEffect(() => {
    const clearExpiredItems = () => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const storedItem = localStorage.getItem(key);
          if (storedItem) {
            const parsedJson = JSON.parse(storedItem);
            if (Date.now() > parsedJson[1]) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    };

    clearExpiredItems();
    const intervalId = setInterval(clearExpiredItems, 24 * 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchSavingsData = async (
    deviceId: number,
    dateRange: Value,
  ): Promise<void> => {
    setApiFetchStatus(STATUS.PENDING);

    if (Array.isArray(dateRange)) {
      let from = dateRange[0]?.toISOString();
      let to = dateRange[1]?.toISOString();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (from && to) {
        from = roundMinutes(from);
        to = roundMinutes(to);

        const key = JSON.stringify([deviceId, [from, to]]);

        // Check in-memory cache
        if (cache.current.has(key)) {
          const data = cache.current.get(key);
          setApiFetchStatus(STATUS.SUCCESS);
          setSavingsDataState({ data, error: "" });
          return;
        }

        // Check local storage for cached data
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          const data = parsedData[0];
          const expirationTime = parseInt(parsedData[1]);
          if (expirationTime > Date.now()) {
            cache.current.set(key, data);
            setApiFetchStatus(STATUS.SUCCESS);
            setSavingsDataState({ data, error: "" });
            return;
          }
        }

        try {
          const res = await fetch(
            `${API_URL}/api/savings?id=${deviceId}&from=${from}&to=${to}&timezone=${timezone}`,
          );

          if (!res.ok) {
            let error = await res.json();
            setApiFetchStatus(STATUS.FAILED);
            setSavingsDataState({ data: {}, error });
            return;
          }

          const result = await res.json();
          const data = result.data;

          setApiFetchStatus(STATUS.SUCCESS);
          setSavingsDataState({ data, error: "" });
          cache.current.set(key, data);

          // Store data and expiration time in local storage
          const expiration = Date.now() + 24 * 60 * 60 * 1000; // 1 day
          localStorage.setItem(key, JSON.stringify([data, expiration]));
          return;
        } catch (error) {
          setApiFetchStatus(STATUS.FAILED);
          setSavingsDataState({ data: {}, error });
          return;
        }
      }
    }

    setApiFetchStatus(STATUS.FAILED);
    setSavingsDataState({ data: {}, error: "Dates are invalid" });
  };

  return fetchSavingsData;
};

export default useFetch;
