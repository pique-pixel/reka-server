const mongoose = require('mongoose');
//'mongodb://localhost:27017/reka'
//"mongodb+srv://octivia:786Hh786@octivia.8rlek.mongodb.net/reka"
mongoose
	.connect(
		"mongodb+srv://octivia:786Hh786@octivia.8rlek.mongodb.net/reka?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.info('Connected to Database');
	})
	.catch((err) => {
		console.log(err)
		console.error('Could not establish connection with Database');
	});

mongoose.set('useFindAndModify', false);

module.exports = mongoose;
