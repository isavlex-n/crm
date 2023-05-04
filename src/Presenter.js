import Model from './Model'
import View from './View'
import { customEvents } from './app'

export default class Presenter {
  constructor() {
    this.view = null
    this.model = null
    this.init()
  }

  init() {
    this.model = new Model()
    this.model.loadClients()
    this.view = new View(this.model.get())

    this.view.sortPersonsHandler((filter) => {
      this.model.sort(filter)
    })

    this.view.deletePersonHandler((id) => {
      this.model.delete(id)
      this.model.modal(false)
    })

    this.view.toggleModalHandler((isActive, layout) => {
      this.model.modal(isActive, layout)
    })

    this.view.addPersonHandler((person) => {
      this.model.add(person)
      this.model.modal(false)
    })

    this.view.changePersonHandler((personId, personData) => {
      this.model.change(personId, personData)
      this.model.modal(false)
    })

    customEvents.makeSubscribe('UpdateModal', () => {
      this.view.updateModal(this.model.get())
    })

    customEvents.makeSubscribe('UpdatePersons', () => {
      this.view.updateView(this.model.get())
    })
  }

  getView() {
    return this.view
  }
}
