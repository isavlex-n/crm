export default class Modal {
  constructor(data) {
    this.html = document.createElement('div')
    this.data = data
    this.init(data)
  }

  init(initialData) {
    if (this.data.loaded) return
    this.html.classList.add('modal')
    this.html.insertAdjacentHTML(
      'beforeend',
      `
      <div class="modal__content">
        ${initialData.layout}
      </div>
      `,
    )
    this.updateView(initialData)
  }

  updateView(data) {
    const modalRoot = document.querySelector('.modal')
    const modalContent = document.querySelector('.modal__content')
    if (data?.isActive && modalRoot && modalContent) {
      modalRoot.classList.add('active')
      modalContent.classList.add('active')
      modalContent.replaceChildren('')
      modalContent.insertAdjacentHTML('beforeend', `<div class="modal__cancel" data-type="cancelModal"></div>${data?.layout}`)
    } else if (modalRoot && modalContent) {
      modalRoot.classList.remove('active')
      modalContent.classList.remove('active')
    }
  }

  getHtml() {
    return this.html
  }

  hideModalHandler(handler) {
    this.html.querySelector('modal').addEventListener('click', () => {
      handler(false)
    })
  }
}
