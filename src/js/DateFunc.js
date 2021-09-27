function formatDate(dateObj) {
	return `${String(dateObj.getFullYear()).padStart(4, '0')}-${String(dateObj.getMonth()+1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}

function formattedToDate(dateStr) {
	const datePart = dateStr.split('-');
	return new Date(datePart[0], datePart[1]-1, datePart[2]);
}

const paddingForTimezoneShift = 1 * 60 * 60 * 1000;

const msDay = 24 * 60 * 60 * 1000;



export default {
	formatDate: formatDate,
	formattedToDate: formattedToDate,
	paddingForTimezoneShift: paddingForTimezoneShift,
	msDay: msDay
}