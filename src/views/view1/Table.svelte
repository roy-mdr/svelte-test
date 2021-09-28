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

	function emitUpdateApiDataStaff(apiData) {
		dispatch('updateApiDataStaff', apiData);
	}



	/* props */
	export let today;
	export let dateSelected;
	export let apiDataStaff;



	/* computed */
	$: staffTable = transposeStaffData(apiDataStaff);
	$: week = getWeek( dateSelected == '' ? undefined : DateFunc.formattedToDate(dateSelected) );



	/* fetch data */

	function fetchData() {
		setTimeout( () => {
			emitUpdateApiDataStaff(vigente);
		} , 1500);
	}



	function transposeStaffData(staffData) {
		
		const staff = {};

		// for each day
		for (const day in staffData) {
			
			if (day != 'last') {
				const dayStaff = staffData[day].staff;

				// for each staff member
				for (const person in dayStaff) {
					if (staff[person] === undefined) {
						staff[person] = {};
					}

					staff[person][day]          = {};
					staff[person][day].type     = dayStaff[person].type;
					staff[person][day].active   = dayStaff[person].active;
					staff[person][day].attended = dayStaff[person].attended;
					staff[person][day].details  = dayStaff[person].details;
				}
			}
			
		}
		
		return staff;

	}

	



	/* toggle staff attendance */
	function toggleStaffAttendance(memberName, formattedDate) {

		let member = apiDataStaff[formattedDate]?.staff[memberName];
		
		if (member === undefined) {
			
			// registerMemberInDay(memberName, formattedDate); // register day and member
			
			setTodayFromLastDay(); // import data to today

			member = apiDataStaff[formattedDate]?.staff[memberName];
			
		}

		switch (member.attended) {
			case true:
				member.attended = false;
				break;
		
			case false:
				member.attended = null;
				break;
				
			default:
				member.attended = true;
				break;
		}
		

		apiDataStaff = apiDataStaff;

		emitUpdateApiDataStaff(apiDataStaff);

	}

	function setTodayFromLastDay() {

		// duplicate last record
		if (apiDataStaff[today] === undefined) {
			apiDataStaff[today] = {
				date_registered: true,
				date_rest: false,
				staff: apiDataStaff.last.staff
			}
		}

		// reset daily fields
		for (const member in apiDataStaff[today].staff) {
			apiDataStaff[today].staff[member].attended = null,
			apiDataStaff[today].staff[member].details  = {}
		}
	}

	function registerMemberInDay(memberName, formattedDate) {

		if (apiDataStaff[formattedDate] === undefined) {
			apiDataStaff[formattedDate] = {
				date_registered: true,
				date_rest: false,
				staff: {}
			}
		}

		if (apiDataStaff[formattedDate].staff[memberName] === undefined) {
			apiDataStaff[formattedDate].staff[memberName] = {
				type: apiDataStaff.last.staff[memberName].type,
				active: apiDataStaff.last.staff[memberName].active,
				attended: null,
				details: {}
			}
		}

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
		{#await staffTable}
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
								on:click={ () => { toggleStaffAttendance(staffMember, today) }}
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