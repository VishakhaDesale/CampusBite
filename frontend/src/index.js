import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css'; // For newer Ant Design versions
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import axios from 'axios';


window.APIROOT = 'http://localhost:4000/';

// // Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:4000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor
api.interceptors.request.use(config => {
  config.headers['Cache-Control'] = 'no-cache';
  config.headers['Pragma'] = 'no-cache';
  return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

export default api;
