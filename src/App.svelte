<script>
	import AggregateManager from "./components/AggregateManager.svelte";
	// import ProjectionManager from "./components/ProjectionManager.svelte";
	import EventExplorer from "./components/EventExplorer.svelte";
	import EventBus from "./lib/vertx-eventbus.js";
	import Textfield from "@smui/textfield";
	import Icon from "@smui/textfield/icon";
	import HelperText from "@smui/textfield/helper-text";
	import {
		NotificationDisplay,
		notifier,
	} from "@beyonk/svelte-notifications";
	import Tab, { Label } from "@smui/tab";
	import TabBar from "@smui/tab-bar";
	import Button from "@smui/button";
	import Paper, { Content } from "@smui/paper";
	import { JSONSchemaFaker } from "json-schema-faker";
	let active = "Connect";
	let es4jConnectionString = "http://localhost:8080";
	let eventBus;
	let n;
	let aggregate = "";
	let tenant = "default";
	let cmdSchemas = {};
	let eventTypes = [];

	import Dialog, { Title, Actions } from "@smui/dialog";

	let open = true;
	let response = "Nothing yet.";

	async function connectToEventbus(connectionString) {
		eventBus = new EventBus(connectionString + "/eventbus");
		eventBus.enableReconnect(true);
		eventBus.onerror = function (error) {
			notifier.danger("EventBus Error:" + JSON.stringify(error), 1000);
		};
		eventBus.onclose = function () {
			notifier.danger("EventBus Closed", 1000);
			open = true;
		};
		eventBus.onopen = function () {
			notifier.info("Eventbus Connected", 1000);
			eventBus.send(
				"/" + aggregate + "/" + "available-types",
				"",
				null,
				function (error, message) {
					if (error) {
						notifier.danger(
							"unable to fetch types for aggregate :" + error,
							2000
						);
					}
					
					eventTypes = message.body.events;
					cmdSchemas = message.body.commandSchemas;
					replaceSchemas(cmdSchemas);
					active = "Aggregate Manager";
					open = false;
				}
			);
		};
	}

	function replaceSchemas(obj) {
		for (let key in obj) {
			obj[key] = JSON.stringify(
				JSONSchemaFaker.generate(obj[key]),
				null,
				2
			);
		}
	}
</script>

<NotificationDisplay bind:this={n} />
<div class="custom-dialog">
	<Dialog
		bind:open
		scrimClickAction=""
		escapeKeyAction=""
		aria-labelledby="mandatory-title"
		aria-describedby="mandatory-content"
	>
		<Title id="mandatory-title">Es4j Manager</Title>
		<div class="dialog-content-wrapper">
			<Content id="mandatory-content">
				<div class="textfield-container">
					<Textfield
						bind:value={es4jConnectionString}
						label="Es4j connection"
					>
						<HelperText slot="helper">
							<p>
								Es4j connection string, default is
								http://localhost:8080
							</p>
						</HelperText>
					</Textfield>
				</div>
				<div class="textfield-container">
					<Textfield bind:value={tenant} label="Tenant">
						<HelperText slot="helper">
							<p>
								Your tenant name, if you don't have one, use
								default
							</p>
						</HelperText>
					</Textfield>
				</div>
				<div class="textfield-container">
					<Textfield bind:value={aggregate} label="Aggregate">
						<HelperText slot="helper">
							<p>
								Your aggregate class kebab cased like
								AccountPortfolio translates to account-portfolio
							</p>
						</HelperText>
					</Textfield>
				</div>
				<Button
					variant="unelevated"
					color="primary"
					raised
					on:click={() => connectToEventbus(es4jConnectionString)}
				>
					Connect
				</Button>
			</Content>
		</div>
	</Dialog>
</div>

<div>
	<TabBar
		tabs={[
			"Aggregate Manager",
			"Event Explorer",
			"Projection Manager",
			"Business Rules",
			"Cluster State",
		]}
		let:tab
		bind:active
	>
		<Tab {tab}>
			<Label>{tab}</Label>
		</Tab>
	</TabBar>
	{#if active === "Aggregate Manager"}
		<Paper variant="unelevated">
			<Content>
				<AggregateManager
					bind:eventBus
					bind:aggregate
					bind:tenant
					bind:cmdSchemas
				/>
			</Content>
		</Paper>
	{:else if active === "Event Explorer"}
		<Paper variant="unelevated">
			<Content>
				<EventExplorer
					bind:eventBus
					bind:aggregate
					bind:tenant
					bind:eventTypes
				/>
			</Content>
		</Paper>
		<!-- {:else if active === "Projection Manager"}
		<Paper variant="unelevated">
			<Content>
				<ProjectionManager bind:eventBus bind:aggregate bind:tenant />
			</Content>
		</Paper> -->
	{/if}
</div>

<style>
	.custom-dialog {
		width: 60%; /* adjust the width of the dialog */
		max-width: 600px; /* set max width */
		border-radius: 50px; /* round the edges */
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
