import { Model } from 'objection';
import { Task, Sale, Location, Item } from './index.js';

/**
 * Represents an item in the inventory, with fields like the amount stored and
 * its location. While the table is named Equipment, this can also represent
 * other stored items like harvested crops or seeds.
 * @property {string} product - the type of item this equipment is
 * @property {string} location - where this equipment is stored
 * @property {number} [quantity]
 * @property {Date} [purchaseDate] - may be populated by purchase (Sale) info
 * @property {string} [description]
 */
export default class Equipment extends Model {
	static get tableName() { return 'Equipment'; }
	static get label() { return 'equipment'; }

	/** @type {Date} this equipment's date of purchase */
	get purchase() { return new Date(this.purchaseDate); }
	set purchase(date) { this.purchaseDate = date.getTime(); }

	static get jsonSchema() {
		return {
			type: 'object',
			properties: {
				id: { type: 'integer' },
				product: { type: 'integer' },
				description: { type: 'string' },
				quantity: { type: 'integer' },
				purchaseDate: { type: 'number' }, // milliseconds from enoch
				location: { type: 'integer' },
			},
		};
	}

	static get relationMappings() {
		return {
			/**
			 * Sale data related to this equipment
			 * @memberof! Equipment#
			 * @type {Sale[]}
			 */
			sales: {
				relation: Model.ManyToManyRelation,
				modelClass: Sale,
				join: {
					from: 'Equipment.id',
					through: {
						modelClass: EquipmentUsage,
						from: 'EquipmentUsage.equipment',
						to: 'EquipmentUsage.sellingUsage',
					},
					to: 'Sale.id',
				},
			},
			/**
			 * Tasks this equipment is being used for
			 * @memberof! Equipment#
			 * @type {Task[]}
			 */
			tasks: {
				relation: Model.ManyToManyRelation,
				modelClass: Task,
				join: {
					from: 'Equipment.id',
					through: {
						modelClass: EquipmentUsage,
						from: 'EquipmentUsage.equipment',
						to: 'EquipmentUsage.taskUsage',
					},
					to: 'Task.id',
				},
			},
			/**
			 * The location where this equipment is stored
			 * @memberof! Equipment#
			 * @type {Location}
			 */
			loc: {
				relation: Model.HasOneRelation,
				modelClass: Location,
				join: {
					from: 'Equipment.location',
					to: 'Location.id',
				},
			},
			/**
			 * The type of item this equipment is
			 * @memberof! Equipment#
			 * @type {Item}
			 */
			item: {
				relation: Model.BelongsToOneRelation,
				modelClass: Item,
				join: {
					from: 'Equipment.product',
					to: 'Item.id',
				},
			},
		};
	}
}

/**
 * A helper table for joining equipment to some usage
 */
export class EquipmentUsage extends Model {
	static get tableName() { return 'EquipmentUsage'; }

	static get relationMappings() {
		return {
			eqiupmentUsed: {
				relation: Model.OneToManyRelation,
				modelClass: Equipment,
				join: {
					from: 'EquipmentUsage.equipment',
					to: 'Equipment.id',
				},
			},
			forSelling: {
				relation: Model.OneToManyRelation,
				modelClass: Sale,
				join: {
					from: 'EquipmentUsage.sellingUsage',
					to: 'Sale.id',
				},
			},
			forTask: {
				relation: Model.OneToManyRelation,
				modelClass: Task,
				join: {
					from: 'EquipmentUsage.taskUsage',
					to: 'Task.id',
				},
			},
		};
	}
}
