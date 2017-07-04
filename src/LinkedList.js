// 链表节点
class Node {
  constructor(element) {
    this.element = element
    this.next = null
  }
}

// 链表
class LinkedList {
  constructor() {
    this.head = null
    this.length = 0
  }

  append(element) {
    const node = new Node(element)
    let current = null
    if (!this.head) {
      this.head = node
    } else {
      current = this.head
      while(current.next) {
        current = current.next
      }
      current.next = node
    }
    this.length++
  }

  insert(position, element) {
    if (position >= 0 && position <= this.length) {
      const node = new Node(element)
      let current = this.head
      let previous = null
      let index = 0
      if (position === 0) {
        node.next = current
        this.head = node
      } else {
        while (index++ < position) {
          previous = current
          current = current.next
        }
        node.next = current
        previous.next = node
      }
      this.length++
      return true
    }
    return false
  }

  removeAt(position) {
    if (position >= 0 && position < this.length) {
      let current = this.head
      let previous = null
      let index = 0
      if (position === 0) {
        this.head = current.next
      } else {
        while (index++ < position) {
          previous = current
          current = current.next
        }
        previous.next = current.next
      }
      this.length--
      return true
    }
    return false
  }

  findIndex(element) {
    let current = this.head
    let index = -1
    while (current) {
      if (element === current.element) {
        return index + 1
      }
      index++
      current = current.next
    }
    return -1
  }

  remove(element) {
    const index = this.findIndex(element)
    return this.removeAt(index)
  }

  isEmpty() {
    return !this.length
  }

  size() {
    return this.length
  }
}

const linkedList = new LinkedList()

linkedList.append(2)
linkedList.append(3)
linkedList.insert(0, 1)
linkedList.insert(2, 4)

console.log(JSON.stringify(linkedList))

linkedList.removeAt(2)

console.log(JSON.stringify(linkedList))

console.log(linkedList.findIndex(2))

linkedList.append(4)
linkedList.remove(1)
console.log(JSON.stringify(linkedList))
