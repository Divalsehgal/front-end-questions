class Todo {
    
    constructor() {
        this.list = [];
    }

    getList() {
        return this.list;
    }

    addList(list) {
        this.list = [...this.list, list]
    }

    deleteList(list) {
        this.list = this.list.filter((l) => {
            if (l !== list) {
                return l
            }
        })
    }

    updateList(list, newList) {
        this.list = this.list.map((l) => {
            if (l === list) {
                return newList
            } else {
                return l
            }
        })
    }

}

const li = new Todo()
li.addList("book")
li.addList("car")
li.addList("toy")
li.deleteList("book")
li.deleteList("toy")
li.updateList("car","bus")
console.log(li.getList())
