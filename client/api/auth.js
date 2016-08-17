import Api from './base';

export function login(username, password) {
  return Api.post('/auth/login', {username, password})
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      if (res.status === 404) {
        return {error: 'Wrong username or password'};
      }

      return {error: 'There is a problem with the server'};
    });
}

export function logout() {
  Api.storage.destroy('token');
  Api.authPost('/auth/logout');
  location.replace('/');
}

export function storeToken(token) {
  Api.storage.store('token', token);
  location.reload();
}

export function fetchToken() {
  return Api.storage.retrieve('token');
}
