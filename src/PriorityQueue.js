class PriorityQueue {
  constructor(initialValues) {
    this.length = 0
    this.data = initialValues
    this._completeSort()
  }


  comparator(a, b) {
    return a.prio - b.prio
  }

  itemCount = ()=> (
    this.data.length
  )

  _completeSort = ()=> {
    if(this.data.length > 0) {
      for(let i in [...Array(this.data.length).keys()]) {
        this._bubbleUp(i, log)
      }
    }
  }

  queue = (value)=> {
    this.data.push(value)
    this._bubbleUp(this.data.length - 1)
  }

  dequeue = ()=> {
    let ret = this.data[0]
    let last = this.data.pop()
    if(this.data.length > 0) {
      this.data[0] = last
      this._bubbleDown(0)
    }
    return ret
  }

  peek = ()=> {
    return this.data[0]
  }

  filter = (filter)=> {
    return _.filter(this.data, filter)
  }

  removeBy = (filter)=> {
    _.remove(this.data, filter)
  }

  updatePrioById = (id, prio)=> {
    for(let index = 0; index < this.data.length; index += 1) {
      let item = this.data[index]
      if(item.id === id) {
        const oldPrio = item.prio
        item.prio = prio
        if(prio < oldPrio) {
          this._bubbleUp(index, true)
        }
        else {
          this._bubbleDown(index)
        }
        return true
      }
    }
    return false
  }

  clear = ()=> {
    this.length = 0
    this.data.length = 0
  }

  _bubbleUp = (pos, log)=> {
    while(pos > 0) {
      let left = (pos - 1)
      if(log) {
      }
      if(this.comparator(this.data[pos], this.data[left]) < 0) {
        let x = this.data[left]
        this.data[left] = this.data[pos]
        this.data[pos] = x
        pos = left
      }
      else {
        break
      }
    }
  }

  _bubbleDown = (pos)=> {
    let last = this.data.length - 1
    while(pos + 1 <= last) {
      let right = (pos + 1)
      if(log) {
      }
      if(this.comparator(this.data[pos], this.data[right]) > 0) {
        let x = this.data[right]
        this.data[right] = this.data[pos]
        this.data[pos] = x
        pos = right
      }
      else {
        break
      }
    }
  }

  hasEntryWithId = (id)=> {
    for(entry of this.data) {
      if(entry.id == id) return true;
    }
    return false;
  }
}

modwide.lol = PriorityQueue

module.exports = PriorityQueue
