const AWS = require("aws-sdk");
const {getEmail} = require('../../../../shared/Emails/template')
const config = require('../../../../config/config.json')
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'

export const sendMail = (obj) => {
    console.log(obj)
    var msg = obj['msg']
    var to = obj['to']
    var toa = [to]
    var ses = new AWS.SES({apiVersion: '2010-12-01'});
    var from = "kyle@dataskeptic.com";
    var type = obj['type'] || 'default';
    var subject = obj['subject'] || "dataskeptic.com msg"
    var resp = {status: 200, msg: "ok"}
    var body = getEmail(obj, type)
    var email_request = {
        Source: from,
        Destination: {ToAddresses: toa, BccAddresses: [from]},
        Message: {
            Subject: {
                Data: subject
            },
            Body: {
                Html: {
                    Data: body
                }
            }
        }
    };
    return new Promise((resolve, reject) => {

        ses.sendEmail(email_request, function (err, data) {
            if (err !== null) {

                console.log(err)
                return reject(JSON.stringify(err))
            } else {

                resp = {status: 200, msg: err}
                return resolve(JSON.stringify(resp))
            }
        });
    })
};