angular.module('math',[])
  .value('add',function(lhs, rhs){ return lhs + rhs; })
  .value('subtract',function(lhs, rhs){ return lhs - rhs; })
  .value('sum',function(){throw new Error('sum not implemented')})
  .factory('total',function(sum){
    //total is an alias for sum
    return sum;
  });