// Singleton storing the queue-data
const hiveMind = {
  init: function() {
    this.data = Memory['hiveMind'] || {}
  },

  save: function() {
    Memory['hiveMind'] = this.data
  },

  push: function(data) {
    let id = this._generateId()
    this.data[id] = data
    return id
  },

  remove: function(id) {
    this.data[id] = undefined
  },

  allForRoom: function(room) {
    return _.filter(this.data, (entry)=> entry.fromSource.roomName == room.name)
  },

  _generateId: function() {
    let index = (Memory['hiveMindIndex'] || 1) + 1
    Memory['hiveMindIndex'] = index
    return index
  },
}

module.exports = hiveMind
