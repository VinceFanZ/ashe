class Node {
  constructor(element) {
    this.element = element
    this.prev = null
    this.next = null
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  append(element) {
    const node = new Node(element)
    let current = null
    if (!this.head) {
      this.head = node
      this.tail = node
    } else {
      current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = node
      node.prev = current
      this.tail = node
    }
    this.length++
    return true
  }

  insert(position, element) {
    if (position >= 0 && position <= this.length) {
      const node = new Node(element)
      let current = this.head
      let previous = null
      let index = 0
      if (position === 0) {
        if (!this.head) {
          this.head = node
          this.tail = node
        } else {
          node.next = current
          this.head = node
          current.prev = node
        }
      } else if (position === this.length) {
        current = this.tail
        current.next = node
        node.prev = current
        this.tail = node
      } else {
        while (index++ < position) {
          previous = current
          current = current.next
        }
        node.next = current
        previous.next = node
        current.prev = node
        node.prev = previous
      }
      this.length++
      return true
    }
    return false
  }

}

const dublyLinkList = new DoublyLinkedList()

dublyLinkList.append(0)
dublyLinkList.append(1)
dublyLinkList.append(2)

console.log(dublyLinkList)
