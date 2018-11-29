const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
const expect = chai.expect()

chai.use(chaiHttp)
describe('Users API interface', () => {
    var username = "UserTest " + Math.floor((Math.random() * 1000000000000) + 1)
    var password = "test"
    it('should POST /users incorrect if params missing', done => {
      chai.request(server)
        .post('/users')
        .end((err, res) => {
          res.should.have.status(400)
          done()
        })
    })
    it('should POST /users correct', done => {
        chai.request(server)
          .post('/users')
          .send({name:username,password:password})
          .end((err, res) => {
            res.should.have.status(200)
            res.body.name.should.equal(username)
            res.body.password.should.equal(password)
            res.body.active.should.equal(true)
            done()
          })
      })
      it('should POST /users incorrect if allready exist', done => {
        chai.request(server)
          .post('/users')
          .send({name:username,password:password})
          .end((err, res) => {
            res.should.have.status(422)
            done()
          })
      })
      it('should PUT /users incorrect if params missing', done => {
        chai.request(server)
          .put('/users')
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('should PUT /users correct', done => {
        chai.request(server)
          .put('/users')
          .send({name:username,password:password,newpassword:password + 'new'})
          .end((err, res) => {
            res.should.have.status(200)
            res.body.password.should.equal(password + 'new')
            done()
          })
      })
      it('should PUT /users incorrect if password is incorrect', done => {
        chai.request(server)
          .put('/users')
          .send({name:username,password:'incorrect',newpassword:password + 'new'})
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
      it('should DELETE /users incorrect if params missing', done => {
        chai.request(server)
          .delete('/users')
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('should DELETE /users correct', done => {
        chai.request(server)
          .delete('/users')
          .send({name:username,password:password + 'new'})
          .end((err, res) => {
            res.should.have.status(200)
            res.body.active.should.equal(false)
            done()
          })
      })
      it('should DELETE /users incorrect if password is incorrect', done => {
        chai.request(server)
          .delete('/users')
          .send({name:username,password:'incorrect',newpassword:password + 'new'})
          .end((err, res) => {
            res.should.have.status(401)
            done()
          })
      })
})
