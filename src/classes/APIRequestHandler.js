import { API } from 'aws-amplify';

import config from 'config';

import { GnARlyAPILambdaJSONResponse } from 'zs-common/dist/classes';

import { getRandomInt } from 'utils';

import * as mocks from 'libs/api/mocks';

const mockMinTimeout = 100;
const mockMaxTimeout = 2000;
const mockErrorFrequency = 0.5;

const mockGETOptions = {
  headers: {},
  queryStringParameters: {},
};

const mockPOSTOptions = {
  body: {},
  headers: {},
};

const mockDELETEOptions = {
  headers: {},
};

class MockAPIRequestHandler {
  static getMockDataFromPath(method, path, body, error = false) {
    const fixedPath = path
      .split('/')
      .map((part) => part.capitalize())
      .join('');
    const mockName = `${method}${fixedPath}${error ? 'Error' : ''}`;
    const mockData = mocks[mockName](body);
    if (mockData === undefined) {
      throw new Error(`undefined mock ${mockName}`);
    }
    return mockData;
  }

  // standard request handler for MockAPIRequestHandler
  static request(apiName, method, path, options) {
    return new Promise((resolve, reject) => {
      console.log(
        `Testing mock ${method} request to ${apiName}:${path} with options ${JSON.stringify(options)}`,
      );
      const succeed = Math.random() > mockErrorFrequency;
      const to = getRandomInt(mockMinTimeout, mockMaxTimeout);

      setTimeout(() => {
        if (succeed) {
          const mockData = MockAPIRequestHandler.getMockDataFromPath(method, path, options.body);
          const response = JSON.parse(new GnARlyAPILambdaJSONResponse(mockData).body);
          resolve(response);
        } else {
          console.warn('Simulating error condition for request');
          const mockError = MockAPIRequestHandler.getMockDataFromPath(method, path, undefined, true);
          reject(mockError);
        }
      }, to);
    });
  }

  static get(apiName, path, options = mockGETOptions) {
    return MockAPIRequestHandler.request(apiName, 'get', path, options);
  }

  static post(apiName, path, options = mockPOSTOptions) {
    return MockAPIRequestHandler.request(apiName, 'post', path, options);
  }

  static put(apiName, path, options = mockPOSTOptions) {
    return MockAPIRequestHandler.request(apiName, 'put', path, options);
  }

  static delete(apiName, path, options = mockDELETEOptions) {
    return MockAPIRequestHandler.request(apiName, 'delete', path, options);
  }

  static head(apiName, path, options = mockDELETEOptions) {
    return MockAPIRequestHandler.request(apiName, 'head', path, options);
  }
}

export class APIRequestHandler {
  constructor(apiName, defaultHeaders = {}) {
    this.apiName = apiName;
    this.defaultOptions = {
      headers: defaultHeaders,
    };
    this.requestMaxRetries = 2;
  }

  request = (method, path, options) => {
    // switch handler based on offline
    const apiHandler = !config.environment.offline ? API : MockAPIRequestHandler;

    // merge options
    const requestOptions = { ...options, ...this.defaultOptions };

    // return the handler (promise)
    return apiHandler[method](this.apiName, path, requestOptions);
  };
}
