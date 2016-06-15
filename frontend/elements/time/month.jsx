import React, { Component, PropTypes } from 'react';
import calendarArray from 'calendar/array.js';
import {months} from 'calendar/monthnames.js';
import _ from '../classnames.js';
import ArrowButton from '../form/arrow-button.js';
import DateIcon from './month-icon.js';

/**
 * A single month view. Multiple can be combined to pageinate
 * or display in a row.
 */
export default function Month(props) {
	let today = props.today, todayDate;
	if ((today.getFullYear() === props.month.getFullYear()) 
	&& (today.getMonth() === props.month.getMonth())) {
		todayDate = today.getDate();
	}

	function onDayClick(day) {
		props.onClick(day);
	}
	
	let rows = calendarArray(props.month).map((week, i) => {
		let blankKeys = 100;
		return (
			<tr className='cal-week' key={'calendar-week-' + i}>
				{week.map(day => {
					return <DateIcon 
						onClick={onDayClick.bind(null, day)} 
					  key={day > 0 ? 'calendar-day-' + day : blankKeys++}
						viewing={todayDate && props.month.getDate() === day}
					  isToday={todayDate === day}>
						{day}
					</DateIcon>;
				})}
			</tr>
		);
	})

	return (
		<table className='small-calendar'>
			<caption className='month-heading'>
				<ArrowButton dir='left'/>
				{months[props.month.getMonth()]}
				<ArrowButton dir='right'/>
			</caption>
			<thead>
				<tr className='week-title'>
					<th scope="col">S</th>
					<th scope="col">M</th>
					<th scope="col">T</th>
					<th scope="col">W</th>
					<th scope="col">T</th>
					<th scope="col">F</th>
					<th scope="col">S</th>
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}
Month.propTypes = {
	month: PropTypes.instanceOf(Date).isRequired,
	onClick: PropTypes.func,
	today: PropTypes.instanceOf(Date)
}
Month.defaultProps = {
	onClick: day => {},
	today: new Date()
}