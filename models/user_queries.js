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

function getFriendsOfFriends(session, user, count) {
	return session.run('MATCH (u:User {mongoid: $user})-[r:Friends*1..'+count+']->(f:User) return f',
		{
			user: "id" + user,
		}
	).then((result) => {
		array = []
		for (item in result.records) {
			id = result.records[item]._fields[0].properties.mongoid
			id = id.substr(2)
			array.push(id); 
		  }
		  console.log(array)
		return array
	})
}



module.exports = {
    createUser: createUser,
	createFriends: createFriends,
	destroyFriends: destroyFriends,
	getFriendsOfFriends: getFriendsOfFriends,
}