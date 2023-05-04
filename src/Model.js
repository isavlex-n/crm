import { customEvents } from './app'
import { filters } from './utils/filters'
import clients from './api/clients'

export default class Model {
  constructor() {
    this.data = {
      persons: [],
      loaded: true,
      sorted: {
        by: null,
        descending: false,
      },
      modal: {
        isActive: false,
        layout: null,
      },
    }
  }

  async loadClients() {
    this.loaded = true
    const persons = await clients.getClients()
    this.data.persons = persons
    this.loaded = false
    customEvents.notify('UpdatePersons')
  }

  get() {
    return this.data
  }

  add(person) {
    clients
      .createClient(person)
      .then(() => {
        this.data.persons.push(person)
        customEvents.notify('UpdatePersons')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  change(personId, personData) {
    clients
      .changeClient(personId, personData)
      .then(() => {
        const person = this.data.persons.find(
          (person) => person.id === personId,
        )
        Object.assign(person, personData)
        customEvents.notify('UpdatePersons')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  delete(id) {
    clients
      .deleteClient(id)
      .then(() => {
        this.data.persons = this.data.persons.filter(
          (person) => person.id !== id,
        )
        customEvents.notify('UpdatePersons')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  sort(filter) {
    if (this.data.sorted.by === filter && this.data.sorted.descending) {
      this.data.persons = this.data.persons.reverse()
      this.data.sorted = {
        by: filter,
        descending: false,
      }
    } else {
      this.data.persons = this.data.persons.sort(filters[filter])
      this.data.sorted = {
        by: filter,
        descending: true,
      }
    }
    customEvents.notify('UpdatePersons')
  }

  modal(isActive, layout = null) {
    this.data.modal.isActive = isActive
    this.data.modal.layout = layout
    customEvents.notify('UpdateModal')
  }
}
