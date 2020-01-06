const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_7vajDkfH83tUVOXG7mMwwgBC00rVgNFJGz');
const firebase = require('firebase');

exports.payWithStripe = functions.https.onRequest((request, response) => {
    stripe.charges.create({
        amount: request.body.amount,
        currency: request.body.currency,
        source: request.body.token,
        description: request.body.description
    }).then((charge) => {
        response.send(charge);
        return 'success';
    })
        .catch(err => {
            console.error('FEHLER');
            console.log(err);
            response.send('error');
        })
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
