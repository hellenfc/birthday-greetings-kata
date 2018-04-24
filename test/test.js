var assert = require('assert');
var greet = require('../app.js');
var fs = require('fs');

const getData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("data.txt", "utf8", function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};

describe('Birthday-Greetings', () => {

    it('Should get today date', async () => {
        assert.equal('04/24', greet.getTodayDate());
    });

    it('Should show just birthdays', async () => {
        const data = await getData();
        assert.deepEqual(['04/24', '09/11'], greet.getBirthdays(data));
    });

    it('Should get employee whose birthday is today', async () => {
        const data = await getData();
        assert.deepEqual(['Doe', 'John', '2018/04/24', 'john.doe@foobar.com'], greet.getBirthdayEmployee(data, greet.getTodayDate()));
    });

    it('Should set Email Data', async () => {
        const data = await getData();
        assert.deepEqual({
            from: 'user@hotmail.com',
            to: 'john.doe@foobar.com',
            subject: 'Happy birthday!',
            text: 'Happy birthday, dear Doe'
        }, greet.setEmailData(data, greet.getTodayDate()));
    });

    it('Should send an email', async () => {
        const data = await getData();
        greet.sendEmail(data, greet.getTodayDate())
        .then((response) =>{
            assert.deepEqual('Email Sent', response);
        });        
    });
});