<script>
  import TextField from "@smui/textfield";  import Button from "@smui/button";
  import DataTable, {
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
  import { notifier } from "@beyonk/svelte-notifications";
  let rows = [];
  let consumers = "";
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
    fetchEvents(consumers);
  }
  function addRow(data) {
    rows = [...rows, data];
  }
  // Function for handling page change
  function fetchEvents(
    c
  ) {
    eventBus.send(
      "/" + aggregate + "/event-consumers",
      {
        consumers: c? c.split(',') : null,
        tenant: tenant
      },
      null,
      function (error, message) {
        if (error) {
          if (error instanceof Object) {
            notifier.danger("fetch error :" + JSON.stringify(error, null, 2), 3000);
          } else {
            notifier.danger("fetch error :" + error, 3000);
          }
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
          label="Consumers IDs:"
          helperText="Consumers IDs (comma separated)"
          bind:value={consumers}
          id="aggregateIds"
        > </TextField>
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
        <Cell head>Consumer</Cell>
        <Cell head>Tenant</Cell>
        <Cell head>Offset</Cell>
        <Cell head>Created</Cell>
        <Cell head>Updated</Cell>
      </Row>
      {#each slice as row}
        <Row>
          <Cell>{row.consumer}</Cell>
          <Cell>{row.tenantId}</Cell>
          <Cell>{row.idOffSet}</Cell>
          <Cell>{row.creationDate}</Cell>
          <Cell>{row.lastUpdate}</Cell>
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
