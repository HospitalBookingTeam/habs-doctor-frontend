import axios from 'axios'
import { KEYS } from './constants'

const apiHelper = axios.create({
	baseURL: KEYS.URLS.BASE_API,
	timeout: 10000,
})

// Add a request interceptor
axios.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem('token')

		if (token && config?.headers) {
			config.headers['Authorization'] = `Bearer ${token}`
		}

		return config
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error)
	}
)

// Add a response interceptor
axios.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		//TODO: handle 401 error
		return Promise.reject(error)
	}
)

export default apiHelper
