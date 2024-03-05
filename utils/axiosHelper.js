const axios = require('axios');

const axiosHelper = {
  get: async (url) => {
    let data = null
    try {
      const response = await axios.get(url);
      data = response?.data;
    } catch(error) {
      data = null;
    }

    return data;
  },

  post: async (url, apiData) => {
    let data = null;
    try {
      const response = await axios.post(url, apiData);
      data = response?.data;
    } catch(error) {
      data = null;
    }

    return data;
  }
}

module.exports = axiosHelper;
