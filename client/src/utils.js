import React, { useState, useEffect } from 'react';

// display error message on page
const ErrorHandling = (errMsg) => {
  console.log(errMsg);
  const [showErr, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 5000);
  }, []);

  return (
    <div>
      {showErr && (
        <div className="error-message">
          <p>{errMsg}</p>
        </div>
      )}
    </div>
  );
}

// Helper function to return the response's result text if successful, otherwise
// returns the rejected Promise result with an error status and corresponding text
async function statusCheck(res) {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res;
}

export { ErrorHandling, statusCheck}