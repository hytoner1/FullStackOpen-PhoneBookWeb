const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let db_conn_string_with_pword = process.env.DB_CONN_STRING_WITH_PWORD;
console.log('Connecting to', process.env.DB_CONN_STRING);

const mongooseSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(db_conn_string_with_pword, mongooseSettings)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Connection error:', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true
  }
});

personSchema.set('toJSON',
  {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  }
);

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);