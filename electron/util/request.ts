const { net } = require('electron');

const sendRequest = (options, postBody = null) => {
  return new Promise((resolve, reject) => {
    const request = net.request(options);

    request.on('response', (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      });

      response.on('end', () => {
        try {
          const data = JSON.parse(responseData);
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP error! Status: ${response.statusCode}, Message: ${response.statusMessage}`));
          }
        } catch (error) {
          reject(new Error('Failed to parse response data: ' + error.message));
        }
      });
    });

    request.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    if (postBody) {
      request.write(JSON.stringify(postBody));
    }

    request.end();
  });
};
const pushMessage = async (event, { message, url, token }) => {
  const requestUrl = `http://127.0.0.1:5173${url}/message?token=${token}`;
  const options = {
    method: 'POST',
    url: requestUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const data = await sendRequest(options, { message });
    return data;
  } catch (error) {
    console.error('Failed to push message:', error);
    throw error;
  }
};

const checkHealth = async (event, url) => {
  const requestUrl = url !== '' ? `${url}/health` : '/api/health';
  const options = {
    method: 'GET',
    url: requestUrl,
  };

  try {
    const data = await sendRequest(options);
    if (data.health === 'green' && data.database === 'green') {
      console.log(data);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Failed to check server health:', error);
    return false;
  }
};

module.exports = { pushMessage ,checkHealth};
