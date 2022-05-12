import type {IUserEvent} from './types';

import express from 'express';
import mysql from 'mysql2';
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

const app = express();
var conn = mysql.createConnection({
  host: 'localhost',
	port: 3307,
  user: 'root',     
  password: 'workos',     
  database: 'slack'
}); 
 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database connected');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

http.createServer(app).listen(3000)

console.log('HTTP server started at port 3000');


app.post('/webhooks', (req, res) => {
	const event = req.body?.event as IUserEvent;
	if (event) {
		
		
	
		conn.query(`REPLACE INTO slack.users
		(id,
		name,
		deleted,
		real_name,
		TZ,
		STATUS_TEXT,
		STATUS_EMOJI,
		IMAGE_512)
		VALUES
		("${event.user.id}",
		"${event.user.name}",
		${Number(event.user.deleted)},
		"${event.user.real_name}",
		"${event.user.tz}",
		"${event.user.profile.status_text}",
		"${event.user.profile.status_emoji}",
		"${event.user.profile.image_512}");
		`,(err) => {
			if (err) {
				console.log(`Error saving user ${event.user.name} data: `, err?.message);
				res.status(500);
				res.end();
				return;
			}
			console.log(`User ${event.user.name} data saved sucessfully.`);
			res.status(200);
			res.end();
		});
	}
  
});

app.get('/users', (req, res, next) => cors()(req,res,next), (req, res) => {
	conn.query('SELECT * FROM slack.users ORDER BY name',function(err,rows) {
	
		if(err){
			res.status(500);
			res.end();
		};

		res.status(200);
		res.send({users: rows});
		res.end();
			
	});
});