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
    
    lastMessage = req.body.text;

    res.send({
        response_type: 'ephemeral',
        text: `Votre message a été entendu. ;)`
    });
});

app.get('/shout', (req, res) => {
    res.send(lastMessage);
});


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(port, address, function () {
  console.log( "Listening on " + address + ", port " + port )
});
