import axios from 'axios';

const api = axios.create({
  baseURL: 'http://newsoft.kr:8500',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function getData<T>(url: string, data: any): Promise<T | undefined> {
  try {
    const response = await api.get(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function postData<T>(url: string, data: any): Promise<T | undefined> {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
