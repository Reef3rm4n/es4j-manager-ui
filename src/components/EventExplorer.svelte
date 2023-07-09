<!-- EventExplorer.svelte -->

<script>
  import TextField from "@smui/textfield";
  import DataTable, {
    Head,
    Body,
    Row,
    Cell,
    Pagination,
  } from "@smui/data-table";
  import Button from "@smui/button";

  import { NotificationDisplay, notifier } from "@beyonk/svelte-notifications";
  import Select, { Option } from "@smui/select";
  import IconButton from "@smui/icon-button";
  import { Label } from "@smui/common";
  export let eventBus;
  export let aggregate;
  export let tenant;
  export let eventTypes;

  import LayoutGrid, { Cell as LCell } from "@smui/layout-grid";
  import Chip, { Set, Text } from "@smui/chips";
  let rows = [];
  let selected = [];
  let dateFrom = "";
  let dateTo = "";
  let aggregateIds = "";
  let tags = "";
  let batchSize = 1000;
  let rowsPerPage = 10;
  let currentPage = 0;
  let offsetFrom = 0;

  $: start = currentPage * rowsPerPage;
  $: end = Math.min(start + rowsPerPage, rows.length);
  $: slice = rows.slice(start, end);
  $: lastPage = Math.max(Math.ceil(rows.length / rowsPerPage) - 1, 0);

  $: if (currentPage > lastPage) {
    currentPage = lastPage;
  }
  function fetchEvents() {
    eventBus.send(
      "/" + aggregate + "/event",
      {
        aggregateIds: aggregateIds ? aggregateIds.split(",") : [],
        events: selected,
        from: dateFrom ? dateFrom : null,
        to: dateTo ? dateTo : null,
        tags: tags ? tags.split(",") : [],
        tenantId: tenant,
        batchSize: batchSize,
        offset: offsetFrom,
      },
      null,
      function (error, message) {
        rows = [];
        if (error) {
          notifier.danger("fetch error :" + JSON.stringify(error), 3000);
        } else {
          message.body.forEach((event) => {
            addRow(event);
          });
        }
      }
    );
  }
  function addRow(data) {
    rows = [...rows, data];
  }
</script>

<div class="margins">
  <div class="margins">
    <LayoutGrid>
      <LCell>
        <div class="demo-cell">
          <TextField
            label="Aggregate IDs:"
            helperText="Aggregate IDs (comma separated)"
            bind:value={aggregateIds}
            id="aggregateIds"
    
          />
        </div>
      </LCell>
      <LCell>
        <div class="demo-cell">
          <TextField
            label="Event Tags:"
            helperText="Event Tags (comma separated)"
            bind:value={tags}
            id="tags"
    
          />
        </div>
      </LCell>
      <LCell>
        <div class="demo-cell">
          <TextField
            label="Date From:"
            type="date"
            bind:value={dateFrom}
            id="event-date-from"
    
          />
        </div>
      </LCell>

      <LCell>
        <div class="demo-cell">
          <TextField
            label="Date To:"
            type="date"
            bind:value={dateTo}
            id="event-date-to"
    
          />
        </div>
      </LCell>
      <LCell>
        <div class="demo-cell">
          <TextField
            label="Batch Size:"
            helperText="Default 1000"
            bind:value={batchSize}
            id="tags"
    
          />
        </div>
      </LCell>
      <LCell>
        <div class="demo-cell">
          <TextField
            label="Offset From:"
            helperText="Default 0"
            bind:value={offsetFrom}
            id="tags"
    
          />
        </div>
      </LCell>
      <LCell>
        <div class="demo-clee">
          <Button
            variant="unelevated"
            color="primary"
            raised
            on:click={fetchEvents}>Submit</Button
          >
        </div>
      </LCell>
    </LayoutGrid>
    <div class="margins">
      <Set
        chips={eventTypes}
        let:chip
        filter
        bind:selected

      >
        <Chip {chip} touch>
          <Text>{chip}</Text>
        </Chip>
      </Set>
      <pre class="status">Selected: {selected.length === 0
          ? ""
          : selected.join(", ")}</pre>
    </div>
  </div>
  <div class="margins">
    <DataTable>
      <Row>
        <Cell head>Offset</Cell>
        <Cell head>Aggregate ID</Cell>
        <Cell head>Event Version</Cell>
        <Cell head>Event Type</Cell>
        <Cell head>Payload</Cell>
        <Cell head>Tenant ID</Cell>
        <Cell head>Command</Cell>
        <Cell head>Tags</Cell>
        <Cell head>Schema Version</Cell>
      </Row>
      {#each slice as row}
        <Row>
          <Cell>{row.journalOffset}</Cell>
          <Cell>{row.aggregateId}</Cell>
          <Cell>{row.eventVersion}</Cell>
          <Cell>{row.eventClass}</Cell>
          <Cell>{JSON.stringify(row.event)}</Cell>
          <Cell>{row.tenantId}</Cell>
          <Cell>{row.commandId}</Cell>
          <Cell>{row.tags}</Cell>
          <Cell>{row.schemaVersion}</Cell>
        </Row>
      {/each}
      <Pagination slot="paginate">
        <svelte:fragment slot="rowsPerPage">
          <Label>Rows Per Page</Label>
          <Select variant="outlined" bind:value={rowsPerPage} noLabel>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
            <Option value={100}>100</Option>
          </Select>
        </svelte:fragment>
        <svelte:fragment slot="total">
          {start + 1}-{end} of {rows.length}
        </svelte:fragment>

        <IconButton
          class="material-icons"
          action="first-page"
          title="First page"
          on:click={() => (currentPage = 0)}
          disabled={currentPage === 0}>first_page</IconButton
        >
        <IconButton
          class="material-icons"
          action="prev-page"
          title="Prev page"
          on:click={() => currentPage--}
          disabled={currentPage === 0}>chevron_left</IconButton
        >
        <IconButton
          class="material-icons"
          action="next-page"
          title="Next page"
          on:click={() => currentPage++}
          disabled={currentPage === lastPage}>chevron_right</IconButton
        >
        <IconButton
          class="material-icons"
          action="last-page"
          title="Last page"
          on:click={() => (currentPage = lastPage)}
          disabled={currentPage === lastPage}>last_page</IconButton
        >
      </Pagination>
    </DataTable>
  </div>
</div>
