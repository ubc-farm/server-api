//import google from 'google/maps/edit';

const gridlineOptions = {
	geodesic: true,
	strokeColor: '#fff',
	strokeOpacity: 0.7,
	zIndex: 5,
	/*icons: [{
		icon: {
			path: 'M 0,-1 0,1',
			strokeOpacity: 0.7,
			scale: 4
		},
		offset: '0',
		repeat: '20px'
	}]*/
}

/**
 * Returns a endpoint from the start to the edge of the container
 * @param {LatLng} start position
 * @param {number} heading
 * @param {Polygon} container - polygon to stay within
 * @param {number} [rate=1] - how often to check that the line is within the container
 */
export function growLine(start, heading, container, rate = 1.0) {
	let complete = false, distance = rate, end;
	while (!complete) {
		end = google.maps.geometry.spherical
			.computeOffset(start, distance, heading);
		if (!google.maps.geometry.poly.containsLocation(end, container)) {
			complete = true;
		}
		distance += rate;
	}
	return end;
}

/** Converts angle (0 to 360) to heading (-180 to 180) */
export function angleToHeading(angle) {
	angle = angle % 360;
	if (angle <= 180) return angle;
	else return angle - 360;
}

/** Converts heading (-180 to 180) to angle (0 to 360) */
export function headingToAngle(heading) {
	if (heading >= 0) return heading;
	else return heading + 360; 
}

/**
 * Checks if path is clockwise or counterclockwise
 * @param {LatLngLiteral[]} path
 * @returns {boolean} true if clockwise, false if counterclockwise
 * @see http://stackoverflow.com/questions/1165647
 */
export function clockwisePath(path) {
	if (path instanceof google.maps.MVCArray) path = path.getArray();
	let sum = 0, length = path.length;
	
	for (let i = 0; i < length; i++) {
		let [index, next] = [i, i+1].map(v => v % length);
		let [point1, point2] = [path[index], path[next]].map(value => {
			if (value instanceof google.maps.LatLng) {
				return value.toJSON();
			}
		});
		
		sum += (point2.lng - point1.lng) * (point2.lat + point1.lat);
	}
	
	return (sum > 0);
}

export class Grid {
	
	/**
	 * @param {Field} field
	 * @param {number} rowSize
	 * @param {number} columnSize
	 */
	constructor(field, rowsize, columnsize) {
		this.container = field.polygon;
		this.field = field;
		this.clockwise = clockwisePath(field.polygon.getPath().getArray());
		this.baseline = field.getLine(0);
		this.edgeIndex = 0;
		this.rowSize = rowsize;
		this.columnSize = columnsize;
		this.rowValues = [];
		this.columnValues = [];
		
		this.buildColumns();
	}
	
	/** Get array representing widths of each row */ 
	get rows() {
		let base = this.rowSize;
		return this.rowValues.map(value => {
			if (value == null) return base;
			else return value;
		})
	}
	
	/**
	 * Sets specific widths for a row, depending on the type given.
	 * Arrays overwrite the existing rowValue array, using the array's index
	 * as the key. Objects do the same, using the property as the key.
	 * Setting false will clear out all the rowValues, leaving just the base size.
	 * Setting just a number will change the base size.
	 * @param {number[]|Object|boolean|number} value
	 */
	set rows(value) {
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				if (value[i] != null) this.rowValues[i] = value[i];
			}
		} else if (value === Object(value)) {
			for (let prop in value) {
				this.rowValues[parseInt(prop)] = value[prop]
			}
		} else if (value === false) {
			this.rowValues.map(() => null);
		} else {
			this.rowSize = value;
		}
	}
	
	/** Get array representing widths of each column */ 
	get columns() {
		let base = this.columnSize;
		return this.columnValues.map(value => {
			if (value == null) return base;
			else return value;
		})
	}
	
	/**
	 * Sets specific widths for a column, depending on the type given.
	 * Arrays overwrite the existing columnValue array, using the array's index
	 * as the key. Objects do the same, using the property as the key.
	 * Setting false will clear out all the columnValue, leaving just the 
	 * base size. Setting just a number will change the base size.
	 * @param {number[]|Object|boolean|number} value
	 */
	set columns(value) {
		if (Array.isArray(value)) {
			for (let i = 0; i < value.length; i++) {
				if (value[i] != null) this.columnValues[i] = value[i];
			}
		} else if (value === false) {
			this.columnValues.map(() => null);
		} else {
			this.columnSize = value;
		}
	}
	
	/**
	 * Gets a heading perpendicular to the baseline
	 */
	perpendicularHeading() {
		let baseHeading = google.maps.geometry.spherical
			.computeHeading(this.baseline[0], this.baseline[1]);
		let angleShift = this.clockwise? 90 : -90;
		
		return angleToHeading(headingToAngle(baseHeading) + angleShift);
	}
	
	/**
	 * Create lines perpendicular to the baseline, stemming from it
	 * @returns {MVCArray<LatLng>}
	 */
	buildColumns() {
		let [start, end] = this.baseline;
		let length = google.maps.geometry.spherical
			.computeDistanceBetween(start, end);
		let heading = this.perpendicularHeading();
		
		let options = gridlineOptions;
		options.map = this.container.getMap();
		
		let index = 0, offset = 0, lines = [];
		while (offset < 1) {
			let point = google.maps.geometry.spherical.interpolate(start, end, offset)
			console.log(point.toJSON());
			
			options.path = [point, growLine(point, heading, this.container)];
			console.log(options.path);
			lines.push(new google.maps.Polyline(options))
			
			let nextDistance = this.columns[index];
			if (nextDistance == null) nextDistance = this.columnSize;
			offset += nextDistance / length; index++;
		}
	}
}