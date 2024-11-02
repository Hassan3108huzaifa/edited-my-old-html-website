const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to receive messages
app.post('/receive-message', (req, res) => {
  const { name, email, message } = req.body;

  // Save the message to a file
  const filePath = 'messages.json';

  // Read existing messages from the file
  let existingMessages = [];
  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    existingMessages = JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading messages file:', error);
  }

  // Add the new message
  const newMessage = { name, email, message, timestamp: new Date() };
  existingMessages.push(newMessage);

  // Write the updated messages back to the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(existingMessages, null, 2));
  } catch (error) {
    console.error('Error writing messages file:', error);
  }

  console.log('Received message:', newMessage);

  res.send('Message received successfully!');
});

// Endpoint to retrieve all messages
app.get('/get-messages', (req, res) => {
  const filePath = 'messages.json';

  try {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const messages = JSON.parse(fileData);
    res.json(messages);
  } catch (error) {
    console.error('Error reading messages file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
