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
    data['id'] = id // Makes it easier for other things to process the items
    this.data[id] = data
    return id
  },

  remove: function(id) {
    delete this.data[id]
  },

  allForRoom: function(room, opts = {}) {
    const filter = opts.filter || (()=> true)
    const roomName = (typeof room === 'string') ? room : room.name
    return _.filter(
      this.data, (entry)=> (
        (
          (entry.fromSource && entry.fromSource.roomName == roomName) ||
          (entry.toTarget && entry.toTarget.roomName == roomName) ||
          (entry.byRoomName == roomName) ||
          (entry.roomName == roomName)
        ) && filter()
      )
    )
  },

  filter: function(filter) {
    return _.filter(this.data, filter)
  },

  _generateId: function() {
    let index = (Memory['hiveMindIndex'] || 1) + 1
    Memory['hiveMindIndex'] = index
    return index
  },
}

module.exports = hiveMind
