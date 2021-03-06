import { Model } from 'objection';
import Task from './task.js';
import { Crop } from '../index.js';

/**
 * Shared properties for scouting tasks, mainly used for historical data
 * @extends Task
 * @property {string} cropId
 */
export default class Scouting extends Task {
	static get tableName() { return 'Scouting'; }
	static get label() { return 'scouting'; }

	static get jsonSchema() {
		return Object.assign(super.jsonSchema, {
			cropId: { type: 'integer' },
		});
	}

	static get relationMappings() {
		return Object.assign({
			/**
			 * The crop that the scouting is related to
			 * @memberof! Scouting#
			 * @type {Crop}
			 */
			crop: {
				relation: Model.BelongsToOneRelation,
				modelClass: Crop,
				join: {
					from: 'Scouting.cropId',
					to: 'Crop.id',
				},
			},
		}, super.relationMappings);
	}
}

/**
 * Data for scouting a harvest
 * @extends Scouting
 * @property {Date} [newExpectedHarvest]
 * @property {number} [newPredictedYield]
 */
export class ScoutHarvest extends Scouting {
	static get tableName() { return 'ScoutHarvest'; }
	static get label() { return 'scouting-harvest'; }

	static get jsonSchema() {
		return Object.assign(super.jsonSchema, {
			newExpectedHarvest: { type: 'integer' },
			newPredictedYield: { type: 'integer' },
		});
	}
}

/**
 * Data for scouting pests in the crop
 * @extends Scouting
 * @property {string} [pestType]
 * @property {string} [affectedSpot]
 * @property {string} [pestName]
 * @property {string} [pestNameLatin]
 * @property {number} [percentAreaAffected]
 * @property {number} [percentPlantsAffected]
 * @property {number} [economicThreshold]
 */
export class ScoutPest extends Scouting {
	static get tableName() { return 'ScoutPest'; }
	static get label() { return 'scouting-pests'; }
}
