//initialize the socket.io for the client using io() function
const clientIO = io()

const logsDiv = document.getElementById('event-log');

const logEvent = (message) => {
    const logEntry = document.createElement('p');
    logEntry.classList.add('log-entry');
    logEntry.textContent = message;
    logsDiv.appendChild(logEntry);
    logsDiv.scrollTop = logsDiv.scrollHeight; 
};

clientIO.on("connect", () => {
    logEvent(`Connected with server`)

    document.getElementById('client-id').textContent = `Client ID - ${clientIO.id}`
})

const sendPing = () => {
    logEvent(`\nPing button clicked`);

    const message = "Hello from client"

    //send the ping event to server
    //emit() send the event
    clientIO.emit('ping', message)

    logEvent(`\nON CLIENT - PING - SENT - with message ${message}`)
};

//listener for pick-ack event
clientIO.on('ping-ack', (response) => {
    logEvent(`\nON CLIENT - PING-ACK - RECEIVED - with response ${response}`)
})

const sendChatMessage = () => {
    logEvent('\nChat button clicked');

    const message = document.getElementById('message-input').value
    
    if (message.trim()){
        //send message from client
        clientIO.emit('chat-from-client', message)

        logEvent(`\nON CLIENT - CHAT - SENT - with message : ${message}`)
    }else{
        logEvent(`\nON CLIENT - CHAT - ERROR - Message is empty. Can't send.`)
    }
};

//listener for chat-ack event
clientIO.on('chat-ack', () => {
    logEvent(`\nON CLIENT - CHAT-ACK - RECEIVED - Server acknowledged chat message.`)
})

const sendFeedback = () =>{
    logEvent('\nSend feedback button clicked');
    const userInput = document.getElementById('feedback-message').value;

    const feedback = {
        date:  new Date(),
        user: clientIO.id,
        message: userInput
    }

    // send feedback from client
    clientIO.emit('feedback', feedback)

    logEvent(`\nON CLIENT - FEEDBACK - SENT : ${JSON.stringify(feedback)}`);
};

//listener for chat-ack event
clientIO.on('feedback-ack', (response) => {
    logEvent(`\nON CLIENT - FEEDBACK-ACK - RECEIVED - Server acknowledged feedback : ${JSON.stringify(response)}.`)
})

const joinGroup = () => {
    logEvent('\nJoin group button clicked');
    
    // send group join request
    clientIO.emit('join-group', 'GRP-1')

    logEvent(`\nON CLIENT - JOIN-GROUP - SENT - request sent.`)
};

const leaveGroup = () => {
    logEvent('\Leave group button clicked');

    // send group leave request
    clientIO.emit('leave-group', 'GRP-1')

    logEvent(`\nON CLIENT - LEAVE-GROUP - SENT - request sent.`)
};

clientIO.on('group-ack', (response) => {
    logEvent(`\nON CLIENT - GROUP-ACK - RECEIVED - Server acknowledged group request : ${response}`)
})

const disconnectServer = () => {
    logEvent('\nDisconnect server button clicked');

    // send disconnect  request
    clientIO.emit("disconnect")

    logEvent(`\nON CLIENT - DISCONNECT - SENT - request sent.`)
};