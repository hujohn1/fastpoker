class Queue{
    constructor(){
        this.items = []
    }
    enqueue(el){
        this.items.push(el)
    }
    dequeue(){
        return this.items.shift()
    }
    peek(){
        return this.items[0]
    }
    isEmpty(){
        return this.items.length == 0
    }
}