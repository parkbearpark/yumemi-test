import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_RESAS_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_RESAS_API_KEY,
  },
})

