# NFT Factory and Collections Events Listener

This application listens to events emitted by ERC-721 NFT contracts. It currently listens to the following events:

```CollectionCreated```
```TokenMinted```

The application saves the emitted events in memory and can be accessed by making a GET request to /events.

## Requirements

- Node.js v16+
- npm v8+

## Installation

```npm install```

## Running the application

```node index```

## Example

To get a list of all emitted events, make a GET request to `/events`. For example:
```curl http://localhost:3001/events```

## ToDo

Possible improvements of this code:

* Add support for other events, such as `Transfer`, `Approve`, and `ApproveForAll`.
* Add a UI to view the emitted events.