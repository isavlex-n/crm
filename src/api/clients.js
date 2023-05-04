import axios from 'axios'

class Clients {
  constructor() {
    this.url = 'http://localhost:3000/api/clients'
  }

  async getClients() {
    const res = await axios.get(this.url)
    return res.data
  }

  async getClient(id) {
    const res = await axios.get(`${this.url}/${id}`)
    return res.data
  }

  async changeClient(id, data) {
    const res = await axios.patch(`${this.url}/${id}`, data)
  }

  async deleteClient(id) {
    const res = await axios.delete(`${this.url}/${id}`)
  }

  async createClient(client) {
    try {
      const res = await axios.post(this.url, client)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default new Clients()
