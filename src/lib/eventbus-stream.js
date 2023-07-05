let eventBus = new EventBus('http://localhost:8080/eventbus')

function subscribe(aggregate, aggregateId, tenantId) {
  
  eventBus.onopen = function () {
    console.log('EventBus opened');
    var eventStream = '/event-stream/' + aggregate + '/' + tenantId + '/' + aggregateId;
    var stateStream = '/state-stream/' + aggregate + '/' + tenantId + '/' + aggregateId;
    console.log('registering to -> ' + stateStream)
    console.log('registering to -> ' + eventStream)
    const loadCommand = {
      aggregateId : aggregateId,
      tenant : tenantId,
    }
    issueCommand(aggregate,"load-aggregate", loadCommand)
    eventBus.registerHandler(
      stateStream,
      null,
      function (error, message) {
        if (error) {
          console.error('Failed to register handler:', error);
        } else {
          console.log('Received message:', message.body);
        }
        document.getElementById('state').innerHTML = syntaxHighlight(JSON.stringify(message.body, null, 2));
      }
    );
    eventBus.registerHandler(
      eventStream,
      null,
      function (error, message) {
        if (error) {
          console.error('Failed to register handler:', error);
        } else {
          console.log('Received message:', message.body);

          // Check if notifications are allowed
          if (Notification.permission === 'granted') {
            // Create and display notification
            new Notification('New Event', {
              body: JSON.stringify(message.body)
            });
          }
        }
      }
    )

  }
}

function issueCommand(aggregate, commandType, command) {
  eventBus.send(
    '/' + aggregate + '/' + commandType,
    command,
    null,
    function (error, message) {
      if (error) {
        console.error('Command failed ' + JSON.stringify(command), error);
      } else {
        console.log('Received state update :', message.body);
      }
      document.getElementById('state').innerHTML = syntaxHighlight(JSON.stringify(message.body, null, 2));
    }
  )
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    match => {
      let cls = 'json-value';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}
