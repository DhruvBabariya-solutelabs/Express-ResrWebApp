import chai, { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';

import User from '../models/user.js';
import AuthController from '../controller/auth.js'
import FeedController from '../controller/feed.js'

describe('auth controller - Login', function(){
    
    before(function(done){
        mongoose.connect('mongodb+srv://dhruvbabariya912001:1Qgtr12DHk0qWzqr@firstcluster.hexiesz.mongodb.net/test-messages?retryWrites=true&w=majority')
        .then(result =>{
            const user = new User({
                email : 'test@test.com',
                password : 'tester',
                name : 'Test',
                posts : [],
                _id : '5c0f66b979af55031b34728a'
            })
            return user.save();
        })
        .then(()=>{
            done();
        })
    })
    
    it('should throw error eith code 500 if accessing database failed',(done)=>{
        sinon.stub(User,'findOne');
        User.findOne.throws();

        const req ={
            body : {
                email : 'test@test.com',
                password : 'tester'
            }
        };

        AuthController.login(req,{},()=>{}).then(result =>{
             chai.expect(result).to.be.an('error');
            chai.expect(result).to.have.property('statusCode',500);
            done();
        })

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user',function(done){
            const req = {userId : '5c0f66b979af55031b34728a'}
            const res = {
                statusCode : 500,
                userStatus : null,
                status : function(code){
                    this.statusCode = code;
                    return this;
                },
                json : function(data){
                    this.userStatus = data.status;
                }
            };
            FeedController.getStatus(req,res,()=>{}).then(()=>{
                chai.expect(res.statusCode).to.be.equal(200);
                chai.expect(res.userStatus).to.be.equal('i am new!');
                done()                    
            })
    });
    after(function(done){
        User.deleteMany({}).then(()=>{
            return mongoose.disconnect();
        })
        .then(()=>{
            done();
        })     
    })
});