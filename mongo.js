const mongoose = require('mongoose');
require('dotenv').config();

// #region Input parsing
let addNewPerson = false;
let [password, newName, newNumber] = ['', '', ''];
if (process.argv.length === 3) {
  password = process.argv[2];
}
else if (process.argv.length === 5) {
  password = process.argv[2];
  newName = process.argv[3];
  newNumber = process.argv[4];
  addNewPerson = true;
}
else {
  console.log('Invalid input: expected node mongo.js <DB password> <name> <number>');
  process.exit(1);
}

// #endregion Input parsing

// DB connection
let db_conn_string = process.env.DB_CONN_STRING;
db_conn_string = db_conn_string.replace('<password>', password);

const mongooseSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(db_conn_string, mongooseSettings);

// Person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const MongoosePerson = mongoose.model('Person', personSchema);

// Adding new person
if (addNewPerson) {
  const newPerson = new MongoosePerson({
    name: newName,
    number: newNumber
  });

  newPerson.save().then(() => {
    console.log(`Added ${newPerson.name}, number: ${newPerson.number} to phonebook`);
    mongoose.connection.close();
  });

} else { // Listing existing persons
  console.log('Phonebook:');
  MongoosePerson.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}

