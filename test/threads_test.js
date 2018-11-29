const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
const expect = chai.expect()

chai.use(chaiHttp)
describe('Threads API interface', () => {
      var threadTitle = "ThreadTest" + Math.floor((Math.random() * 1000000000000) + 1)
      var username = "ThreadTest" + Math.floor((Math.random() * 1000000000000) + 1)
      it('should POST /threads incorrect if params missing', done => {
        chai.request(server)
          .post('/threads')
          .end((err, res) => {
            res.should.have.status(400)
            done()
          })
      })
      it('should POST /threads correct', done => {
          chai.request(server).post('/users').send({name:username,password:"password"}).end((err, res) => {
              chai.request(server)
                .post('/threads')
                .send({title:threadTitle,content:'test thread content',userName:username})
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.title.should.equal(threadTitle)
                    res.body.content.should.equal('test thread content')
                    res.body.upVotes.should.equal(0)
                    res.body.downVotes.should.equal(0)
                    done()
                })
          })
        })
        it('should POST /threads incorrect if users doesnt exist', done => {
            chai.request(server)
            .post('/threads')
            .send({title:threadTitle,content:'test thread content',userName:'dont exist'})
            .end((err, res) => {
                res.should.have.status(422)
                done()
            })
        })
})