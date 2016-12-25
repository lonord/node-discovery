# node-discovery

A UDP discovery service based on Node.js, it can find the target device in the LAN.

### Usage

- Put the directory `server` to the device which to be looking for
- Run the script `node node-discovery-server.js` or `./node-discovery-server.js`. Also you can use `pm2` to run it in deamon.
- Run script `node-discovery-client.js` in directory `client`, then you can see the address of server.

### Configuration files

##### config_server.json

	{
		"serverPort": 1314,     //server listening port
		"clientPort": 11314,     //client listening port
		"idString": "WhereAreYou",     //identification string to broadcast
		"responseString": "ImHere",     //response string sent to client from server
		"additionalString": "device 1"     //additional string to identify a server (optinal)
	}

##### config_client.json

	{
		"serverPort": 1314,     //server listening port
		"clientPort": 11314,     //client listening port
		"idString": "WhereAreYou",     //identification string to broadcast
		"responseString": "ImHere",     //response string sent to client from server
		"timeout": 3000,     //timeout waiting for response of broadcast
		"broadcastAddr": "255.255.255.255"     //broadcast address (optional default 255.255.255.255)
	}

# License

MIT License. See the LICENSE file.