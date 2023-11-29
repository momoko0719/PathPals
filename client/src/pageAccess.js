import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './auth-config';

const PageAccess = () => {
  const { instance, accounts} = useMsal();
  const activeAccount = accounts[0];

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      // Handle successful login
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  //log out
  const handleLogout = () => {
    instance.logout();
  };

  // // Does it work ??
  // React.useEffect(() => {
  //   if (activeAccount) {
  //     console.log('User Name:', activeAccount.name);
  //     console.log('Email:', activeAccount.username);
  //   }
  // }, [activeAccount]);

  return (
    <div className='App'>
      <AuthenticatedTemplate>
        {activeAccount ? (
          <div>
            <p>Logged in Account: </p>
            <p>User Name: {activeAccount.name}</p>
            <p>Email: {activeAccount.username}</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
      <button onClick={handleLogin}>
        Log In
      </button>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default PageAccess;
