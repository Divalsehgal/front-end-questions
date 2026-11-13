/**
 * 19. LRU Cache
 * https://leetcode.com/problems/lru-cache/
 *
 * Design a Least Recently Used cache with a fixed capacity.
 * get(key): return the value, or -1 if missing. Counts as a use.
 * put(key, value): insert or update. If over capacity, evict the least recently used key.
 * Both must run in O(1).
 *
 * Examples
 *   capacity 2
 *   put(1,1), put(2,2)
 *   get(1)     -> 1
 *   put(3,3)   evicts key 2
 *   get(2)     -> -1
 *   put(4,4)   evicts key 1
 *   get(1)     -> -1
 *   get(3)     -> 3
 *   get(4)     -> 4
 *
 * Target complexity: get and put O(1) time, Space O(capacity)
 */
import { check } from '../helpers.js';

class LRUCache {
  constructor(capacity) {
    // your solution
    this.capacity=capacity
    this.map=new Map()
  }

  get(key) {
    if(this.map.has(key)){
      const value=this.map.get(key)
      this.map.delete(key);
        this.map.set(key, value);
      return value
      
    }else{
      return -1
    }
  }

  put(key, value) {
    if(!(this.map.has(key))){

      if(this.capacity===this.map.size){
        for(const i of this.map){
          this.map.delete(i[0])
          break;
        
        }
      }
        
    }else{
      this.map.delete(key)
    }

    this.map.set(key,value)
  }
}

const c = new LRUCache(2);
c.put(1, 1);
c.put(2, 2);
check('get(1)', c.get(1), 1);
c.put(3, 3);
check('get(2) evicted', c.get(2), -1);
c.put(4, 4);
check('get(1) evicted', c.get(1), -1);
check('get(3)', c.get(3), 3);
check('get(4)', c.get(4), 4);
c.put(4, 40);
check('update existing', c.get(4), 40);
