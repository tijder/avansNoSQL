const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver('bolt://' + NEODB_IP + ':' + NEODB_PORT, neo4j.auth.basic(NEODB_USER, NEODB_PASS))
const session = driver.session()

module.exports = {
    session,
    neo4j
}
