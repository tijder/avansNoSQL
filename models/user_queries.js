function createUser(session, name) {
	session.run('MERGE (u: User {name: $name})',
		{
			name: name
		}
	)
}

function updateUser(session, oldName, newName) {
	session.run('Match (n: User {name: $oldName}) SET n.name = $newName',
		{
			oldName: oldName,
			newName: newName
		}
	)
}

function destroyUser(session, name) {
	session.run('Match (n: User {name: $name}) detach delete n',
		{
			name: name
		}
	)
}

function createFriends(session, user, friend) {
	session.run('MATCH (u: User {name: $user}), (f: User {name: $friend}) MERGE (u)-[v:Friends]-(f)',
		{
			user: user,
			friend: friend
		}
	)
}

function destroyFriends(session, user, friend) {
	session.run('MATCH (u: User {name: $user}), (f: User {name: $friend}), (u)-[r:Friends]-(f) DELETE r',
		{
			user: user,
			friend: friend
		}
	)
}

module.exports = {
    createUser: createUser,
    updateUser: updateUser,
    destroyUser: destroyUser,
	createFriends: createFriends,
	destroyFriends: destroyFriends,
}