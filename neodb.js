const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(
    'bolt://hobby-dphgonmokoimgbkekppaefbl.dbs.graphenedb.com:24786', 
    neo4j.auth.basic('dev', 'b.Ilh3dotC0JZf.fq8QkfRbhrgcDm3h')
);

const session = driver.session()

module.exports = {
    session,
    neo4j
}
