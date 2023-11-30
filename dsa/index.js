//DSA
// STACKS

/* const stack=[1,2,3,4,5];

//left to right
if you want to pop use pop() method
and you want to to do right to left use shift()
//console.log(stack.pop())

// console.log(stack.push(7),stack)



console.log(stack.unshift(),stack)


class Stack{

constructor(...items){
this.reverse=false;
this.stack=[...items]
}

push(...items){
if(this.reverse){
this.stack.unshift(...items);
}else{
this.stack.push(...items);
}
return this.stack

}

pop(){
if(this.reverse){
this.stack.shift();
}else{
this.stack.pop();
}
return this.stack
}


}

const r=new Stack(1,2,3,4,5)
r.reverse=true
console.log(r)
console.log(r.pop())
console.log(r.push(2))
 */

//QUEUE

/*  
 class Queue{
 constructor(...items){
 this.reverse=false;
 this.queue=[...items];
 }
 
  enqueue(...items){
  if(this.reverse){
  this.queue.push(...items)
  }else{
  this.queue.unshift(...items)
  }
  return this.queue;
  }
 
 dequeue(){
 if(this.reverse){
 this.queue.pop()
 }else{
 this.queue.shift()
 }
 return this.queue
 }
 
 }
 
 const q=new Queue(2,3,4,45,8,"hj",98);
 
 console.log(q.enqueue("fred"))
 
 
 console.log(q.dequeue()) */

// LINKED LISTS

// class Node {
//   constructor(value, next, prev) {
//     this.next = next;
//     this.value = value;
//     this.prev = prev;
//   }
// }

// class LinkedList {
//   constructor(head, tail) {
//     this.head = head;
//     this.tail = tail;
//   }

//   addToHead(value) {
//     const node = new Node(value, null, this.head);
//     if (this.head) {
//       this.head.next = node;
//     } else {
//       this.tail = node;
//     }
//     this.head = node;
//   }

//   addToTail() {}

//   removeHead() {}
//   removeTail() {}
//   search() {}

//   indexOf() {}
// }

// const l1 = new LinkedList(1, 2, 3, 4);

// console.log(l1);
