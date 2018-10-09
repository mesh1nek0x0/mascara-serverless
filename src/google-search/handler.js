'use strict';

const AWS = require('aws-sdk');

module.exports.index = async (event, context, callback) => {
    console.log(context);
    const req = JSON.parse(event.body);
    if (req.TOKEN != process.env.TOKEN) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'bad request',
                input: event.body
            }),
        };
    }

    const lambda = new AWS.Lambda();
    const params = {
        FunctionName: 'mascara-google-search-dev-google-search',
        ClientContext: 'google-search-endpoint',
        InvocationType: 'Event',
        Payload: JSON.stringify({
            "searchWord": req.text
        }),
    };

    await lambda
        .invoke(params)
        .promise()
        .then(function() {
            const response = {
                statusCode: 202,
                body: JSON.stringify({
                    message: 'Go Serverless v1.0! Your function executed successfully!',
                    input: event.body,
                }),
            };
            console.log('lambda will be ended with success');
            return callback(null, response);
        })
        .catch(function(error) {
            console.log('lambda will be ended with failure');
            return callback(error);
        });
    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
