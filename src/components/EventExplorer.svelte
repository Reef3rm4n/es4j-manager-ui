<!-- EventExplorer.svelte -->

<script>
  // You can define your component's logic here

  // Function for handling page change
  function changePage(direction) {
    // Logic for changing the page
  }
</script>

<div class="page">
  <h3>Event Explorer</h3>
  <div class="event-form">
    <label for="event-name">Event Names:</label>
    <input
      type="text"
      id="event-name"
      name="event-name"
      placeholder="Event names (comma separated)"
    />

    <label for="event-date-from">Date From:</label>
    <input type="date" id="event-date-from" name="event-date-from" />
    <label for="event-date-to">Date To:</label>
    <input type="date" id="event-date-to" name="event-date-to" />
    <label for="aggregateIds">Aggregate IDs:</label>
    <input
      type="text"
      id="aggregateIds"
      placeholder="Aggregate IDs (comma separated)"
    />
    <label for="tags">Event Tags:</label><input
      type="text"
      id="tags"
      placeholder="Event Tags (comma separated)"
    />
    <label for="tenantId">Tenant :</label><input
      type="text"
      id="tenantId"
      placeholder="Tenant (optional)"
    />
    <!-- ... Other Form Fields ... -->

    <button type="submit">Submit</button>
  </div>

  <table id="eventGrid" class="event-grid">
    <tr>
      <th>Journal Offset</th>
      <th>Aggregate ID</th>
      <th>Event Class</th>
      <th>Event Version</th>
      <th>Event</th>
      <th>Tenant ID</th>
      <th>Command ID</th>
      <th>Tags</th>
      <th>Schema Version</th>
    </tr>
  </table>
  <div id="pagination">
    <button on:click={() => changePage(-1)} id="prevBtn" disabled
      >Previous</button
    >
    <button on:click={() => changePage(1)} id="nextBtn" disabled>Next</button>
  </div>

  <div id="errorMessage" class="error" />
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
