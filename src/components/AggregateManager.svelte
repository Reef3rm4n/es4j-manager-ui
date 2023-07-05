<script>
  // You can define your component's logic here
  import { NotificationDisplay, notifier } from "@beyonk/svelte-notifications";
  export let eventBus;
  export let aggregate;
  export let tenant;

  let commandType;
  let commandJson;
  let aggregateId;
  let aggregateState;

  $: {
    // Reactive statement to watch for changes in textareaContent
    if (aggregateState) {
      const textarea = document.getElementById("aggregateStateArea");
      if (textarea) {
        textarea.style.height = "auto"; // Reset height
        textarea.style.height = textarea.scrollHeight + "px"; // Set height to scrollHeight
      }
    }
  }
  // Function for handling subscription
  function handleSubscription() {
    eventBus.registerHandler(
      "/state-stream/" + aggregate + "/" + tenant + "/" + aggregateId,
      null,
      function (error, message) {
        if (error) {
          notifier.danger("Error in state stream:" + error, 2000);
        }

        aggregateState = JSON.stringify(message.body, null, 2);
      }
    );
    eventBus.registerHandler(
      "/event-stream/" + aggregate + "/" + tenant + "/" + aggregateId,
      null,
      function (error, message) {
        if (error) {
          notifier.danger("Error in event stream:" + error, 2000);
        } else {
          notifier.info(
            "Event Received:" + JSON.stringify(message.body, null, 2),
            2000
          );
        }
      }
    );
    issueCommand("load-aggregate", {
      aggregateId: aggregateId,
      tenant: tenant,
    });
  }

  // Function for handling command
  function handleCommand() {
    issueCommand(commandType, JSON.parse(commandJson));
  }
  function resizeTextarea(event) {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  }
  function issueCommand(cmdType, cmd) {
    eventBus.send(
      "/" + aggregate + "/" + cmdType,
      cmd,
      null,
      function (error, message) {
        if (error) {
          notifier.danger("command error :" + error, 2000);
        }
        aggregateState = JSON.stringify(message.body, null, 2);
      }
    );
  }
</script>

<div class="container">
  <div class="section" id="aggregate-stream">
    <h3 class="section-title">Aggregate State Stream</h3>
    <div class="input-group">
      <input
        class="input-field"
        bind:value={aggregateId}
        required
        type="text"
        placeholder="AggregateId"
      />
      <button class="btn" on:click={handleSubscription}>Subscribe</button>
    </div>
    <textarea
      id="aggregateStateArea"
      class="textarea-field"
      bind:value={aggregateState}
      required
      placeholder="NONE"
      on:input={resizeTextarea}
    />
  </div>

  <div class="section" id="command-form">
    <h3 class="section-title">Command Form</h3>
    <div class="input-group">
      <input
        class="input-field"
        bind:value={commandType}
        required
        type="text"
        placeholder="Command Type"
      />
      <textarea
        class="textarea-field"
        bind:value={commandJson}
        required
        placeholder="Command JSON"
        on:input={resizeTextarea}
        style="overflow-y: hidden;"
      />
      <button class="btn" type="button" on:click={handleCommand}
        >Issue Command</button
      >
    </div>
  </div>
</div>

<style>
  .textarea-field {
    width: 100%; /* Use 100% width */
    min-height: 100px; /* Set a minimum height */
    resize: true; /* Disable manual resize */
    font-size: 16px; /* Set font size */
    padding: 10px; /* Set padding */
    box-sizing: border-box; /* Include padding and border in element's total width and height */
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1024px;
    margin: 0 auto;
    padding: 1rem;
  }

  .section {
    background-color: #f5f5f5;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .section-title {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    color: #0e3a61; /* Navy Blue */
    font-weight: 600;
  }

  .input-group {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .input-field {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 2px solid #0e3a61; /* Navy Blue */
    flex-grow: 1;
  }

  .btn {
    background-color: #0e3a61; /* Navy Blue */
    color: #ffffff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn:hover {
    background-color: #08233c; /* Dark Navy Blue */
  }
</style>
