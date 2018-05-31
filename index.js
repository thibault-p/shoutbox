const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const path = require('path');

const slash_token = process.env.SLACK_SLASH_TOKEN || 'test';

const dstDir = process.env.OPENSHIFT_DATA_DIR || '.';

const shoutFile = path.join(dstDir, 'shout.data');
const releaseFile = path.join(dstDir, 'release.data');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let lastMessage = undefined;
let releaseIP = undefined;


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
	fs.writeFile(shoutFile, lastMessage, (err) => {
		if (err) {
			console.error('Failed to store shouted message:', err);
		}
		res.send({
			response_type: 'ephemeral',
			text: `Votre message a été entendu. ;)`
		});
	});
});

app.get('/shout', (req, res) => {
	if (lastMessage !== undefined) {
		res.send(lastMessage);
		return;
	}
	// try to read it from file
	fs.readFile(shoutFile, (err, data) => {
		if (err) {
			console.error('Failed to read file: ', err);
		}
		lastMessage = data;
		res.send(lastMessage || '');
	});
});


app.post('/release', (req, res) => {
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
	if (!req.body.text || req.body.text !== 'begin' || req.body.text !== 'end') {
		res.status(403);
		res.send({ error: 'Option is not valid.' });
		return;
	}
    
	releaseIP = req.body.text === 'begin' ? '1' : '0';
	fs.writeFile(releaseFile, releaseIP, (err) => {
		if (err) {
			console.error('Failed to store shouted message:', err);
		}
		let text = '';
		if (req.body.text === 'begin') {
			text = 'Le dashboard va passer en mode release.'
		}
		if (req.body.text === 'end') {
			text = 'Le dashboard va quitter le mode release.'
		}


		res.send({
			response_type: 'ephemeral',
			text: `text`
		});
	});
});



app.get('/release', (req, res) => {
	if (releaseIP !== undefined) {
		return releaseIP;
	}

	fs.readFile(releaseFile, (err, data) => {
		if (err) {
			console.error('Failed to read file:', err);
		}
		releaseIP = data;
		res.send(releaseIP || '0');
	});
});


const port = process.env.OPENSHIFT_NODEJS_PORT || 8080
const address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(port, address, function () {
  console.log( "Listening on " + address + ", port " + port )
});
