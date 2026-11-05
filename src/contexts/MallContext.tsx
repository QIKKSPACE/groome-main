"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { apiClient } from "@/api/apiClient";
import { NearbyMall } from "@/types/mall";
import { useLocation } from "@/contexts/LocationContext";

const PAGE_LIMIT = 10;

interface MallContextType {
  malls: NearbyMall[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  totalCount: number;
  isInitialized: boolean;
  fetchMalls: (options?: { isRefresh?: boolean; force?: boolean }) => Promise<void>;
  loadMore: () => Promise<void>;
}

const MallContext = createContext<MallContextType | undefined>(undefined);

export const MallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { location } = useLocation();

  const [malls, setMalls] = useState<NearbyMall[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Track the coordinates for which malls are currently cached
  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Deduplicate malls by id when appending pages
  const mergeMalls = (existing: NearbyMall[], incoming: NearbyMall[]): NearbyMall[] => {
    const existingIds = new Set(existing.map((m) => m.id));
    const newItems = incoming.filter((m) => !existingIds.has(m.id));
    return [...existing, ...newItems];
  };

  /**
   * Fetch malls for page 1 (or refresh)
   * Only fetches if not yet initialized, forced, or if user's location has changed!
   */
  const fetchMalls = useCallback(
    async (options?: { isRefresh?: boolean; force?: boolean }) => {
      const isRefresh = options?.isRefresh ?? false;
      const force = options?.force ?? false;

      const lat = location?.lat;
      const lng = location?.lng;

      // If user has no coordinates, do not fetch
      if (lat == null || lng == null) {
        setMalls([]);
        setIsInitialized(false);
        lastCoordsRef.current = null;
        return;
      }

      // If already initialized for these exact coordinates and not refreshing/forcing, reuse cached data!
      const isSameCoords =
        lastCoordsRef.current != null &&
        Math.abs(lastCoordsRef.current.lat - lat) < 0.0001 &&
        Math.abs(lastCoordsRef.current.lng - lng) < 0.0001;

      if (!force && !isRefresh && isInitialized && isSameCoords) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get("/users/nearby-malls", {
          params: {
            latitude: lat,
            longitude: lng,
            page: 1,
            limit: PAGE_LIMIT,
          },
        });

        const data = response.data;
        const list: NearbyMall[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.malls)
          ? data.malls
          : [];

        const count: number =
          typeof data?.count === "number" ? data.count : list.length;

        setMalls(list);
        setTotalCount(count);
        setPage(1);
        setHasMore(list.length >= PAGE_LIMIT && list.length < count);
        setIsInitialized(true);
        lastCoordsRef.current = { lat, lng };
      } catch (err: any) {
        console.error("Failed to fetch nearby malls:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to fetch nearby digital malls."
        );
      } finally {
        setLoading(false);
      }
    },
    [location?.lat, location?.lng, isInitialized]
  );

  /**
   * Fetch next page and append to cached malls in context
   */
  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;

    const lat = location?.lat;
    const lng = location?.lng;
    if (lat == null || lng == null) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    try {
      const response = await apiClient.get("/users/nearby-malls", {
        params: {
          latitude: lat,
          longitude: lng,
          page: nextPage,
          limit: PAGE_LIMIT,
        },
      });

      const data = response.data;
      const incomingList: NearbyMall[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.malls)
        ? data.malls
        : [];

      if (incomingList.length === 0) {
        setHasMore(false);
      } else {
        setMalls((prev) => {
          const merged = mergeMalls(prev, incomingList);
          if (totalCount > 0 && merged.length >= totalCount) {
            setHasMore(false);
          } else if (incomingList.length < PAGE_LIMIT) {
            setHasMore(false);
          }
          return merged;
        });
        setPage(nextPage);
      }
    } catch (err: any) {
      console.error("Failed to load more malls:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, hasMore, location?.lat, location?.lng, page, totalCount]);

  // When location coordinates change to different values, invalidate cache and trigger fetch
  useEffect(() => {
    const lat = location?.lat;
    const lng = location?.lng;

    if (lat == null || lng == null) {
      if (lastCoordsRef.current != null) {
        setMalls([]);
        setIsInitialized(false);
        lastCoordsRef.current = null;
      }
      return;
    }

    const isDifferent =
      lastCoordsRef.current == null ||
      Math.abs(lastCoordsRef.current.lat - lat) >= 0.0001 ||
      Math.abs(lastCoordsRef.current.lng - lng) >= 0.0001;

    if (isDifferent) {
      fetchMalls({ force: true });
    }
  }, [location?.lat, location?.lng, fetchMalls]);

  return (
    <MallContext.Provider
      value={{
        malls,
        loading,
        loadingMore,
        error,
        hasMore,
        page,
        totalCount,
        isInitialized,
        fetchMalls,
        loadMore,
      }}
    >
      {children}
    </MallContext.Provider>
  );
};

export const useMalls = (): MallContextType => {
  const context = useContext(MallContext);
  if (!context) {
    throw new Error("useMalls must be used within a MallProvider");
  }
  return context;
};
