<script>
	import { createEventDispatcher } from 'svelte';
	import Modal from '../../components/Modal.svelte';

	let emphasisColor = "var(--emphasis)";
	
	const dispatch = createEventDispatcher();
	function emitClose() {
		dispatch('close');
	}
	function emitSaveAndClose() {
		dispatch('save', staff);
		dispatch('close');
	}

	/* props */
	export let getPersonal;
	export let editingDate = '';

	let staff = [];
	let date = '';

	$: getPersonal.then( (gotData) => {
		staff = JSON.parse(JSON.stringify(gotData.staff));
		date = gotData.date;
	});

	function toggleAttendance(staffIndex) {

		switch (staff[staffIndex].attended) {
			case true:
				staff[staffIndex].attended = false;
				break;
		
			case false:
				staff[staffIndex].attended = null;
				break;
				
			default:
				staff[staffIndex].attended = true;
				break;
		}

	}
</script>

<Modal
	modalColor="{emphasisColor}"
	on:closeModal={emitSaveAndClose}
>
	
	<div class="card-editor" style="color: {emphasisColor}">
		Asistencias: {editingDate}
	</div>

	{#await getPersonal}
		<div>loading...</div>
	{:then} 
        <div class="card-seccion">
            <button>Rehabilitar personal registrado</button>
            <button>Marcar dia de descanso</button>
        </div>
		{#each staff as persona, index}
			<div class="card-seccion">
				<div
				class="customito"
				class:did="{persona.attended === true}"
				class:didnot="{persona.attended === false}"
				>
					<div
					class="customito_identity noselect"
					on:click="{ () => { toggleAttendance(index); }}"
					>
						<img src="a" alt="a" class="" />
						<div class="customito_name">
							<span class="contenido">{persona.name}</span>
							<span class="nota">
								{#if persona.attended === true}
								Asistencia
								{:else if persona.attended === false}
								Falta
								{:else}
								INDICAR
								{/if}
							</span>
						</div>
					</div>
					{#if persona.attended === true || persona.attended === false}
						<button type="button">Detail</button>
					{/if}
				</div>
			</div>
		{/each}
	{/await}

	<div class="card-action_buttons">
		<button type="button" class="aceptar" on:click={emitSaveAndClose}>ACEPTAR</button>
	</div>
</Modal>

<style>
	.customito {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.2);
		padding: 0.5em;
		transition: all 0.25s;
		cursor: pointer;
		border-left: 0 solid transparent;
	}
	.customito:hover {
		box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.2);
	}
	
	.customito.did {
		border-left: 5px solid var(--emphasis);
	}
	
	.customito.didnot {
		border-left: 5px solid var(--red);
	}
	
	.customito .customito_identity {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-grow: 1;
	}
	
	.customito .customito_identity * {
		cursor: pointer;
	}

	.customito .customito_identity img {
		width: 20px;
		height: 20px;
	}

	.customito .customito_identity > * {
		margin-right: 0.5em;
	}

	.customito .customito_identity .customito_name {
		display: flex;
		flex-direction: column;
	}

	.customito > button {
		margin: 0.5em;
	}
</style>