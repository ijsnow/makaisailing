import Api from './base';

export function fetchAll() {
  return Api.get('/activities').then(res => {
    if (res.ok) return res.json();

    return res.status;
  });
}

export function edit(activity) {
  return Api.authPut('/admin/activity/edit', activity)
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

export function add(activity) {
  return Api.authPost('/admin/activity/new', activity)
    .then(res => {
      if (res.ok) {
        return true;
      }

      return {error: 'There is a problem with the server'};
    });
}

export function remove(id) {
  return Api.authDelete(`/admin/activity/${id}`)
    .then(res => {
      if (res.ok) {
        return true;
      }

      return {error: 'There is a problem with the server'};
    });
}
