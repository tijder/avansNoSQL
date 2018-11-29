const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
const expect = chai.expect()

chai.use(chaiHttp)
describe('Frienship API interface', () => {
      var username1 = "FriendshipTest" + Math.floor((Math.random() * 1000000000000) + 1)
      var username2 = "FriendshipTest" + Math.floor((Math.random() * 1000000000000) + 1)
      it('should POST /friendship/:userone/:usertwo correct', done => {
          chai.request(server).post('/users').send({name:username1,password:"password"}).end((err, res) => {})
          chai.request(server).post('/users').send({name:username2,password:"password"}).end((err, res) => {})
          chai.request(server)
            .post('/users/friendship/' + username1 + '/' + username2)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.lengthOf(2)
              done()
            })
        })
        it('should POST /friendship/:userone/:usertwo incorrect if users doesnt exist', done => {
          chai.request(server)
            .post('/users/friendship/dont/exist')
            .end((err, res) => {
              res.should.have.status(422)
              done()
            })
        })
        it('should DELETE /friendship/:userone/:usertwo correct', done => {
            chai.request(server)
              .delete('/users/friendship/' + username1 + '/' + username2)
              .end((err, res) => {
                res.should.have.status(200)
                done()
              })
          })
          it('should DELETE /friendship/:userone/:usertwo incorrect if users doesnt exist', done => {
            chai.request(server)
              .delete('/users/friendship/dont/exist')
              .end((err, res) => {
                res.should.have.status(422)
                done()
              })
          })
})