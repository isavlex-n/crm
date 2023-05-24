import { customEvents } from './app'
import { filters } from './utils/filters'
import clients from './api/clients'
export default class Model {
  constructor() {
    this.data = {
      persons: [],
      loaded: false,
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
    customEvents.notify('UpdatePersons')
    const persons = await clients.getClients()
    this.data.persons = persons
    this.loaded = false
    customEvents.notify('UpdatePersons')
  }

  get() {
    return this.data
  }

  add(person) {
    this.data.loaded = true
    customEvents.notify('UpdatePersons')
    clients
      .createClient(person)
      .then((data) => {
        this.data.persons.push(data)
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
      })
      .catch((e) => {
        console.log(e)
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
      })
  }

  change(personId, personData) {
    this.data.loaded = true
    customEvents.notify('UpdatePersons')
    clients
      .changeClient(personId, personData)
      .then((data) => {
        const person = this.data.persons.find(
          (person) => person.id === personId,
        )
        Object.assign(person, data)
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
      })
      .catch((e) => {
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
        console.log(e)
      })
  }

  delete(id) {
    this.data.loaded = true
    customEvents.notify('UpdatePersons')
    clients
      .deleteClient(id)
      .then(() => {
        this.data.persons = this.data.persons.filter(
          (person) => person.id !== id,
        )
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
      })
      .catch((e) => {
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
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

  search(request) {
    this.data.loaded = true
    customEvents.notify('UpdatePersons')
    clients
      .searchClients(request)
      .then((data) => {
        this.data.persons = data
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
      })
      .catch((e) => {
        this.data.loaded = false
        customEvents.notify('UpdatePersons')
        console.log(e)
      })
  }

  showOtherContacts(id) {
    const person = this.data.persons.find((person) => person.id === id)
    person.showContacts = true
    customEvents.notify('UpdatePersons')
  }

  modal(isActive, layout = null) {
    this.data.modal.isActive = isActive
    this.data.modal.layout = layout
    customEvents.notify('UpdateModal')
  }
}
