import React, { createContext, useEffect, useState } from 'react';
import { useLocalStorage } from './use-local-storage';

type MinecraftStatusTypeWithoutLoading = { online: false, address: string } | {
  online: true,
  address: string,
  motd: string,
  icon: string,
  version: string,
  players: {
    name: string,
    avatar: string,
  }[],
  maxPlayers: number,
}

export type MinecraftStatusType = MinecraftStatusTypeWithoutLoading & { loading: boolean }

const MinecraftStatusContext = createContext<MinecraftStatusType | undefined>(undefined);


function MinecraftStatusProvider({ children }: { children: React.ReactNode }) {
  const [minecraftStatus, setMinecraftStatus] = useLocalStorage<MinecraftStatusTypeWithoutLoading>(`minecraft-status`, { online: false, address: "" });
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await window
        .fetch(`/api/minecraft`, {
          method: `GET`,
          headers: {
            "content-type": "application/json",
          },
        })
        .then(res => res.json())

      setMinecraftStatus({
        ...response,
        loading: false,
      })

      setLoading(false)
    }

    fetchStatus()

    // fetch status every 60 seconds
    const interval = setInterval(fetchStatus, 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <MinecraftStatusContext.Provider value={{ ...minecraftStatus, loading }}>
      {children}
    </MinecraftStatusContext.Provider>
  );
}

function useMinecraftStatus() {
  const MinecraftStatus = React.useContext(MinecraftStatusContext);
  if (MinecraftStatus === undefined) {
    throw new Error('useMinecraftStatus must be used within a MinecraftStatusProvider');
  }

  return MinecraftStatus;
}

export { MinecraftStatusProvider, useMinecraftStatus };