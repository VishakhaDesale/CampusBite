import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css'; // For newer Ant Design versions
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import axios from 'axios';

// window.APIROOT = '/';
// window.APIROOT = 'http://localhost:4000/';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <BrowserRouter>
//         <React.StrictMode>
//             <App />
//         </React.StrictMode>
//     </BrowserRouter>
// );


// Environment-based configuration
window.APIROOT = 'http://localhost:4000/';

const API_ROOT = process.env.REACT_APP_API_ROOT || 'http://localhost:4000/';

// Create axios instance once here and make it global if needed
window.api = axios.create({
  baseURL: API_ROOT,
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Content-Type': 'application/json'
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);