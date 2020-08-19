import { APIRequestHandler } from 'classes';

import config from 'config';

const { name: API_NAME, key: API_KEY } = config.amplify.API.endpoints[0];
const defaultHeaders = {
  'x-api-key': API_KEY,
};
const APIHandler = new APIRequestHandler(API_NAME, defaultHeaders);

// export async function getObjectsInRange(coordinates, range) {
//   const url = `/objects/inRange/${coordinates.lat}/${coordinates.lng}/${coordinates.alt}/${range}`;
//   return AdminAPIHandler.request('get', url);
// }

// export function putObject(obj) {
//   return AdminAPIHandler.request('put', '/object', { body: obj });
// }

export function getUserByName() { }
export function submitUser() { }


export function getTest() {
  const url = `/test`;
  return APIHandler.request('get', url);
}
