<script>

	/* imports */
	import { onMount } from 'svelte';
	import './css/theme.css';
	import Datenav from './views/view1/Datenav.svelte';
	import Table from './views/view1/Table.svelte';
	import Usuarios from './views/view1/Usuarios.svelte';

	import vigente from './data_fake.js';



	/* life cycle */
	onMount(fetchData);



	/* theme */
	let darkTheme = false;

	function toggleTheme() {
		darkTheme = !darkTheme;
	}
	
	

	/* fetch data */
	let getPersonal = new Promise( ()=>{} );

	function fetchData() {
		setTimeout( () => {
			getPersonal = Promise.resolve(vigente);
		} , 1500);
	}


	function saveUsuarios(event) {
		getPersonal.then( (res) => {
			res.staff = event.detail;
			getPersonal = Promise.resolve(res);
		} )
	}



	/* modal usuarios */
	let modalEditDay = false;
	let editingDate = '';

	function openEditDay(ev) {
		editingDate = ev.detail.date;
		modalEditDay = true;
	}

	function closeEditDay() {
		modalEditDay = false;
	}



	/* toggle staff attendance */
	function toggleStaffAttendance(ev) {
		
		switch (ev.detail.person.attended) {
			case true:
				ev.detail.person.attended = false;
				break;
		
			case false:
				ev.detail.person.attended = null;
				break;
				
			default:
				ev.detail.person.attended = true;
				break;
		}

		getPersonal = getPersonal;

	}

</script>

<div id="app" class={darkTheme ? "dark-theme" : "light-theme"}>

	<button on:click={toggleTheme}>
		{#if darkTheme}
		Light Theme
		{:else}
		Dark Theme
		{/if}
	</button>
	<button>Agregar personal</button>

	<Datenav></Datenav>

	<Table
		{getPersonal}
		on:editDay={openEditDay}
		on:toggleAttendance={toggleStaffAttendance}
	/>

	{#if modalEditDay}
	<Usuarios
		{editingDate}
		{getPersonal}
		on:save={saveUsuarios}
		on:close={closeEditDay}
	/>
	{/if}
</div>

<style>

	:global(#app) {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: var(--bg_main);
		padding: 1em;
		transition: background-color 0.25s cubic-bezier(.08,.82,.17,1) 0s;
	}

	button {
		color: var(--emphasis);
	}
</style>