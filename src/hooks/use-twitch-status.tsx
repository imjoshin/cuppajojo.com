import React, { createContext, useEffect, useState } from 'react';

export type TwitchStatusType = { live: false, loading: boolean } | {
  live: true,
  user: string,
  game: string,
  title: string,
  viewers: number,
  started: string,
  thumbnail: string,
  gameThumbnail: string,
  loading: boolean,
}

const TwitchStatusContext = createContext<TwitchStatusType | undefined>(undefined);



function TwitchStatusProvider({ children }: { children: React.ReactNode }) {
  const [twitchStatus, setTwitchStatus] = useState<TwitchStatusType>({ live: false, loading: true });

  useEffect(() => {
    const fetchStatus = async () => {
      const response = await window
        .fetch(`/api/status`, {
          method: `GET`,
          headers: {
            "content-type": "application/json",
          },
        })
        .then(res => res.json())

      setTwitchStatus({
        ...response,
        loading: false,
      })
    }

    fetchStatus()

    // fetch status every 60 seconds
    const interval = setInterval(fetchStatus, 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, []);

  return (
    <TwitchStatusContext.Provider value={twitchStatus}>
      {children}
    </TwitchStatusContext.Provider>
  );
}

function useTwitchStatus() {
  const twitchStatus = React.useContext(TwitchStatusContext);
  if (twitchStatus === undefined) {
    throw new Error('useTwitchStatus must be used within a TwitchStatusProvider');
  }

  return twitchStatus;
}

export { TwitchStatusProvider, useTwitchStatus };