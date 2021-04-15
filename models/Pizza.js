const { Schema, model } = require( 'mongoose' );
const dateFormat = require( '../utils/dateFormat' );

const PizzaSchema = new Schema({
   pizzaName: { type: String, required: true, trim: true },
   createdBy: { type: String, required: true, trim: true },
   createdAt: {
      type: Date,
      default: Date.now,
      get: ( createdAtVal ) => dateFormat( createdAtVal )
   },
   size: { 
      type: String,
      required: true,
      enum: [ 'Personal', 'Small', 'Medium', 'Large', 'Extra Large' ],
      default: 'Large'
   },
   toppings: [],
   comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]},
   {
      // We set id to false because this is a virtual that
      // Mongoose returns, and we don’t need it.
      toJSON: { virtuals: true, getters: true }, id: false
   }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual( 'commentCount' ).get( function() {
   /*
   Here we're using the .reduce() method to tally up the total of every
   comment with its replies. In its basic form, .reduce() takes two parameters,
   an accumulator and a currentValue. Here, the accumulator is total, and the
   currentValue is comment. As .reduce() walks through the array, it passes
   the accumulating total and the current value of comment into the function,
   with the return of the function revising the total for the next iteration
   through the array.
   Like .map(), the array prototype method .reduce() executes a function on each
   element in an array. However, unlike .map(), it uses the result of each
   function execution for each successive computation as it goes through the
   array. This makes it a perfect candidate for getting a sum of multiple values.
   */
   return this.comments.reduce(( total, comment ) => 
                                total + comment.replies.length + 1, 0 );
});
 
 // create the Pizza model using the PizzaSchema
const Pizza = model( 'Pizza', PizzaSchema );

// export the Pizza model
module.exports = Pizza;