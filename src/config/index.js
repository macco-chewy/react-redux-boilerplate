export default {
  amplify: {
    Auth: {
      region: process.env.REACT_APP_COGNITO_REGION,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [
        {
          name: 'api',
          endpoint: process.env.REACT_APP_APIGATEWAY_ENDPOINT,
          key: process.env.REACT_APP_APIGATEWAY_KEY,
          region: 'us-west-2',
        },
      ],
    },
  },
  environment: {
    offline: (
      process.env.REACT_APP_OFFLINE.toLowerCase() === 'true'
      || process.env.REACT_APP_OFFLINE.toLowerCase() === '1'
    )
  }
};
