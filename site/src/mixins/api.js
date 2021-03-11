// eslint-disable no-console
const api = {
  data() {
    return {
      apiConfig: {
        baseUrl: 'http://localhost:3000/'
      },
    }
  },
  methods: {
    async api(data) {
      if (
        data.hasOwnProperty('path') &&
        data.hasOwnProperty('method') &&
        data.hasOwnProperty('body')
      ) {
        let options = {
          method: data.method 
        }

        if (data.body) {
          options.body = JSON.stringify(data.body)
        }

        const apiResponse = await fetch(this.apiConfig.baseUrl + data.path, options)

        try {

          const jsonApiResponse = await apiResponse.json()
          
          return jsonApiResponse
        } catch (err) {
          return {
            error: err
          }
        }
      } else {
        return null
      }
    },
  },
}

export default api
