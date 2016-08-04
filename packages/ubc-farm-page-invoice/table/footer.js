import {connect} from 'react-redux';
import {price} from '../columnlist.js';
import {moneyTransformer} from '../store/calculate-money.js';
import {setAmountPaid} from '../store/actions.js';
import Footer from './footer-base.js';

export default connect(
	({data, columns, amountPaid}) => ({
		data, columns, amountPaid,
		totalColumn: price
	}),
	dispatch => ({
		onAmountChange: value => {
			value = moneyTransformer(value);
			return dispatch(setAmountPaid(value));
		}
	})
)(Footer)