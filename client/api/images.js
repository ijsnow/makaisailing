import Api from './base';

export function upload(data, callback) {
  return Api.upload('/admin/image', data, callback);
}

export function fetchAll(isForHomePage) {
  return Api.get('/images').then(res => {
    if (res.ok) return res.json();

    return res.status;
  });
}

export function edit(image) {
  return Api.authPut('/admin/image/edit', image)
    .then(res => {
      if (res.ok) {
        return true;
      }
      console.warn(res);
      if (res.status === 400) {
        return {error: 'Insufficient data'};
      }

      return {error: 'There is a problem with the server'};
    });
}

export function remove(id) {
  return Api.authDelete(`/admin/image/${id}`)
    .then(res => {
      if (res.ok) {
        return true;
      }

      return {error: 'There is a problem with the server'};
    });
}
