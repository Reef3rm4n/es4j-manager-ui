<!-- ProjectionManager.svelte

<script>
  let offset = "";
  let consumer = "";
  let tenant = "";
  let projections = [];

  // Function for finding projections
  async function findProjections() {
    // Dummy data for example purpose. You should implement the logic for fetching the data here.
    projections = [
      {
        consumer: "Consumer1",
        idOffset: "123",
        eventVersionOffset: "1.2",
        tenant: "Tenant1",
        version: "1.0",
        creationDate: "2023-07-05",
        lastUpdate: "2023-07-05",
      },
      {
        consumer: "Consumer2",
        idOffset: "124",
        eventVersionOffset: "1.3",
        tenant: "Tenant2",
        version: "1.1",
        creationDate: "2023-07-06",
        lastUpdate: "2023-07-06",
      },
    ];
  }

  // Function for resetting projection
  function resetProjection(offset, consumer, tenant) {
    // Logic for resetting projection
    console.log(
      `Reset projection with offset: ${offset}, consumer: ${consumer}, tenant: ${tenant}`
    );
  }
</script>

<div id="projection-explorer" class="page">
  <h3>Projection Manager</h3>

  <!-- Offset Input -->
  <div>
    <label for="offset">Offset:</label>
    <input type="text" id="offset" bind:value={offset} />
    <button on:click={() => resetProjection(offset, consumer, tenant)}
      >Reset Projection</button
    >
  </div>

  <!-- Filter Form -->
  <div class="event-form">
    <label for="consumers">Consumers:</label>
    <input
      type="text"
      id="consumers"
      name="consumers"
      bind:value={consumer}
      placeholder="con1, con2"
    />

    <label for="tenant">Tenant:</label>
    <input
      type="text"
      id="tenant-p"
      name="tenant"
      bind:value={tenant}
      placeholder="Tenant"
    />

    <button type="button" on:click={findProjections}>Apply Filters</button>
  </div>

  <!-- Projection Grid -->
  <table class="event-grid">
    <thead>
      <tr>
        <th>Consumer</th>
        <th>ID Offset</th>
        <th>Event Version Offset</th>
        <th>Tenant</th>
        <th>Version</th>
        <th>Creation Date</th>
        <th>Last Update</th>
      </tr>
    </thead>
    <tbody>
      {#each projections as projection}
        <tr>
          <td>{projection.consumer}</td>
          <td>{projection.idOffset}</td>
          <td>{projection.eventVersionOffset}</td>
          <td>{projection.tenant}</td>
          <td>{projection.version}</td>
          <td>{projection.creationDate}</td>
          <td>{projection.lastUpdate}</td>
          <td
            ><button
              on:click={() =>
                resetProjection(
                  projection.idOffset,
                  projection.consumer,
                  projection.tenant
                )}>Select</button
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  th {
    padding: 15px;
    text-align: left;
  }

  th {
    background-color: #0a3d62;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:nth-child(odd) {
    background-color: #dcdde1;
  }

  tr:hover {
    background-color: #4a69bd;
    cursor: pointer;
  }

  div {
    background-color: #f2f2f2;
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    width: 100%;
  }
</style>


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
  
</div> -->
