const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { exec } = require('child_process');

const { Telnet } = require('telnet-client');
const connection = new Telnet();

const port = 3000;

const telnetParms = {
  host: 'fluidsynth.local',
  port: 9800, // Default Telnet port
  shellPrompt: null, // The prompt to wait for before sending commands
  timeout: 1500, // Timeout in milliseconds  
}

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// define the Telnet "send command" function
async function sendCommand(command) {
  try {
      await connection.connect(telnetParms);
      const response = await connection.send(command);
      return response.toString();
  } catch (error) {
    if (error.message === 'response not received') {
      connection.end();
    } else {
      throw( error );
    }        
  } finally {
      connection.end();
  }
}

io.on('connection', (client) => {
  console.log('A user connected');

  client.on('queryFont',function(font){
    console.log('queryFont');
    if (isNumeric(font)){
      dumpInstruments(font,client);
    }
  });

  client.on('changeinst', function(data) {
    console.log('changeinst');
    changeInstrument(data);
  });

  client.on('getinstruments', function(){
    console.log('getInstruments');
  // tconnect.send('channels', function(err, ins) {
  // var raw_list = ins.split("\n");
  // var channel_list = [];
  // for (i=0; i < raw_list.length - 1; i++){
  //   channel_list[i] = raw_list[i].split(", ")[1].trim();
  // }
  //       io.emit('current', { channels: channel_list });
  //     });
  });

  client.on('shutdown', () => {
    if (process.platform === 'linux') {
      // Execute the shutdown command with appropriate flags
      exec('sudo shutdown -h now', (error, stdout, stderr) => {
          if (error) {
              console.error(`Error: ${error}`);
          } else {
              console.log('Shutting down...');
          }
      });
    } else {
        console.log('This script is designed for Linux systems.');
    }
  });

  client.on('disconnect', () => {
      console.log('A user disconnected');
  });

  });

  function changeInstrument(data){
    var channel = data.channel;
    var inst = data.instrumentId;
    var fontId = data.fontId;
    var bankId = data.bankId;

    if ( isNumeric(channel) && isNumeric(inst) ) {

      var flcmd = 'select '+channel+' '+ fontId + ' ' + bankId + ' ' + inst;
      
      console.log(flcmd);

      sendCommand(flcmd)
      .then((response) => {
        // nothing is coming back
      });      

    } 
  }

  function dumpInstruments(font,client){
    sendCommand('inst '+font)
    .then((response) => {
      client.emit('instrumentdump', { package: response });
    });
  }

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});