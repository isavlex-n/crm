import Emitter from './Emitter'
import Presenter from './Presenter'
import 'normalize.css'
import './styles.css'

const customEvents = new Emitter()

const personsList = new Presenter()

document.body.append(personsList.getView().getHtml())

export { customEvents }
