<!-- ProjectionManager.svelte -->

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
