import {Model} from 'objection';
import {Person, Location} from './index.js';

/**
 * A common format for sale information. This can be used for tickets,
 * things we sell, or logs of things we purchased.
 * @alias module:app/models.Sale
 * @property {Date} [orderDate]
 * @property {Date} [deliveryDate] - when the product was delivered/arrived
 * @property {string} [customerId] - the buyer (can be ourselves)
 * @property {string} [deliveryLocation] - reference to the delivery location
 * @property {number} [quantity=1] 
 * @property {number} [price] 
 * @property {number} [discount], as set value (not a percentage)
 * @property {number} [tax], as set value (not a percentage)
 * @property {string} [notes]
 * @property {number} [budgetLineNumber]
 */
export default class Sale extends Model {
	static get tableName() {return 'Sale'}
	static get label() {return 'sales'}

	static get relationMappings() {
		return {
			/** 
			 * Refers to the customer who purchased an item in this sale. 
			 * A possible buyer is ourself, in which case this sale is a purchase
			 * rather than a sale to someone else. 
			 * @memberof! module:app/models.Sale#
			 * @type {module:app/models.Person}
			 */
			customer: {
				relation: Model.OneToOneRelation,
				modelClass: Person,
				join: {
					from: 'Sale.customerId',
					to: 'Person.id'
				}
			},
			/**
			 * Represents the location this item was delivered to. 
			 * @todo find a way to allow for custom locations
			 * @memberof! module:app/models.Sale#
			 * @type {module:app/models.Location}
			 */
			deliveryLoc: {
				relation: Model.OneToOneRelation,
				modelClass: Location,
				join: {
					from: 'Sale.deliveryLocation',
					to: 'Location.id'
				}
			}
		}
	}
}

/**
 * A Grant uses sale data to represent the monentary values.
 * @extends Sale
 * @property {string} grantName
 */
export class Grant extends Sale {
	static get tableName() {return 'Grant'}
	static get label() {return 'grants'}
}