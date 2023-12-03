/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const express = require('express');
const graphMEFetch = require('../fetch.js');
const { GRAPH_ME_ENDPOINT } = require('../authConfig.js');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
};

router.get('/id',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
    try {
      const { idTokenClaims } = req.session.account;
      const html = `
                <html>
                    <head><title>Testing Azure</title></head>
                    <body>
                        <h1>ID Token Claims</h1>
                        <table>
                            <tbody>
                                ${Object.entries(idTokenClaims).map(([key, value]) => `<tr><th>${key}</th><td>${value}</td></tr>`).join('')}
                            </tbody>
                        </table>
                        </table>
                    </body>
                </html>
            `;
      res.type('html');
      res.send(html);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/profile',
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
    try {
      const graphResponse = await graphMEFetch(GRAPH_ME_ENDPOINT, req.session.accessToken);
      const html = `
                <html>
                    <head><title>Testing Azure</title></head>
                    <body>
                        <h1>Your profile</h1>
                        <pre>
${JSON.stringify(graphResponse, null, 2)}
                        </pre>
                        </table>
                    </body>
                </html>
            `;

      res.type('html');
      res.send(html);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;