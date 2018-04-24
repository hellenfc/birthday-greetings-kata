const nodemailer = require('nodemailer');
const leapYear= require('leap-year');
let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'user@hotmail.com',
        pass: 'password'
    }
});
let greet = {};

greet.getBirthdays = (txtData) => {
    let birthdays = [];
    let employeesData = txtData.split('\r\n');
    for (let i = 1; i < employeesData.length; i++) {
        let person = employeesData[i].split(', ')
        let dateArray = person[2].split('/')
        dateArray.splice(0,1);
        birthdays.push(dateArray[0] + '/' + dateArray[1]);
    }
    return birthdays;
}

greet.getBirthdayEmployee = (txtData, today) => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let birthdays = greet.getBirthdays(txtData);
    let employeeData;
    let employeesData = txtData.split('\r\n');
    for (let i = 0; i < birthdays.length; i++) {
        if (!leapYear(year)) {
           if(birthdays[i] === "02/29"){
               employeeData = employeesData[i + 1];
           }
        }
        if (birthdays[i] === today) {
            employeeData = employeesData[i + 1];
        }
    }
    return employeeData.split(', ');
}

greet.getTodayDate = () => {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    if (day.toString(day).length == 1) {
        day = "0" + day.toString();
    }
    if (month.toString().length == 1) {
        month = "0" + month.toString();
    }
    return month + "/" + day;
}

greet.setEmailData = (txtData, today) => {
    var employee = greet.getBirthdayEmployee(txtData, today);
    var mailOptions = {
        from: 'user@hotmail.com',
        to: employee[3],
        subject: 'Happy birthday!',
        text: 'Happy birthday, dear ' + employee[0]
    };
    return mailOptions;
}

greet.sendEmail = (txtData, today) => {
    return new Promise((resolve, reject) => {
        mailOptions = greet.setEmailData(txtData, today);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve('Email Sent');
            }
        });
    });    
}
module.exports = greet;
