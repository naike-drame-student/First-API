const express = require('express');
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;

const app = express();

//Note: For testing, both methods are allowed, but please choose the appropriate parsing method for your application

//Parses JSON data in the request body and makes it available in req.body for subsequent route handlers.
app.use(express.json());
//Parses URL-encoded data in the request body and makes it available in req.body for subsequent route handlers. The extended: true option allows for parsing nested objects.
app.use(express.urlencoded({ extended: true }));

// Create an empty array to store the users
let users = [];

// GET /api/users - Retrieve all users
app.get('/api/users', (req, res) => {
	res.json(users);
});

// GET /api/users/:id - Retrieve a specific user by ID
app.get('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const user = users.find((user) => user.id === id);

	if (!user) {
		res.status(404).json({ error: 'User not found' });
	} else {
		res.json(user);
	}
});

// POST /api/users - Create a new user
app.post('/api/users', (req, res) => {
	const { username, firstName, lastName, age, isAdmin } = req.body;

	if (!username || !firstName || !lastName || !age || isAdmin === undefined) {
		res.status(400).json({ error: 'All fields are required' });
	} else {
		const id = uuidv4();
		const newUser = { id, username, firstName, lastName, age, isAdmin };
		users.push(newUser);
		res.status(201).json(newUser);
	}
});

// PUT /api/users/:id - Update an existing user
app.put('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const { username, firstName, lastName, age, isAdmin } = req.body;
	const user = users.find((user) => user.id === id);

	if (!user) {
		res.status(404).json({ error: 'User not found' });
	} else if (
		!username ||
		!firstName ||
		!lastName ||
		!age ||
		isAdmin === undefined
	) {
		res.status(400).json({ error: 'All fields are required' });
	} else {
		user.username = username;
		user.firstName = firstName;
		user.lastName = lastName;
		user.age = age;
		user.isAdmin = isAdmin;
		res.json(user);
	}
});

// DELETE /api/users/:id - Delete an existing user
app.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const userIndex = users.findIndex((user) => user.id === id);

	if (userIndex === -1) {
		res.status(404).json({ error: 'User not found' });
	} else {
		const deletedUser = users.splice(userIndex, 1)[0];
		res.json(deletedUser);
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
