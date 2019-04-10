import {Observable} from "rxjs";
// Define a function with one parameter: the key under which the data will be cached
export function CacheReturnValue(key: string) {
  // Return our high-order function
  let observers = {};
  let exposedObersvers = {};
  let results = {};
  let TIMEOUT_KEY = "TIMEOUT_KEY";
  return function(target, methodName, descriptor) {

    // Keep the method store in a local variable
    let originalMethod = descriptor.value;
  
    // Redefine the method value with our own 
    descriptor.value = function(...args) {
      let self = this;
      // Execute the method with its initial context and arguments
      // Return value is stored into a variable instead of being passed to the execution stack

      let result = JSON.parse(sessionStorage.getItem(key)) ?  JSON.parse(sessionStorage.getItem(key)) : results[key];
      function sequenceObserver(observer){
        if(!result){
          
          if(!observers[key]){
            console.log("oserver : ", observers[key]);
            observers[key] = <Observable<any>>originalMethod.apply(self, args);

            observers[key].subscribe(function(res){
              
              results[key] = res;
              sessionStorage.setItem(key,JSON.stringify(res));
              exposedObersvers[key].forEach(function(obs){
                setTimeout(()=>{
                  obs.next(res); 
                  obs.complete();
                },JSON.parse(sessionStorage.getItem(TIMEOUT_KEY)) );
                          
              });
              
            }); 
          }
          if(!exposedObersvers[key]){
            exposedObersvers[key] = [];
          } 
          
          exposedObersvers[key].push(observer);
          observer.id = exposedObersvers[key].length;
        }else {
          observer.next(result);
          observer.complete();
        }
        return {unsubscribe() {}};
      }

    
      // Return back the value to the execution stack
      return new Observable(sequenceObserver);
    };

    // Return the descriptorwith the altered value
    return descriptor;
  };
};