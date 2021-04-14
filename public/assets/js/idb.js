// Create variable to hold db connection
let db;


// Establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
// This is an event listener to the db
// indexedDB is a global variable
const request = indexedDB.open( 'pizza_hunt', 1 );


/*
This event listener will emit if the database version changes
 (nonexistant to version 1, v1 to v2, etc.)

 This onupgradeneeded event will emit the first time we run this code and
 create the new_pizza object store. The event won't run again unless we
 delete the database from the browser or we change the version number in
 the .open() method to a value of 2, indicating that our database needs an update.
 */
request.onupgradeneeded = function( event ) {
   // Save a reference to the database 
   const db = event.target.result;

   // Create an object store (table) called `new_pizza`, set it to have
   // an auto incrementing primary key of sorts 
   db.createObjectStore( 'new_pizza', { autoIncrement: true });
};


// Upon a successful db creation/connection
request.onsuccess = function( event ) {
   // When db is successfully created with its object store (from onupgradedneeded
   // event above) or simply established a connection, save reference to db in
   // global variable
   db = event.target.result;
 
   // check if app is online, if yes run uploadPizza() function to send all local
   // db data to api
   if ( navigator.onLine ) {
      uploadPizza();
   };
};
 

 request.onerror = function( event ) {
   // log error here
   console.log( event.target.errorCode );
};


// This function will be executed if we attempt to submit a new pizza
// and there's no internet connection
// This saveRecord() function will be used in the add-pizza.js file's
// form submission function if the fetch() function's .catch() method is executed,
// since the .catch() method is executed on netowrk failure.
function saveRecord( record ) {
   // Open a new transaction with the database with read and write permissions
   // Kind of like a temporary connection to the db
   const transaction = db.transaction( [ 'new_pizza' ], 'readwrite' );
 
   // Access the object store for `new_pizza`
   const pizzaObjectStore = transaction.objectStore( 'new_pizza' );
 
   // Add record to your store with add method
   pizzaObjectStore.add( record );
};


function uploadPizza() {
   // Open a transaction on your db to read the data
   const transaction = db.transaction( ['new_pizza'], 'readwrite' );
 
   // Access your object store
   const pizzaObjectStore = transaction.objectStore( 'new_pizza' );
 
   // Get all records from store and set to a variable
   // the .getAll() method is an asynchronous function that we
   // have to attach an event handler to in order to retrieve the data
   const getAll = pizzaObjectStore.getAll();
 
   // upon a successful .getAll() execution, run this function
   // getAll.result is an array
   getAll.onsuccess = function() {
      // if there was data in indexedDb's store, let's send it to the api server
      if ( getAll.result.length > 0 ) {
      fetch( '/api/pizzas', {
         method: 'POST',
         body: JSON.stringify( getAll.result ),
         headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
         }
      })
      .then( response => response.json())
      .then( serverResponse => {
         if ( serverResponse.message ) {
            throw new Error( serverResponse );
         };

         // open one more transaction
         const transaction = db.transaction( [ 'new_pizza' ], 'readwrite' );

         // access the new_pizza object store
         const pizzaObjectStore = transaction.objectStore( 'new_pizza' );

         // clear all items in your store
         pizzaObjectStore.clear();

         alert( 'All saved pizza has been submitted!' );
      })
      .catch( err => {
         console.log( err );
      });
   }};
};


// Listen for when app is coming back online
window.addEventListener( 'online', uploadPizza );