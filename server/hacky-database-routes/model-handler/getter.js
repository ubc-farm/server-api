import {
	transformReply, getBooleanQuery,
	arrayToObjectMap, removeNullandUndef,
} from './utils.js';

export default function getter(route, options) {
	const Model = options.model;
	return function getHandler(request, reply) {
		const { id, property } = request.params;
		const { array, clean = true } = getBooleanQuery(request.query);

		let query = Model.query();
		if (id) {
			query = query
				.findById(id)
				.then(item => {
					if (property) return item[property];
					return item;
				});
		} else {
			if (!array) {
				query = query.then(list => arrayToObjectMap(list, Model.idColumn));
			}
			if (clean) {
				query = query.then(data => removeNullandUndef(data));
			}
		}

		return transformReply(query, request, reply);
	};
}
