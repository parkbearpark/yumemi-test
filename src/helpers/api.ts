import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_RESAS_API_BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.REACT_APP_RESAS_API_KEY,
  },
})

export const getPrefectures = async () => {
  if (process.env.NODE_ENV === 'test') {
  } else {
    const res = await api.get('/prefectures')
    return res.data.result
  }
}

export const getPopulation = async (prefCode: number) => {
  if (process.env.NODE_ENV === 'test') {
  } else {
    const res = await api.get(
      `/population/composition/perYear?prefCode=${prefCode}&cityCode=-`
    )
    return res.data.result.data
  }
}
