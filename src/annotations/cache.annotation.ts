import {Observable} from "rxjs";
// Define a function with one parameter: the key under which the data will be cached
export function CacheReturnValue(key: string) {
  // Return our high-order function
  return function(target, methodName, descriptor) {


    //TODO : Si c'est en cache, on renvoit le cache, si ce n'est pas en cache on fait l'appel et on récupère le promise pour le renvoyer ensuite.

    // Keep the method store in a local variable
    let originalMethod = descriptor.value;
  
    // Redefine the method value with our own 
    descriptor.value = function(...args) {
      // Execute the method with its initial context and arguments
      // Return value is stored into a variable instead of being passed to the execution stack

      let returnValue = JSON.parse(sessionStorage.getItem(key));
      console.log(returnValue);
      if(!returnValue){
        console.log("hello");
        returnValue = <Observable<any>>originalMethod.apply(this, args);

        // Sent the return value to the cache service under the key given as parameter of the decorator
        console.log("c'est moi $1",returnValue);
        sessionStorage.setItem(key,JSON.stringify(returnValue));
      }

      // Return back the value to the execution stack
      return returnValue;
    };

    // Return the descriptorwith the altered value
    return descriptor;
  };
};