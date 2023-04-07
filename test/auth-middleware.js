import chai from 'chai';
import authMiddleware from '../middleware/is-auth.js';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

describe('Auth middleware',function(){
    
    it('should throw error if no authorization header is present',function(){
        const req = {
            get: function(){
                return null;
            }
        };
        chai.expect(authMiddleware.bind(this,req,{},()=>{})).to.throw("Not authanticated");
    })
    
    it('should throw an error if the authorization header is only string',function(){
        const req = {
            get: function(headerName){
                return 'xyz';
            }
        };
        chai.expect(authMiddleware.bind(this,req,{},()=>{})).to.throw()
    })

    it('should throw an error if the token cannot be verified', function(){
        const req = {
            get: function(headerName){
                return 'Bearer xyz';
            }
        };
        chai.expect(authMiddleware.bind(this,req,{},()=>{})).to.throw();
    })
    it('should yield a userId after decoding the token', function(){
        const req = {
            get: function(headerName){
                return 'Bearer djvdfgfghhg';
            }
        };
        sinon.stub(jwt,'verify');
        jwt.verify.returns({ userId : 'abc'});

        authMiddleware(req,{},()=>{})
        chai.expect(req).to.have.property('userId');
        chai.expect(req).to.have.property('userId','abc')
        chai.expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });
});

