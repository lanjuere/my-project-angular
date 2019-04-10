import {Observable,AsyncSubject} from "rxjs";
// Define a function with one parameter: the key under which the data will be cached
export function CacheReturnValue(key: string) {
  // Return our high-order function
  let observers = {};
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
      let result = JSON.parse(sessionStorage.getItem(key));
      if(!observers[key]){
            console.log("oserver : ", observers[key]);
            observers[key] = new AsyncSubject<any>();
            <Observable<any>>originalMethod.apply(self, args).subscribe(function(res){
              results[key] = res;
              sessionStorage.setItem(key,JSON.stringify(res));
                setTimeout(()=>{
                  observers[key].next(res); 
                  observers[key].complete();
                },JSON.parse(sessionStorage.getItem(TIMEOUT_KEY)) );         
              });
      }
    
      // Return back the value to the execution stack
      return observers[key];
    };

    // Return the descriptorwith the altered value
    return descriptor;
  };
};