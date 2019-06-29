const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(db => console.log('DB is connected'))
    .catch((err) =>  console.error(err));