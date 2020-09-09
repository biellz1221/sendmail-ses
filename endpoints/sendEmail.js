const Responses = require('../lambdas/API_Responses');
const AWS = require('aws-sdk');

const SES = new AWS.SES();

exports.handler = async (event) => {
	console.log('event', event);

	const { to, from, subject, text } = JSON.parse(event.body);

	if (!to || !from || !subject || !text) {
		return Responses._400({ message: 'All fields are required' });
	}

	const params = {
		Destination: {
			ToAddresses: [to],
		},
		Message: {
			Body: {
				Text: { Data: text },
			},
			Subject: { Data: subject },
		},
		Source: from,
	};

	try {
		await SES.sendEmail(params).promise();
		return Responses._200({ message: 'enviado com sucesso' });
	} catch (e) {
		console.log('sending error', e);
		return Responses._400({ message: e });
	}
};
