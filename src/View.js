import Modal from './Modal'

export default class View {
  constructor(data) {
    this.data = data
    this.html = document.createElement('main')
    this.modal = new Modal(data.modal)
    this.newContactCounter = 0
    this.contactsOptions = {
      phone: 'Телефон',
      mail: 'Email',
      vk: 'Vk',
      fb: 'Facebook',
      extraPhone: 'Доп. телефон',
    }
    this.init(data)
  }

  init(initialData) {
    this.html.insertAdjacentHTML(
      'beforeend',
      `
      ${this.getSearch()}
      <section class="persons">
        <h1>Клиенты</h1>
        <div class="persons__item persons__filters">
        ${this.getFilters()}
        </div>
        <ul class="persons__list"></ul>
        <div class="text-center">
          <button class="persons__button persons__button_add-client" data-type="addModal"><span data-type="addModal">Добавить клиента</span></button>
        </div>
      </section>
  `,
    )
    this.html.append(this.modal.getHtml())
    this.updateView(initialData)
  }

  updateView(data) {
    const filters = this.html.querySelector('.persons__filters')
    filters.replaceChildren('')
    filters.insertAdjacentHTML('beforeend', this.getFilters())
    let items = document.createDocumentFragment()
    data.persons.map((person) => {
      items.append(this.getItem(person))
    })
    if (items && !this.data.loaded) {
      this.html.querySelector('.persons__list').replaceChildren(items)
    } else {
      this.html
        .querySelector('.persons__list')
        .replaceChildren(this.getLoader())
    }
  }

  updateModal(data) {
    this.modal.updateView(data.modal)
  }

  getLoader() {
    let loader = document.createElement('div')
    loader.classList.add('lds-ring')
    loader.insertAdjacentHTML(
      'beforeend',
      '</div><div></div><div></div><div></div><div></div>',
    )
    return loader
  }

  getSearch() {
    return `
      <div class="search">
        <a href="/" class="search__link">
        </a>
        <input placeholder="Введите запрос" class="search__input" />
      </div>
    `
  }

  getItem({ id, name, lastName, surname, createdAt, updatedAt, contacts, showContacts }) {
    const li = document.createElement('li')
    const created = new Date(createdAt)
    const updated = new Date(updatedAt)
    let otherContacts = 0
    li.classList.add('persons__item')
    li.insertAdjacentHTML(
      'beforeend',
      `
        <div class="persons__id">${id}</div>
        <div class="persons__name">${lastName} ${name} ${surname}</div>
        <div class="persons__created"><span>${created.toLocaleDateString()}</span> <span class="gray-text">${created.getHours()}:${created.getMinutes()}</span></div>
        <div class="persons__last-change"><span>${updated.toLocaleDateString()}</span> <span class="gray-text">${updated.getHours()}:${updated.getMinutes()}</span></div>
        <div class="persons__social">${
          contacts &&
          contacts
            .map((el, index) => {
              let prefix = ''
              let target = '_blank'
              if (el.type === 'phone' || el.type === 'extraPhone') {
                prefix = 'tel:'
                target = '_self'
              }
              if (el.type === 'mail') {
                prefix = 'mailto:'
                target = '_self'
              }
              if (index > 3 && !showContacts) {
                otherContacts++
                return
              }
              return `
                <a href="${prefix}${el.value}" class="icon ${el.type}" target="${target}" title="${el.type}">
                  <span>${el.value}</span>
                </a>&nbsp;
                `
            })
            .join('')
        }${
        otherContacts
          ? `<span class="icon persons__other" data-id="${id}">+${otherContacts}</span>`
          : ''
      }</div>
        <div class="persons__actions">
          <a href="#" data-id="${id}" data-type="change" class="link change">Изменить</a>
          <a href="#" data-id="${id}" data-type="delete" class="link delete">Удалить</a>
        </div>
      `,
    )
    return li
  }

