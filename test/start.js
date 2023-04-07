import chai from 'chai';

it('should app numbers correctly',
    function(){
        const num1 =3;
        const num2 = 2;
        chai.expect(num1+num2).to.equal(5);
    }
)