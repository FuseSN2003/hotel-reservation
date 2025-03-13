'use client';

import { createContext, useState } from 'react';

type ReservationContextType = {
  information: any;
  addInformation: (data: any) => void;
  state: number;
  setState: (state: number) => void;
};

export const ReservationContext = createContext<ReservationContextType>({
  information: {},
  addInformation: () => {},
  state: 1,
  setState: () => {},
});

export const ReservationProvider = ({ children }: { children: any }) => {
  const [information, setInformation] = useState({});
  const [state, setState] = useState(1);

  const addInformation = (data: any) => {
    setInformation((prev) => {
      return {
        ...prev,
        ...data,
      };
    });
  };

  return (
    <ReservationContext.Provider
      value={{ information, addInformation, state, setState }}
    >
      {children}
    </ReservationContext.Provider>
  );
};
