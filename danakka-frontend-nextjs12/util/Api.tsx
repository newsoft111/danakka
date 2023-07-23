import axios from 'axios';

const api = axios.create({
  baseURL: 'http://newsoft.kr:8500',
  headers: {
    'Content-Type': 'application/json'
  }
});

function chk_null (val:any) {
    if (val === null) return true;
    if (typeof val === 'string' && val === '') return true;
    if (typeof val === 'undefined') return true;
    return false;
}


export async function getData<T>(url: string, params: any): Promise<T | undefined> {
  
  try {
    const removeEmptyParams = (obj: any) => {
      const newObj: any = {};
      Object.keys(obj).forEach((key) => {
        if (obj[key] !== "") {
          newObj[key] = obj[key];
        }
      });

      return newObj;
    };

    const filteredParams = removeEmptyParams(params);
    const queryString = new URLSearchParams(filteredParams).toString();

    const response = await api.get(`${url}?${queryString}`);
    if (!response.data.error) {
      return response.data;
    }
    
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function postData<T>(url: string, params: any): Promise<T | undefined> {
  try {
    const response = await api.post(url, params);
    if (!response.data.error) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
