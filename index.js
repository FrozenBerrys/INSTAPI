const nodemailer = require('nodemailer');
const express = require('express');
const multer = require('multer'); // For handling file uploads
const { Server } = require("socket.io");
const http = require('http');
const database = require('./database'); // Import database module

const app = express();
app.use(express.static(__dirname)); // Serves files from the current directory
const port = 27017;
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server); // Attach Socket.IO to the HTTP server

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data
app.use(multer().single('image')); // Handle single file upload with field name 'image'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'MongolNFTdailywolf@gmail.com',
      pass: 'Createastrongpassword',
  },
});

function processData(email, image){
  let OK = 0;
  let processedEmail = email;
  let processedImage = image;

  return{
    text: processedEmail,
    image: processedImage
  };
}


// module.exports = {
//   sendConfirmationEmail: async (email, text) => {
//       const mailOptions = {
//           from: 'MongolNFTdailywolf@gmail.com',
//           to: email,
//           subject: 'Wolf Submission Confirmation',
//           text: `Thank you for your submission. Your message: ${text}`,
//       };

//       await transporter.sendMail(mailOptions);
//   },
// };

app.post('/submit', async (req, res) => {
    const email = req.body.email;
    const text = req.body.text;
    const currentDate = req.body.currentDate;
    const image = req.file; // Contains the uploaded image data

    const processed = processData(email, text, currentDate, image)

     // Save the data to the database using the function from the database module
     await database.saveUser(processed.email, processed.text, processed.currentDate, processed.image);

     // Send a confirmation email using the function from the email module
     //await sendConfirmationEmail(email, text);
    
    res.send('Data received and processed successfully.');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
