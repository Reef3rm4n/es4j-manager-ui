<script>
  import { notifier } from "@beyonk/svelte-notifications";
  import Button from "@smui/button";
  export let eventBus;
  export let aggregate;
  export let tenant;
  export let cmdSchemas;
  import HelperText from "@smui/textfield/helper-text";
  import Textfield from "@smui/textfield";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Select, { Option } from "@smui/select";
  import FormField from '@smui/form-field';
  import Switch from '@smui/switch';
  import Icon from '@smui/textfield/icon';
  let aggregateId = "";
  let aggregateState = "";
  let aggregateClass = "";
  let cmdTypes = Object.keys(cmdSchemas);
  let commandJson = "";
  let value = cmdTypes[0];
  let currentVersion = 0;
  let simulate = false;
  let scheduled = null;
  let commandOptions = {
    simulate: simulate,
    scheduled: scheduled,
  };
  $: {
    commandOptions = {
      simulate: simulate,
      scheduled: scheduled,
    };
  }
  $: {
    commandJson = cmdSchemas[value];
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

        aggregateClass = message.body.aggregateClass;
        currentVersion = message.body.currentVersion;
        delete message.body.aggregateClass;
        delete message.body.currentVersion;
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
    issueCommand(value, JSON.parse(commandJson));
  }
  function issueCommand(cmdType, cmd) {
    cmd["options"] = commandOptions;
    eventBus.send(
      "/" + aggregate + "/" + cmdType,
      cmd,
      null,
      function (error, message) {
        if (error) {
          notifier.danger("command error :" + error, 2000);
        }
        aggregateClass = message.body.aggregateClass;
        currentVersion = message.body.currentVersion;
        delete message.body.aggregateClass;
        delete message.body.currentVersion;
        aggregateState = JSON.stringify(message.body, null, 2);
      }
    );
  }
</script>

<div class="margins">
  <div class="margins">
    <h3 class="section-title">Aggregate State Stream</h3>
    <div class="margins">
      <Textfield
        bind:value={aggregateId}
        label="AggregateId"
        class="input-field"
      >
        <HelperText slot="helper"
          >The aggregateId that has been defined in your aggregate class
          definition</HelperText
        >
      </Textfield>
      <Button
        variant="unelevated"
        color="primary"
        raised
        on:click={handleSubscription}
        class="btn">Subscribe</Button
      >
    </div>
    <Paper variant="outlined">
      <Title>{aggregateClass}</Title>
      <Subtitle>version : {currentVersion}</Subtitle>
      <Content>{aggregateState}</Content>
    </Paper>
  </div>

  <div class="margins">
    <h3 class="section-title">Command Issuer</h3>
    <div class="margins">
      <div class="columns margins" style="justify-content: flex-start;">
        <div>
          <Select bind:value>
            {#each cmdTypes as type}
              <Option value={type}>{type}</Option>
            {/each}
          </Select>
          <pre class="status">Selected: {value}</pre>
        </div>
      </div>
      <FormField>
        <Switch bind:checked={simulate} />
        <span slot="label">
          simulate command execution</span>
      </FormField>
      <Textfield
      class="shaped-filled"
      variant="filled"
      bind:value={scheduled}
      label="Scheduled Command"
    >
      <Icon class="material-icons" slot="leadingIcon">event</Icon>
      <HelperText slot="helper">Helper Text</HelperText>
    </Textfield>
      <Textfield
        style="width: 100%; height: 400px;"
        helperLine$style="width: 100%;"
        bind:value={commandJson}
        textarea
        required
        label="Command Payload"
      />
      <Button
        variant="unelevated"
        color="primary"
        raised
        on:click={handleCommand}
        class="btn">Issue Command</Button
      >
    </div>
  </div>
</div>