  getFilters() {
    const descending = this.data.sorted.descending ? ' persons__descending' : ''
    return `
    
      <div class="persons__filter ${
        this.data.sorted.by === 'id' ? 'persons__filtered' + descending : ''
      }" data-filter="id"><span data-filter="id">ID</span></div>
      <div class="persons__filter ${
        this.data.sorted.by === 'alphabet'
          ? 'persons__filtered' + descending
          : ''
      }" data-filter="alphabet"><span data-filter="alphabet">Фамилия Имя Отчество</span><span class="firm" data-filter="alphabet">А-Я</span></div>
      <div class="persons__filter ${
        this.data.sorted.by === 'created'
          ? 'persons__filtered' + descending
          : ''
      }" data-filter="created"><span data-filter="created">Дата и время создания</span></div>
      <div class="persons__filter ${
        this.data.sorted.by === 'change' ? 'persons__filtered' + descending : ''
      }" data-filter="change"><span data-filter="change">Последние изменения</span></div>
      <div><span>Контакты</span></div>
      <div><span>Действия</span></div>
    
    `
  }

  getContactLayout(contact, index) {
    const option = contact
      ? Object.keys(this.contactsOptions)
          .map((key) => {
            if (contact.type !== key) {
              return `
          <div class="persons__option" data-option="${key}">${this.contactsOptions[key]}</div>      
        `
            }
          })
          .join('')
      : `
          <div class="persons__option" data-option="vk">Vk</div>
          <div class="persons__option" data-option="mail">Email</div>
          <div class="persons__option" data-option="fb">Facebook</div>
          <div class="persons__option" data-option="extraPhone">Доп. телефон</div> 
        `

    return `
      <div class="persons__contact">
        <div class="persons__dropdown">
          <div class="persons__selection">
            <span class="persons__selected" data-option="${
              contact ? contact.type : 'phone'
            }">${
      contact ? this.contactsOptions[contact.type] : 'Телефон'
    }</span>
            <button class="persons__toggle" data-type="toggle"></button>
            <div class="persons__options">
              ${option}
            </div>
          </div>
        </div>
        <input type="text" name="contact-${
          contact?.type || 'phone'
        }-${Math.floor(
      Math.random() * 1000,
    )}" placeholder="Введите данные контакта" class="" value="${
      contact ? contact.value : ''
    }"/>
        <div class="persons__del" data-type="delContact" ${
          index ? `data-index="${index}"` : ''
        }></div>
      </div>
    `
  }

  getPersonLayout(id) {
    const person = id
      ? this.data.persons.find((person) => person.id === id)
      : null
    return `
      <form class="persons__addition">
        
        <div class="persons__wrap">
          ${id ? `<header><h2>Изменить данные</h2><span>ID:${id}</span></header>` : ''}
          <label class="persons__label persons__label_requried">
            <span>Фамилия</span>
            <input type="text" name="lastName" class="persons__input" data-type="lastName" value="${
              person?.lastName ?? ''
            }"/>
          </label>
          <label class="persons__label persons__label_requried">
            <span>Имя</span>
            <input type="text" name="name" class="persons__input" data-type="name" value="${
              person?.name ?? ''
            }" />
          </label>
          <label class="persons__label">
            <span>Отчество</span>
            <input type="text" name="surname" class="persons__input" data-type="surname" value="${
              person?.surname ?? ''
            }" />
          </label>
        </div>
        
        <div class="persons__contacts">
          ${
            person
              ? person.contacts
                  .map((contact, index) =>
                    this.getContactLayout(contact, index),
                  )
                  .join('')
              : ''
          }
          <button class="persons__button persons__button_add-contact" data-type="addContact"><span data-type="addContact">Добавить контакт</span></button>
        </div>
        <div class="error">
          ${this.data.error ? this.data.error : ''}
        </div>
        <div class="persons__wrap text-center">
          ${
            person
              ? `<button class="persons__button persons__button_add" data-type="changePerson" data-id="${id}" type="submit">Сохранить</button>`
              : '<button class="persons__button persons__button_add" data-type="addPerson" type="submit">Сохранить</button>'
          }
        </div>
      </form>
    `
  }

  getDeletePersonLayout(id) {
    return `
      <div class="persons__wrap persons__delete-client">
        <h2>Удалить клиента</h2>
        <p>Вы действительно хотите удалить данного клиента?</p>
        <button class="persons__button" data-id="${id}" data-type="delClient">Удалить</button>
        <button class="like-link" data-type="cancelModal">Отмена</button>
      </div>
    `
  }

