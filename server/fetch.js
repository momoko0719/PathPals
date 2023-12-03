/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * Attaches a given access token to a MS Graph API call
 * @param endpoint: REST API endpoint to call
 * @param accessToken: raw access token string
 */
async function fetchMEGraph(endpoint, accessToken) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  console.log(`request made to ${endpoint} at: ` + new Date().toString());

  try {
    const response = await fetch(endpoint, options);
    return response.json();
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = fetchMEGraph;