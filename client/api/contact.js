import Api from './base';

export function email(data) {
  return Api.post('/email', data)
    .then(res => {
      if (res.ok) {
        return true;
      }

      if (res.status >= 400 && res.status < 500) {
        return {error: 'Insufficient data'};
      }

      return {error: 'There is a problem with the server'};
    });
}
