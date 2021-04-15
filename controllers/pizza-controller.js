const { Pizza } = require( '../models' );

const pizzaController = {
   // the functions will go in here as methods

   // get all pizzas
   /*
   Note that we also used the select option inside of populate(),
   so that we can tell Mongoose that we don't care about the __v
   field on comments either. The minus sign - in front of the field
   indicates that we don't want it to be returned. If we didn't have
   it, it would mean that it would return only the __v field.
   */
   getAllPizza( req, res ) {
      Pizza.find({})
         .populate({ path: 'comments', select: '-__v' })
         .select( '-__v' )
         .sort({ _id: -1 })
         .then( dbPizzaData => res.json( dbPizzaData ))
         .catch( err => {
            console.log( err );
            res.status( 400 ).json( err );
         });
      },

   // get one pizza by id
   getPizzaById({ params }, res) {
      Pizza.findOne({ _id: params.id })
         .populate({ path: 'comments', select: '-__v' })
         .select( '-__v' )
         .then(dbPizzaData => {
            // If no pizza is found, send 404
            if ( !dbPizzaData ) {
               res.status( 404 ).json({ message: 'No pizza found with this id!' });
               return;
            ;}
         
            res.json( dbPizzaData );
         })
         .catch( err => {
            console.log( err );
            res.status( 400 ).json( err );
         });
      },

   // createPizza
   createPizza({ body }, res) {
      Pizza.create(body)
         .then( dbPizzaData => res.json( dbPizzaData ))
         .catch( err => res.status( 400 ).json( err ));
      },

   // update pizza by id
   /*
   With this .findOneAndUpdate() method, Mongoose finds a single document
   we want to update, then updates it and returns the updated document.
   If we don't set that third parameter, { new: true }, it will return the
   original document. By setting the parameter to true, we're instructing
   Mongoose to return the new version of the document.
   */
   updatePizza({ params, body }, res) {
      Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then( dbPizzaData => {
         if ( !dbPizzaData ) {
            res.status( 404 ).json( { message: 'No pizza found with this id!' } );
            return;
         };

         res.json( dbPizzaData );
      })
      .catch( err => res.status( 400 ).json( err ));
   },

   // delete pizza
   deletePizza({ params }, res) {
      Pizza.findOneAndDelete({ _id: params.id })
      .then( dbPizzaData => {
         if ( !dbPizzaData ) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
         };

         res.json( dbPizzaData );
      })
      .catch( err => res.status( 400 ).json( err ));
   }
};

module.exports = pizzaController;