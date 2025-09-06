import { LayoutContext } from './useLayoutContext';
import { useCurrentUser } from "../user/useCurrentUser";
import { useState } from 'react';


export const LayoutProvider = ({ children }) => {
  
  const [openLogin, setOpenLogin] = useState(false);
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  return (
    <LayoutContext.Provider
      value={{
        currentUser,
        currentUserLoading,
        openLogin,
        setOpenLogin,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
