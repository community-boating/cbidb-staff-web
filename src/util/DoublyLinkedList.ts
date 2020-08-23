export class DoublyLinkedList<T> {
	left: T[]
	curr: T
	right: T[]
	constructor(left: T[], curr: T,  right: T[]) {
		this.left = left
		this.curr = curr
		this.right = right
	}
	static from<T>(es: T[]): DoublyLinkedList<T> {
		return new DoublyLinkedList([], es[0], es.slice(1))
	}
	next(): DoublyLinkedList<T> {
		if (this.right.length == 0) return this;
		else return new DoublyLinkedList(this.left.concat(this.curr), this.right[0], this.right.slice(1))
	}
	prev(): DoublyLinkedList<T> {
		if (this.left.length == 0) return this;
		else return new DoublyLinkedList(this.left.slice(0, this.left.length-1), this.left[this.left.length-1], [this.curr].concat(this.right))
	}
	hasNext(): boolean {
		return this.right.length > 0
	}
	hasPrev(): boolean {
		return this.left.length > 0
	}
	home(): DoublyLinkedList<T> {
		return new DoublyLinkedList([], this.left[0], this.left.slice(1).concat([this.curr]).concat(this.right))
	}
}