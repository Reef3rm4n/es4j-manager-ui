<!-- EventExplorer.svelte -->

<script>
  import TextField from "@smui/textfield";  import Button from "@smui/button";
  import DataTable, {
    Head,
    Body,
    Row,
    Cell,
    Pagination,
  } from '@smui/data-table';
  import Select, { Option } from '@smui/select';
  import IconButton from '@smui/icon-button';
  import { Label } from '@smui/common';
  export let eventBus;
  export let aggregate;
  export let tenant;
  import LayoutGrid, { Cell as LCell } from '@smui/layout-grid';
  let rows = [];
  let eventNames = "";
  let dateFrom = "";
  let dateTo = "";
  let aggregateIds = "";
  let tags = "";
  let batchSize = 1000;
  let rowsPerPage = 10;
  let currentPage = 0;
  let eventTypes = [];
  let value = eventTypes[0];

  $: start = currentPage * rowsPerPage;
  $: end = Math.min(start + rowsPerPage, rows.length);
  $: slice = rows.slice(start, end);
  $: lastPage = Math.max(Math.ceil(rows.length / rowsPerPage) - 1, 0);
 
  $: if (currentPage > lastPage) {
    currentPage = lastPage;
  }

  function changePage() {
    fetchEvents(aggregateIds, eventNames, dateFrom, dateTo, tags,batchSize);
  }
  function addRow(data) {
    rows = [...rows, data];
  }
  // Function for handling page change
  function fetchEvents(
    aggregateIds,
    eventNames,
    eventDateFrom,
    eventDateTo,
    tags,
    batchSize
  ) {
    eventBus.send(
      "/" + aggregate + "/event",
      {
        aggregateIds: aggregateIds? aggregateIds.split(',') : [],
        events: eventNames ? eventNames.split(',') : [],
        from: eventDateFrom ? eventDateFrom : null,
        to: eventDateTo ? eventDateTo : null,
        tags: tags ? tags.split(',') : [],
        tenantId: tenant,
        batchSize: batchSize,
      },
      null,
      function (error, message) {
        if (error) {
          notifier.danger("fetch error :" + error, 3000);
        } else {
          rows = [];
          message.body.forEach((event) => {
            addRow(event);
          });
        }
      }
    );
  }
</script>

<div>
  <div class="margins">
    <LayoutGrid>
      <LCell>
        <div class="demo-cell">
          <TextField
          label="Aggregate IDs:"
          helperText="Aggregate IDs (comma separated)"
          bind:value={aggregateIds}
          id="aggregateIds"
        > </TextField>
          </div>
      </LCell> 
        <LCell>
          <div class="demo-cell">
            <Select bind:value label="Select Menu">
            </Select>
            <TextField
      label="Event Names:"
      helperText="Event names (comma separated)"
      bind:value={eventNames}
      id="event-name"
    > </TextField>
          </div>
        </LCell>

    <LCell>
      <div class="demo-cell">
        <TextField
        label="Event Tags:"
        helperText="Event Tags (comma separated)"
        bind:value={tags}
        id="tags"
      >
    </TextField>
        </div>
    </LCell> 
    <LCell>
      <div class="demo-cell">
        <TextField
      label="Date From:"
      type="date"
      bind:value={dateFrom}
      id="event-date-from"
    >
    </TextField>
        </div>
    </LCell>
    
    <LCell>
      <div class="demo-cell">
        <TextField
      label="Date To:"
      type="date"
      bind:value={dateTo}
      id="event-date-to"
    >
    </TextField>
        </div>
    </LCell> 
    <LCell>
      <div class="demo-cell">
        <TextField
        label="Page Size:"
        helperText="Default 100"
        bind:value={batchSize}
        id="tags"
      >
      </TextField>
        </div>
    </LCell> 
   <LCell> 
    <div class="demo-clee">
      <Button  				variant="unelevated"
      color="primary" raised on:click={changePage}>Submit</Button>
    </div>
   </LCell>
  </LayoutGrid>
  </div>
  <div class="margins">
    <DataTable>
      <Row>
        <Cell head>Journal Offset</Cell>
        <Cell head>Aggregate ID</Cell>
        <Cell head>Event Class</Cell>
        <Cell head>Event Version</Cell>
        <Cell head>Event</Cell>
        <Cell head>Tenant ID</Cell>
        <Cell head>Command ID</Cell>
        <Cell head>Tags</Cell>
        <Cell head>Schema Version</Cell>
      </Row>
      {#each slice as row}
        <Row>
          <Cell>{row.journalOffset}</Cell>
          <Cell>{row.aggregateId}</Cell>
          <Cell>{row.eventVersion}</Cell>
          <Cell>{JSON.stringify(row.event)}</Cell>
          <Cell>{row.eventClass}</Cell>
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
