import request from 'utils/request';

const API_URL =
  process.env.REACT_APP_STAGE === 'prod'
    ? 'https://api.gotdp.aws.zstz.net/v1'
    : 'https://api.dev.gotdp.aws.zstz.net/v1';

export const USER = 'user';

export function getUserByName(name) {
  return new Promise((resolve) => {
    request(`${API_URL}/${USER}/${name}`, {
      method: 'GET',
    })
      .then((res) => {
        resolve({
          user: res,
          error: null,
        });
      })
      .catch((e) => {
        resolve({
          user: null,
          error: e,
        });
      });
  });
}

export function submitUser(data) {
  return new Promise((resolve) => {
    request(`${API_URL}/${USER}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then((res) =>
        resolve({
          user: res,
          error: null,
        }),
      )
      .catch((e) =>
        resolve({
          error: e,
          user: null,
        }),
      );
  });
}
