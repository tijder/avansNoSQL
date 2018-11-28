function createUser(session, name) {
	session.run('MERGE (u: User {mongoid: $name})',
		{
			name: "id" + name
		}
	)
}

function createFriends(session, user, friend) {
	session.run('MATCH (u: User {mongoid: $user}), (f: User {mongoid: $friend}) MERGE (u)-[v:Friends]-(f)',
		{
			user: "id" + user,
			friend: "id" + friend
		}
	)
}

function destroyFriends(session, user, friend) {
	session.run('MATCH (u: User {mongoid: $user}), (f: User {mongoid: $friend}), (u)-[r:Friends]-(f) DELETE r',
		{
			user: "id" + user,
			friend: "id" + friend
		}
	)
}

module.exports = {
    createUser: createUser,
	createFriends: createFriends,
	destroyFriends: destroyFriends,
}