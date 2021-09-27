<script>

	/* imports */
	import DateFunc from '../../js/DateFunc.js';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	function emitEditDay(date) {
		dispatch('editDay', {date: date});
	}

	function emitToggleAttendance(person) {
		dispatch('toggleAttendance', {person: person});
	}

	/* props */
	export let today;
	// const today = new Date(1609473219000);
	// console.log(today.getTimezoneOffset() * 60 * 1000);
	export let getPersonal;
	export let dateSelected;
	$: console.log('from table', dateSelected)
	



	/* Date / Fecha */

	/*function getCurrentDate(horaLocal = true) {
		// getDay == 0 ? Sunday (Domingo)
		// getMonth == 0 ? January (Enero)
		if (horaLocal) {
			return {
				day: today.getDay(),
				day_string: today.toLocaleString('es-mx', {  weekday: 'long' }),
				date: today.getDate(),
				month: today.getMonth()+1,
				month_string: today.toLocaleString('es-mx', {  month: 'long' }),
				year: today.getFullYear()
			}
		} else {
			return {
				day: today.getUTCDay(),
				day_string: today.toString('es-mx', {  weekday: 'long' }),
				date: today.getUTCDate(),
				month: today.getUTCMonth()+1,
				month_string: today.toString('es-mx', {  month: 'long' }),
				year: today.getUTCFullYear()
			}
		}
	}*/

	function getWeek(dateObj = DateFunc.formattedToDate(today) ) {

		const day = dateObj.getDay();
		const msDay = 24 * 60 * 60 * 1000;
		const sunday = dateObj - (day * msDay);
		const week = [];
		
		for (let d = 0; d < 7; d++) {
			const wd = new Date( sunday + ( (d * msDay) + DateFunc.paddingForTimezoneShift ) )
			week.push( {
				epoch: wd.getTime(),
				year: wd.getFullYear(),
				month: wd.getMonth()+1,
				date: wd.getDate(),
				day_string: wd.toLocaleString('es-mx', {  weekday: 'long' }),
				formatted: DateFunc.formatDate(wd)
			} );
		}

		return week;
	}

	$: week = getWeek( dateSelected == '' ? undefined : DateFunc.formattedToDate(dateSelected) );

</script>

<table>
	<thead>
		<tr>
			<th rowspan="2">
				#
			</th>
			<th rowspan="2">
				Tipo
			</th>
			<th rowspan="2">
				Nombre
			</th>
			{#each week as wday}
				<th>
					{wday.day_string}
				</th>
			{/each}
		</tr>
		<tr>
			{#each week as wday}
				<th>
					<button type="button" class:today={wday.formatted == today} on:click={() => { emitEditDay(wday.formatted); }}>{wday.formatted}</button>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#await getPersonal}
			<div>loading...</div>
		{:then personal} 
			{#each personal.staff as persona, index}
			<tr>
				<td>
					{index+1}
				</td>
				<td>
					{persona.type}
				</td>
				<td>
					{persona.name}
				</td>
				
				{#each week as wday}
					<td class="date-td" class:did={persona.attended === true} class:didnot={persona.attended === false}>
						{#if wday.formatted == today}
							<button
								type="button"
								class="today"
								class:did={persona.attended === true}
								class:didnot={persona.attended === false}
								on:click={ () => { emitToggleAttendance(persona); }}
							>
								{#if persona.attended === true}
									✔
								{:else if persona.attended === false}
									❌
								{:else}
									...
								{/if}
							</button>
						{:else}
							<span>
								{#if persona.attended === true}
									✔
								{:else if persona.attended === false}
									❌
								{:else}
									?
								{/if}
							</span>
						{/if}
					</td>
				{/each}
				
			</tr>
			{/each}
		{/await}
		
	</tbody>
</table>

<style>
	table {
		background-color: var(--bg_modal);
		transition: background-color 0.25s cubic-bezier(.08,.82,.17,1) 0s;
	}

	table thead {
		color: var(--emphasis);
	}

	.today {
		box-shadow: /* inset */ var(--default-shadow);
	}

	.did {
		background-color: var(--emphasis);
	}
	
	.didnot {
		background-color: var(--red);
	}

	button.did {
		border-color: var(--emphasis);
		background-color: white;
	}
	
	button.didnot {
		border-color: var(--red);
		background-color: white;
	}

	.date-td {
		border-radius: 2px;
		text-align: center;
	}

	.date-td button {
		width: 100%;
	}

</style>