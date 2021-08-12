const mongoose = require('mongoose');

let db_conn_string_with_pword = process.env.DB_CONN_STRING_WITH_PWORD;
console.log('Connecting to', process.env.DB_CONN_STRING);

const mongooseSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(db_conn_string_with_pword, mongooseSettings)
  .then(result => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Connection error:', error.message);
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

personSchema.set('toJSON',
  {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  });

module.exports = mongoose.model('Person', personSchema);