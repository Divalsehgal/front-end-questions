function PriorityQueue() {
  this.collection = [
    ["kitten", 2],
    ["dog", 3],
    ["rabbit", 4],
  ];
  this.printCollection = function () {
    console.log(this.collection);
  };
  this.enqueue = function (item) {
    let index = this.collection.findIndex((elem) => elem[1] > item[1]);
    if (index !== -1) {
      this.collection.splice(index, 0, item);
    } else {
      this.collection.push(item);
    }
  };

  this.dequeue = function () {
    return this.collection.shift()[0];
  };

  this.size = function () {
    return this.collection.length;
  };

  this.front = function () {
    return this.collection[0][0];
  };

  this.isEmpty = function () {
    return this.collection.length === 0 ;
  };

}

const temp = new PriorityQueue();
temp.enqueue(["bjk", 2]);

temp.printCollection();