  getHtml() {
    return this.html
  }

  addPersonHandler(handler) {
    this.html
      .querySelector('.modal__content')
      .addEventListener('click', (event) => {
        event.preventDefault()
        const dataset = event.target.dataset
        const personForm = this.html.querySelector('.persons__addition')
        const personData = {
          contacts: [],
        }
        if (event.target.classList.contains('persons__option')) {
          const input = event.target
            .closest('.persons__contact')
            .querySelector('input')
          const selected = event.target
            .closest('.persons__selection')
            .querySelector('.persons__selected')
          const prevSelectedText = selected.textContent
          const prevSelectedOption = selected.dataset.option
          selected.textContent = event.target.textContent
          selected.dataset.option = event.target.dataset.option
          input.name = 'contact' + '-' + event.target.dataset.option
          event.target.textContent = prevSelectedText
          event.target.dataset.option = prevSelectedOption
        }
        if (dataset.type === 'addContact' && this.newContactCounter < 10) {
          const contacts = this.html.querySelector('.persons__contacts')
          contacts.insertAdjacentHTML('afterbegin', this.getContactLayout())
          this.newContactCounter++
        }
        if (dataset.type === 'delContact') {
          const contactEl = event.target.closest('.persons__contact').remove()
        }
        if (dataset.type === 'addPerson' && personForm) {
          const formData = new FormData(personForm)
          for (let [key, value] of formData.entries()) {
            const splitKey = key.split('-')[0]
            if (splitKey === 'contact') {
              personData.contacts.push({
                type: key.split('-')[1],
                value,
              })
            } else {
              personData[splitKey] = value
            }
          }
          handler({
            ...personData,
          })
        }
      })
  }

  changePersonHandler(handler) {
    this.html
      .querySelector('.modal__content')
      .addEventListener('click', (event) => {
        event.preventDefault()
        const personForm = this.html.querySelector('.persons__addition')
        if (event.target.dataset.type === 'changePerson' && personForm) {
          const personData = {
            updatedAt: new Date(),
            contacts: [],
          }
          const formData = new FormData(personForm)
          for (let [key, value] of formData.entries()) {
            if (key.includes('contact')) {
              const contact = {
                type: key.split('-')[1],
                value,
              }
              personData.contacts.push(contact)
            } else {
              personData[key] = value
            }
          }
          handler(event.target.dataset.id, {
            ...personData,
          })
        }
      })
  }

  toggleModalHandler(handler) {
    this.html.querySelector('.persons').addEventListener('click', (event) => {
      const dataset = event.target.dataset
      if (dataset.type === 'addModal') {
        handler(true, this.getPersonLayout())
      }
      if (dataset.type === 'delete') {
        handler(true, this.getDeletePersonLayout(dataset.id))
      }
    })
    this.html
      .querySelector('.persons__list')
      .addEventListener('click', (event) => {
        const dataset = event.target.dataset
        if (dataset.type === 'change') {
          handler(true, this.getPersonLayout(dataset.id))
        }
      })
    this.html
      .querySelector('.modal__content')
      .addEventListener('click', (event) => {
        event.stopPropagation()
        if (event.target.dataset.type === 'cancelModal') {
          handler(false)
        }
      })
    this.html.querySelector('.modal').addEventListener('click', () => {
      handler(false)
    })
  }

  deletePersonHandler(handler) {
    this.html
      .querySelector('.modal__content')
      .addEventListener('click', (event) => {
        if (event.target.dataset.type === 'delClient') {
          handler(event.target.dataset.id)
        }
      })
  }

  sortPersonsHandler(handler) {
    this.html
      .querySelector('.persons__filters')
      .addEventListener('click', (event) => {
        const filter = event.target.dataset.filter
        handler(filter)
      })
  }

  searchPersonsHandler(handler) {
    this.html
      .querySelector('.search__input')
      .addEventListener('input', (event) => {
        handler(event.target.value)
      })
  }

  showContactsHandler(handler) {
    this.html
      .querySelector('.persons__list')
      .addEventListener('click', (event) => {
        if (event.target.classList.contains('persons__other')) {
          const id = event.target.dataset.id
          handler(id)
        }
      })
  }
}
