<script>

	/* imports */
	import DateFunc from '../../js/DateFunc.js';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	/* props */
	export let today;
	
	
	
	let dateSelected = today;

	function onChange(value) {
		return new Promise( (resolve, reject) => {
			resolve(value)
		} );
	}

	$: onChange(dateSelected)
		.then(emitDateSelect);

	function emitDateSelect() {
		dispatch('dateSelect', {date: dateSelected});
	}

	function shiftDate(offsetInDays) {

		const dateSelectedDateObj = DateFunc.formattedToDate(dateSelected);
		
		const msDay = 24 * 60 * 60 * 1000;
		const offset = (msDay * offsetInDays) + DateFunc.paddingForTimezoneShift;
		
		dateSelected = DateFunc.formatDate( new Date( dateSelectedDateObj.getTime() + offset) );
	}

	
</script>

<div class="date-nav">
	<button type="button" on:click={() => { shiftDate(-7) }}>◀</button>
	<input type="date" bind:value={dateSelected}>
	<button type="button" on:click={() => { shiftDate(7) }}>▶</button>
</div>

<style>
	.date-nav {
		display: flex;
	}
</style>