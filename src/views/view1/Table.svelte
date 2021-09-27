<script>

	/* imports */
	import { onMount, createEventDispatcher } from 'svelte';
	import DateFunc from '../../js/DateFunc.js';
	
	import vigente from '../../data_fake.js';
	
	
	
	/* life cycle */
	onMount(fetchData);
	
	
	
	/* emitters */
	const dispatch = createEventDispatcher();

	function emitEditDay(date) {
		dispatch('editDay', {date: date});
	}



	/* props */
	export let today;
	export let dateSelected;



	/* fetch data */
	let staffPromise = new Promise( ()=>{} );
	let staff = {};

	function fetchData() {
		setTimeout( () => {
			staffPromise = Promise.resolve();
			staff = shiftStaffData(vigente);
		} , 1500);
	}



	function shiftStaffData(staffData) {
		const staff = {};

		// for each day
		for (const day in staffData) {
			const dayStaff = staffData[day].staff;
			
			// for each staff member
			for (const person of dayStaff) {
				if (staff[person.name] === undefined) {
					staff[person.name] = {};
				}

				staff[person.name][day] = {};
				staff[person.name][day].type = person.type;
				staff[person.name][day].active = person.active;
				staff[person.name][day].attended = person.attended;
				staff[person.name][day].details = person.details;
			}
		}
		
		console.log(staff);
		return staff;
	}



	/* toggle staff attendance */
	function toggleStaffAttendance(staffDate) {

		if (staffDate === undefined) {

		}
		
		switch (staffDate.attended) {
			case true:
				staffDate.attended = false;
				break;
		
			case false:
				staffDate.attended = null;
				break;
				
			default:
				staffDate.attended = true;
				break;
		}

		staff = staff;

	}

	function registerToday(staffMemberName) {

		if (staff[staffMemberName] === undefined) {
			staff[staffMemberName] = {};
		}

		staff[staffMemberName][today] = {};
		staff[staffMemberName][today].type = staff[staffMemberName].last.type;
		staff[staffMemberName][today].active = true;
		staff[staffMemberName][today].attended = true;
		staff[staffMemberName][today].details = {};

		console.log(staff[staffMemberName]);

	}
	



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
		const sunday = dateObj - (day * DateFunc.msDay);
		const week = [];
		
		for (let d = 0; d < 7; d++) {
			const wd = new Date( sunday + ( (d * DateFunc.msDay) + DateFunc.paddingForTimezoneShift ) )
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
		{#await staff}
		<div>loading...</div>
		{:then staffLog}
			{#each Object.entries(staffLog) as [staffMember, memberDays], memberIndex (staffMember) }
			<tr>
				<td>
					{memberIndex+1}
				</td>
				<td>
					{staffMember.type}
				</td>
				<td>
					{staffMember}
				</td>
				
				{#each week as wday}
					{#if wday.formatted == today}
						<td class="date-td">
							<button
								type="button"
								class="today"
								class:did={ memberDays[today] !== undefined && memberDays[today].attended === true }
								class:didnot={ memberDays[today] !== undefined && memberDays[today].attended === false }
								on:click={ () => { memberDays[today] ? toggleStaffAttendance(memberDays[today]) : registerToday(staffMember) }}
							>
								{#if memberDays[today] !== undefined && memberDays[today].attended === true}
									✔
								{:else if memberDays[today] !== undefined && memberDays[today].attended === false}
									❌
								{:else}
									...
								{/if}
							</button>
						</td>
					{:else if memberDays[wday.formatted] !== undefined}
						<td class="date-td" class:did={memberDays[wday.formatted].attended === true} class:didnot={memberDays[wday.formatted].attended === false}>
							<span>
								{#if memberDays[wday.formatted].attended === true}
								✔
								{:else if memberDays[wday.formatted].attended === false}
								❌
								{:else}
								?
								{/if}
							</span>
						</td>
					{:else}
						<td class="date-td">
							<!-- <span>x</span> -->
						</td>
					{/if}
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