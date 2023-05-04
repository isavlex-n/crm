export default class Emitter {
  constructor() {
    this.observers = {}
  }

  makeSubscribe(eventName, fn) {
    this.observers[eventName] = this.observers[eventName] || []
    this.observers[eventName].push(fn)
    return () => {
      this.observers[eventName] = this.observers[eventName].filter(
        (observer) => observer !== fn,
      )
    }
  }

  notify(eventName) {
    if (!Array.isArray(this.observers[eventName])) {
      return false
    }

    this.observers[eventName].forEach((observer) => {
      observer()
    })
    return true
  }
}
