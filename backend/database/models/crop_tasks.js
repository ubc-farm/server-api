import {Model} from 'objection';
import Task from './task.js';

import {Crop} from './field.js';
import {Plant, Item} from './reference.js';

export class Seeding extends Task {
	static get tableName() {return 'Seeding'}

	static get relationMappings() {
		return Object.assign({
			seeded: {
				relation: Model.OneToOneRelation,
				modelClass: Crop,
				join: {
					from: 'Seeding.crop',
					to: 'Crop.id'
				}
			},
			seedVariety: {
				relation: Model.OneToOneRelation,
				modelClass: Plant,
				join: {
					from: 'Seeding.variety',
					to: 'Plant.id'
				}
			},
			seedProduct: {
				relation: Model.OneToOneRelation,
				modelClass: Item,
				join: {
					from: 'Seeding.product',
					to: 'Item.id'
				}
			}
		}, super.relationMappings);
	}
}

export class ScoutHarvest extends Task {
	static get tableName() {return 'ScoutHarvest'}

	static get relationMappings() {
		return Object.assign({
			crop: {
				relation: Model.OneToOneRelation,
				modelClass: Crop,
				join: {
					from: 'ScoutHarvest.cropId',
					to: 'Crop.id'
				}
			}
		}, super.relationMappings);
	}
}

export class ScoutPest extends Task {
	static get tableName() {return 'ScoutPest'}

	static get relationMappings() {
		return Object.assign({
			crop: {
				relation: Model.OneToOneRelation,
				modelClass: Crop,
				join: {
					from: 'ScoutPest.cropId',
					to: 'Crop.id'
				}
			}
		}, super.relationMappings);
	}
}