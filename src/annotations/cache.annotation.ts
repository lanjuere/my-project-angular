import {Observable} from "rxjs";
// Define a function with one parameter: the key under which the data will be cached
export function CacheReturnValue(key: string) {
  // Return our high-order function
  let observers = {};

  return function(target, methodName, descriptor) {


    //TODO : Si c'est en cache, on renvoit le cache, si ce n'est pas en cache on fait l'appel et on récupère le promise pour le renvoyer ensuite.

    // Keep the method store in a local variable
    let originalMethod = descriptor.value;
  
    // Redefine the method value with our own 
    descriptor.value = function(...args) {
      let self = this;
      // Execute the method with its initial context and arguments
      // Return value is stored into a variable instead of being passed to the execution stack

      let result = JSON.parse(sessionStorage.getItem(key));
    
      function sequenceObserver(observer){
        if(!result){
          
          if(!observers[key]){
          console.log("oserver : ", observers[key]);
           observers[key] = <Observable<any>>originalMethod.apply(self, args);
          }
           observers[key].subscribe(function(res){
            observer.next(res);
            sessionStorage.setItem(key,JSON.stringify(res));
            observer.complete();
          }); 
          
          
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