const filters = {
  alphabet: function sortByAlphabet(a, b) {
    const nameA = (a.lastName + a.name + a.surname).toLowerCase()
    const nameB = (b.lastName + b.name + b.surname).toLowerCase()
    if (nameA < nameB) return -1 // по возрастанию
    if (nameA > nameB) return 1
    return 0
  },

  id: function sortById(a, b) {
    const idA = +a.id
    const idB = +b.id
    return idA - idB
  },

  created: function sortByCreated(a, b) {
    const createdA = new Date(a.createdAt)
    const createdB = new Date(b.createdAt)
    return createdA - createdB
  },

  change: function sortByChange(a, b) {
    const changeA = new Date(a.updatedAt)
    const changeB = new Date(b.updatedAt)
    return changeA - changeB
  }
}

export { filters }
