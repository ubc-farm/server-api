import {options} from './proxy.js';
import {server as connection} from '../ubc-farm-api/package.json';
const {host = 'localhost', protocol = 'http', port} = connection;
if (port === undefined) throw Error('Missing port');

export const handler = Object.assign({}, options, {
	host, protocol, port
});

export default {
	method: [
		'GET', 'POST', 'PUT',
		'DELETE', 'PATCH', 'OPTIONS'
	],
	path: '/api/{path*}',
	handler: {proxy: handler}
};