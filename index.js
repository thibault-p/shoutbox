const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const slash_token = process.env.SLACK_SLASH_TOKEN || 'test';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let lastMessage = '';


app.post('/shout', (req, res) => {
    if (!req || !req.body) {
		res.status(403);
		return;
	}

	// check token
	if (req.body.token !== slash_token)
	{
		res.status(403);
		res.send({ error: 'token not valid' });
		return;
    }
    
    // get command
	if (!req.body.text) {
		res.status(403);
		res.send({ error: 'text is missing' });
		return;
    }
    
    lastMessage = text;

    res.send({
        response_type: 'ephemeral',
        text: `Votre message a été entendu. ;)`
    });
});

app.get('/shout', (req, res) => {
    res.send(lastMessage);
});


const port = process.env.PORT || 5000;
app.listen(port);
console.log('Starting server on port:', port);