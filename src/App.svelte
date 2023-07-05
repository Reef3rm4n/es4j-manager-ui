<script>
	import AggregateManager from "./components/AggregateManager.svelte";
	import ProjectionManager from "./components/ProjectionManager.svelte";
	import EventExplorer from "./components/EventExplorer.svelte";
	import EventBus from "./lib/vertx-eventbus.js";
	import { slide } from "svelte/transition";
	import {
		NotificationDisplay,
		notifier,
	} from "@beyonk/svelte-notifications";

	let currentPage = "home";
	let es4jConnectionString = "http://localhost:8080";
	let eventBus;
	let isConnected = false;
	let n;
	let aggregate;
	let tenant = "default";
	function navigateTo(pageId) {
		currentPage = pageId;
	}

	function connectToEventbus(connectionString) {
		eventBus = new EventBus(connectionString + "/eventbus");
		eventBus.enableReconnect(true);
		eventBus.onerror = function (error) {
			notifier.danger("EventBus Error:" + JSON.stringify(error), 1000);
		};
		eventBus.onclose = function () {
			notifier.danger("EventBus Closed", 1000);
			isConnected = false;
			navigateTo("home");
		};
		eventBus.onopen = function () {
			isConnected = true; // <-- Set isConnected to true
			notifier.info("Eventbus Connected", 1000);
			navigateTo("aggregate-manager");
		};
	}
</script>

<NotificationDisplay bind:this={n} />

<div class="container">
	{#if isConnected}
		<div
			class="sidebar"
			class:hide={currentPage === "home"}
			in:slide={{ duration: 300 }}
			out:slide={{ duration: 300 }}
		>
			<ul>
				<li>
					<button
						class:selected={currentPage === "aggregate-manager"}
						on:click={() => navigateTo("aggregate-manager")}
					>
						Aggregate Manager
					</button>
				</li>
				<li>
					<button
						class:selected={currentPage === "projection-manager"}
						on:click={() => navigateTo("projection-manager")}
					>
						Projection Manager
					</button>
				</li>
				<li>
					<button
						class:selected={currentPage === "event-explorer"}
						on:click={() => navigateTo("event-explorer")}
					>
						Event Explorer
					</button>
				</li>
			</ul>
		</div>
	{/if}
	<div class="content">
		{#if currentPage === "home"}
			<div class="home">
				<label for="es4j-connection-string">es4j connection:</label>
				<input
					type="text"
					id="es4j-connection-string"
					bind:value={es4jConnectionString}
					placeholder="http://localhost:8080"
				/>
				<input
					type="text"
					id="aggregate"
					bind:value={aggregate}
					placeholder="account-portfolio"
				/>
				<input
					type="text"
					id="tenant"
					bind:value={tenant}
					placeholder="default"
				/>
				<button on:click={() => connectToEventbus(es4jConnectionString)}
					>Submit</button
				>
			</div>
		{/if}
		{#if currentPage === "aggregate-manager"}
			<AggregateManager bind:eventBus bind:aggregate bind:tenant />
		{/if}
		{#if currentPage === "projection-manager"}
			<ProjectionManager bind:eventBus bind:aggregate bind:tenant />
		{/if}
		{#if currentPage === "event-explorer"}
			<EventExplorer bind:eventBus bind:aggregate bind:tenant />
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		height: 100vh;
		background-color: #f3f4f6;
	}

	/* Updated Sidebar Styles */
.sidebar {
    background-color: #1e3d58;
    color: #ffffff;
    padding: 20px;
    display: inline-block;
    height: 100vh;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    width: auto;
    list-style: none;
    overflow-y: auto;
    border-radius: 15px 0px 0px 15px; /* Add rounded corners to the sidebar */
    border-right: 1px solid rgba(255, 255, 255, 0.1); /* Optional - Adds a slight border on the right */
}
.sidebar ul {
    list-style-type: none;
    padding-left: 0;
}

.sidebar button {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    padding: 10px 15px;
    border: none;
    background-color: transparent;
    border-radius: 20px;
    text-align: left;
    transition: all 0.3s ease;
    display: block;
    width: 100%;
    text-align: center;
}

.sidebar button:hover, .sidebar button.selected {
    background-color: #3d5a80;
    transform: scale(1.05);
}

/* Selected button state */
.sidebar .selected {
    background-color: #3d5a80;
}


	/* Content styles */
	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
	}

	/* Home page styles */
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		height: 100vh;
	}

	.home label {
		font-weight: bold;
		margin-bottom: 10px;
		color: #333;
	}

	.home input {
		padding: 12px;
		border-radius: 8px;
		border: 1px solid #ccc;
		margin-bottom: 16px;
		width: 280px;
	}

	.home button {
		padding: 12px 20px;
		border-radius: 8px;
		border: none;
		background-color: #2c3e50; /* navy blue */
		color: #fff;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.home button:hover {
		background-color: #34495e; /* dark navy blue */
	}

	/* Component styles */
	.component {
		background-color: #fff;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.component h3 {
		margin-top: 0;
		color: #2c3e50; /* navy blue */
	}

	.component input,
	.component select,
	.component textarea {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.component button {
		padding: 10px 20px;
		background-color: #2c3e50; /* navy blue */
		border: none;
		color: #fff;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.component button:hover {
		background-color: #34495e; /* dark navy blue */
	}
</style>
