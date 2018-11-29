const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
const expect = chai.expect()

chai.use(chaiHttp)
describe('Comments API interface', () => {
    var threadTitle = "CommentTest" + Math.floor((Math.random() * 1000000000000) + 1)
    var userName = "CommentTest" + Math.floor((Math.random() * 1000000000000) + 1)
    var userId
    it('should POST /comments incorrect if params missing', done => {
        chai.request(server)
            .post('/comments/threads/notexistingid')
            .end((err, res) => {
                res.should.have.status(400)
                done()
            })
    })
    it('should POST /comments/threads/:threadid correct', done => {
        chai.request(server).post('/users').send({
            name: userName,
            password: "password"
        }).end((err, res) => {
            userId = res.body._id
            chai.request(server).post('/threads').send({
                title: threadTitle,
                content: 'test thread content',
                userName: userName
            }).end((err, thread) => {
                chai.request(server)
                    .post('/comments/threads/' + thread.body.id)
                    .send({
                        content: 'test thread content',
                        userName: userName
                    })
                    .end((err, res) => {
                        res.should.have.status(200)
                        done()
                    })
            })
        })
    })
    it('should POST /comments/comments/:commentid correct', done => {
        chai.request(server).post('/users').send({
            name: userName,
            password: "password"
        }).end((err, res) => {
            chai.request(server).post('/threads').send({
                title: threadTitle,
                content: 'test thread content',
                userName: userName
            }).end((err, thread) => {
                chai.request(server)
                    .post('/comments/threads/' + thread.body.id)
                    .send({
                        content: 'test comment content',
                        userName: userName
                    })
                    .end((err, comment) => {
                        chai.request(server)
                            .post('/comments/comments/' + comment.body.id)
                            .send({
                                content: 'test comment on a comment content',
                                userName: userName
                            })
                            .end((err, res) => {
                                res.should.have.status(200)
                                done()
                            })
                    })
            })
        })
    })
    it('should POST /comments/:commentid/upvote correct', done => {
        chai.request(server).post('/threads').send({
            title: threadTitle,
            content: 'test thread content',
            userName: userName
        }).end((err, thread) => {
            chai.request(server)
                .post('/comments/threads/' + thread.body.id)
                .send({
                    content: 'test comment content',
                    userName: userName
                })
                .end((err, comment) => {
                    chai.request(server)
                        .post('/comments/' + comment.body.id + '/upvote')
                        .send({
                            userName: userName
                        })
                        .end((err, res) => {                                
                            res.should.have.status(200)
                            res.body.message.should.equal('Upvoted comment: ' + comment.body._id)
                            done()
                        })
                })
        })
    })
    it('should DEL /comments/:commentid/upvote correct', done => {
        chai.request(server).post('/threads').send({
            title: threadTitle,
            content: 'test thread content',
            userName: userName
        }).end((err, thread) => {
            chai.request(server)
                .post('/comments/threads/' + thread.body.id)
                .send({
                    content: 'test comment content',
                    userName: userName
                })
                .end((err, comment) => {
                    chai.request(server)
                        .del('/comments/' + comment.body.id + '/upvote')
                        .send({
                            userName: userName
                        })
                        .end((err, res) => {                                
                            res.should.have.status(200)
                            res.body.message.should.equal('Deleted upvote from comment: ' + comment.body._id)
                            done()
                        })
                })
        })
    })
    it('should POST /comments/:commentid/downvote correct', done => {
        chai.request(server).post('/threads').send({
            title: threadTitle,
            content: 'test thread content',
            userName: userName
        }).end((err, thread) => {
            chai.request(server)
                .post('/comments/threads/' + thread.body.id)
                .send({
                    content: 'test comment content',
                    userName: userName
                })
                .end((err, comment) => {
                    chai.request(server)
                        .post('/comments/' + comment.body.id + '/downvote')
                        .send({
                            userName: userName
                        })
                        .end((err, res) => {                                
                            res.should.have.status(200)
                            res.body.message.should.equal('Downvoted comment: ' + comment.body._id)
                            done()
                        })
                })
        })
    })
    it('should DEL /comments/:commentid/downvote correct', done => {
        chai.request(server).post('/threads').send({
            title: threadTitle,
            content: 'test thread content',
            userName: userName
        }).end((err, thread) => {
            chai.request(server)
                .post('/comments/threads/' + thread.body.id)
                .send({
                    content: 'test comment content',
                    userName: userName
                })
                .end((err, comment) => {
                    chai.request(server)
                        .del('/comments/' + comment.body.id + '/downvote')
                        .send({
                            userName: userName
                        })
                        .end((err, res) => {                                
                            res.should.have.status(200)
                            res.body.message.should.equal('Deleted downvote from comment: ' + comment.body._id)
                            done()
                        })
                })
        })
    })
    it('should POST /comments incorrect if users doesnt exist', done => {
        chai.request(server).post('/threads').send({
            title: threadTitle,
            content: 'test thread content',
            userName: userName
        }).end((err, thread) => {
            chai.request(server)
                .post('/comments/threads/' + thread.body.id)
                .send({
                    content: 'test thread content',
                    userName: 'dont exist'
                })
                .end((err, res) => {
                    res.should.have.status(422)
                    done()
                })
        })
    })
})