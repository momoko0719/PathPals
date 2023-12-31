import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './auth-config';

const PageAccess = () => {
  const { instance, accounts } = useMsal();
  const activeAccount = accounts[0];

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
      // Handle successful login
      await handleSaveUser();
      console.log()
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  //handle log out
  const handleLogout = () => {
    instance.logout();
  };

  const handleSaveUser = async () => {
    if (activeAccount) {
      try {
        // get name from authrized account
        const { name, username } = activeAccount;
        console.log('User information:', { name, username });
        // save the user info
        const saveInfo = { name, username };
        // send to server (post request)
        const res = await fetch('/users', {
          method: 'POST',
          body: JSON.stringify(saveInfo),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        // check for response
        if (res.ok) {
          console.log('sent to server')
        } else {
          console.log('error sending user info')
        }
      } catch (error) {
        console.error('error in saving user info', error)
      }
    }

  }
  // Does it work ?? and check for ten expiration
  React.useEffect(() => {
    const checkTokenExp = async () => {
      if (activeAccount) {
        // console.log('User Name:', activeAccount.name);
        // console.log('Email:', activeAccount.username);
        try {
          const authResult = await instance.acquireTokenSilent({
            scopes: ['user.read'],
            account: activeAccount
          });
          // check if the token has expired
          if (authResult.expiresOn < new Date()) {
            console.log('expired token, please log in again')
            handleLogout();
          }
        } catch (error) {
          console.error('error during token chec', error)
        }
      }
    }
    checkTokenExp();
  }, [instance, activeAccount]);

  return (
    <>
      <AuthenticatedTemplate>
        {activeAccount ? (
          //   <p>Logged in Account: </p>
          //   <p>User Name: {activeAccount.name}</p>
          //   <p>Email: {activeAccount.username}</p>
          <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button className="btn btn-danger" onClick={handleLogin}>
          Log In
        </button>
      </UnauthenticatedTemplate>
    </>
  );
};

export default PageAccess;
