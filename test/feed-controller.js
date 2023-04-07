import chai, { expect } from 'chai';

import mongoose from 'mongoose';

import User from '../models/user.js';
import FeedController from '../controller/feed.js'

describe('Feed controller ', function(){
    
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
    
    it('should add a created post of the creatror',(done)=>{
    
        const req ={
            body : {
               title : 'test post',
               content : 'A test Post'
            },
            file : {
                path : 'abc'
            },
            userId : '5c0f66b979af55031b34728a'
        };

        const res = {status : function(){
            return this;
        },json: function(){}};


       FeedController.createPost(req,res,()=>{}).then((savedUser)=>{
           chai.expect(savedUser).to.have.property('posts');
           chai.expect(savedUser.posts).to.have.length(1);
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