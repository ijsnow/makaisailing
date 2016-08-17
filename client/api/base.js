import _ from 'lodash';
import Locker from '../utils/locker';

const storage = new Locker();

class ApiBase {
  constructor() {
    this.apiPrefix = '/api';

    this.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    this.storage = storage;

    // try {
    //   if (localStorage) {
    //     this.storage = localStorage;
    //   }
    // } catch (e) {
    //   let storage = {};
    //
    //   this.storage = {
    //     setItem: (key, value) => storage[key] = value,
    //     getItem: key => storage[key],
    //     clear: () => storage = {}
    //   };
    // }

  }

  get(path, queryParams) {
    let url = path;
    if (queryParams) {
      url = `${url}?${this.buildParams(queryParams)}`
    }

    return fetch(this.describeEndpoint(url), {method: 'GET'});
  }

  post(path, params = {}) {
    const config = _.assign({}, {
      method: 'POST',
      headers: new Headers(_.assign(this.headers, {})),
      body: this.buildParams(params)
    });

    return fetch(this.describeEndpoint(path), config);
  }

  authPost(path, params = {}) {
    const config = _.assign({}, {
      method: 'POST',
      headers: new Headers(_.assign(this.headers, {
        'Authorization': this.storage.retrieve('token'),
      })),
      body: this.buildParams(params)
    });

    return fetch(this.describeEndpoint(path), config);
  }

  authPut(path, params = {}) {
    const config = _.assign({}, {
      method: 'PUT',
      headers: new Headers(_.assign(this.headers, {
        'Authorization': this.storage.retrieve('token'),
      })),
      body: this.buildParams(params),
    });

    return fetch(this.describeEndpoint(path), config);
  }

  authDelete(path) {
    const config = _.assign({}, {
      method: 'DELETE',
      headers: new Headers(_.assign(this.headers, {
        'Authorization': this.storage.retrieve('token'),
      }))
    });

    return fetch(this.describeEndpoint(path), config);
  }

  upload(path, data, callback) {
    var form = new FormData();

    _.keys(data).forEach(key => {
      form.append(key, data[key]);
    });

    var request = new XMLHttpRequest();

    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {
        callback(request);
      }
    }

    request.open("POST", this.describeEndpoint(path));
    request.setRequestHeader('Authorization', this.storage.retrieve('token'));
    request.send(form);
  }

  describeEndpoint(path) {
    return `${this.apiPrefix}${path}`;
  }

  buildParams(params) {
    let data = '';

    _.forIn(params, function(value, key) {
      if (data === '') {
        data = `${key}=${params[key]}`;
      } else {
        data = `${data}&${key}=${params[key]}`;
      }
    });

    return data;
  }

  // https://github.com/form-data/form-data/blob/master/lib/form_data.js#L288
  generateFormBoundary() {
    let boundary = 'boundary=--------------------------';

    for (let i = 0; i < 24; i++) {
      boundary += Math.floor(Math.random() * 10).toString(16);
    }

    return boundary;
  }
}

export default new ApiBase();
