import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import axiosInstance from './axiosConfig';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequest {
  url: string;
  method: HttpMethod;
  data?: any;
  config?: AxiosRequestConfig;
}

const fetchData = async ({ url, method, data, config }: ApiRequest) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};

export default fetchData;