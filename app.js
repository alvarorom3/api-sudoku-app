const express = require('express');
const app = express();
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_PROJECT;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const PORT = process.env.PORT || 5000;

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', process.env.SUDOKU_APP_ORIGIN);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

async function getRandomRecord(difficulty) {
	const { data, error } = await supabase
		.from(difficulty)
		.select('puzzle, solution, difficulty');

	if (error) {
		console.error('Error fetching random record:', error);
		return null;
	}

	return data && data.length ? data[0] : null;
}

const tableName = process.env.SUPABASE_TABLE;

app.get('/puzzle/:difficulty', (req, res) => {
	const { difficulty } = req.params;

	getRandomRecord(difficulty)
		.then(randomRecord => {
			if (randomRecord) {
				res.status(200).send(randomRecord);
			} else {
				res.status(200).send('No random records found.');
			}
		})
		.catch(error => {
			res.status(400).send(error);
		});
});

app.listen(PORT);
