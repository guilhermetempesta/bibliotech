import axios from 'axios'

axios.interceptors.response.use(
  res => res, 
  err => {
    if (err.response.status === 401 && 
        (err.response.data.name === 'TokenExpiredError' || 
         err.response.data.name === 'JsonWebTokenError')) {
      window.location = '/'
    } else { 
      return Promise.reject(err)
    }
  }
);