import axios from 'axios';


export class APIClient {
  constructor(baseURL = process.env.BASE_URL || 'https://api.exemplo.com') {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  async get(endpoint, params) {
    return axios.get(`${this.baseURL}${endpoint}`, {
      headers: this.headers,
      params,
    });
  }

  async post(endpoint, data) {
    return axios.post(`${this.baseURL}${endpoint}`, data, {
      headers: this.headers,
    });
  }

  async put(endpoint, data) {
    return axios.put(`${this.baseURL}${endpoint}`, data, {
      headers: this.headers,
    });
  }

  async delete(endpoint) {
    return axios.delete(`${this.baseURL}${endpoint}`, {
      headers: this.headers,
    });
  }

  async patch(endpoint, data) {
    return axios.patch(`${this.baseURL}${endpoint}`, data, {
      headers: this.headers,
    });
  }
}
