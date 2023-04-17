class MinHeap{
    constructor(){
      this.h = [];
    }
  
    heappush(val, station){
      this.h.push([val, station]);
  
      var curr = this.h.length - 1;
  
      while (curr > 0){
        var parent = Math.floor((curr - 1) / 2);
  
        if (this.h[curr][DUR] < this.h[parent][DUR]){
          [this.h[curr], this.h[parent]] = [this.h[parent], this.h[curr]];
  
          curr = parent;
        }else{
          break;
        }
      }
    }
  
    heappop(){
      [this.h[0], this.h[this.h.length - 1]] = [this.h[this.h.length - 1], this.h[0]];
      var val;
      var station;
      [val, station] = this.h.pop();
      
  
      var index = 0;
  
      var leftIndex = 2 * index + 1;
      var rightIndex = 2 * index + 2;
  
      while (leftIndex < this.h.length){
        var minIndex = index;
  
        if (this.h[leftIndex][DUR] < this.h[minIndex][DUR]){
          minIndex = leftIndex;
        }
        
        if (rightIndex < this.h.length && this.h[rightIndex][DUR] < this.h[minIndex][DUR]){
          minIndex = rightIndex;
        }
  
        if (minIndex === index){
          break;
        }
  
        [this.h[index], this.h[minIndex]] = [this.h[minIndex], this.h[index]];
  
        index = minIndex;
        leftIndex = 2 * index + 1;
        rightIndex = 2 * index + 2;
      }
  
      return [val, station];
    }
  
    length(){
      return this.h.length;
    }
  }