import hiveMind from './../hiveMind'

Creep.prototype.activeItem = function() {
  if(!this.memory.item || !this.memory.item.id) { return null }
  return hiveMind[this.memory.item.id]
}

Creep.prototype.hasItem = function() {
  return this.memory.item && this.memory.item.id
}

Creep.prototype.itemMatches = function(filter) {
  if(!this.hasItem()) { console.log('Item does not exist'); return false }
  return _.matches(filter)(this.activeItem())
}
