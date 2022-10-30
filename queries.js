const Pool = require('pg').Pool

const pool = new Pool({
	user: 'me',
	host: 'localhost',
	database: 'codefi',
	password: 'password',
	port: 5432,
})

const getUsers = (request, response) => {
	pool.query('SELECT * FROM users ORDER BY score DESC', (error, results) => {
	  if (error) {
		throw error
	  }
	  response.status(200).json(results.rows)
	})
}

const getUserById = (request, response) => {
	const username = request.params.username

	pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
	if (error) {
		throw error
	}
	response.status(200).json(results.rows)
	})
}

const createUser = (request, response) => {
	const { username, profile_url, name, pic_url } = request.body
	
	pool.query('INSERT INTO users (username, profile_url, name, pic_url) VALUES ($1, $2, $3, $4) RETURNING *', [username, profile_url, name, pic_url], (error, results) => {
	if (error) {
		throw error
	}
	response.status(201).send(`User added with username: ${results.rows[0].username}`)
	})
}

const updateUser = (request, response) => {
	const id = request.params.username
	const { score, completed_count, username } = request.body
  
	pool.query(
	  'UPDATE users SET score = $1, completed_count = $2 WHERE username = $3',
	  [score, completed_count, username],
	  (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`User modified with username: ${username}`)
	  })
}

const deleteUser = (request, response) => {
	const username = request.params.username

	pool.query('DELETE FROM users WHERE id = $1', [username], (error, results) => {
	if (error) {
		throw error
		}
		response.status(200).send(`User deleted with ID: ${id}`)
	})
}

const createUserCodewars = (request, response) => {
	const { username, codewarsid } = request.body
	
	pool.query('INSERT INTO users (username, codewarsid) VALUES ($1, $2) RETURNING *', [username, codewarsid], (error, results) => {
	if (error) {
		throw error
	}
	response.status(201).send(`Codewars ID added with username: ${results.rows[0].username}`)
	})
}

module.exports = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	createUserCodewars
}
