
/**
 * Abstracts away working with Structures, resources etc
 */
class Shiny {

  constructor(object) {
    this.obj = object
  }

  amountOf(resource = null) {
    ///TODO These methods & names wont work, fix them
    if(obj instanceof Resource) {
      return obj.amount
    }
    else if(resource === RESOURCE_ENERGY && _.isDefined(obj.energy)) {
      return obj.amount
    }
    else if(obj.mineralAmount) {
      if(obj.type === resource) { return obj.mineralAmount }
      else { return 0 }
    }
    else {
      return _.get(obj, ['store', resource])
    }
  }

}

module.exports = Shiny
