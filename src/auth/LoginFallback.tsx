import React from 'react';

import { useUser } from '../api/authAPI';
import { Login } from './Login';

export const LoginFallback: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { data: user } = useUser();
  if (!user?.id) {
    return <Login />;
  }
  return <>{children}</>;
};
