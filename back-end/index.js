const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
require('dotenv').config();
const erc721ABI = new ethers.utils.Interface(require("./abi/erc721-abi.json"));
const factoryABI = new ethers.utils.Interface(require("./abi/erc721-factory-abi.json"));

// Configure body-parser middleware to parse JSON
app.use(bodyParser.json());

// In-memory storage for emitted events
let emittedEvents = [];

// In-memory storage for emitted events tx hashes, in order to not duplicate them
let txHashes = [];

// All addresses to listen
let addressesToListen = [process.env.FACTORY_ADDRESS];

// Endpoint to retrieve all emitted events
app.get('/events', (req, res) => {
    res.json(emittedEvents);
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

const provider = new ethers.providers.WebSocketProvider(process.env.WSS_URL);
// ToDo::create function to get all events of creation nft contract
// async function getCreatedErc721() {...}

// Event listener function
async function getEvents() {
    addressesToListen.forEach((address, index) => {
        if(index == 0) {
            const contract = new ethers.Contract(address, factoryABI, provider);
            contract.on("CollectionCreated", (collection, name, symbol, event) => {
                const txHash = event.transactionHash;
                const eventObject = {
                    txHash: txHash,
                    event: "CollectionCreated",
                    factory: address,
                    collection: collection,
                    name: name,
                    symbol: symbol,
                };
                if (!addressesToListen.includes(collection)) {
                    addressesToListen.push(collection);
                    startListeningToAddress(collection);
                }
                addEvent(txHash, eventObject);
            });
            // else if there are more addresses
        } else {
            startListeningToAddress(address);
        }
    });
}

async function startListeningToAddress(address) {
    const contract = new ethers.Contract(address, erc721ABI, provider);

    contract.on("TokenMinted", (collection, recipient, tokenId, tokenUri, event) => {
        const txHash = event.transactionHash;
        const eventObject = {
            txHash: txHash,
            event: "TokenMinted",
            newCollection: collection,
            owner: recipient,
            tokenId: tokenId,
            tokenUri: tokenUri
        };
        addEvent(txHash, eventObject);
    });

    //ToDo:: add Transer, Approve, ApproveForAll events listener
}

function addEvent(txHash, eventObject) {
    if(!txHashes.includes(txHash)) {
        txHashes.push(txHash);
        emittedEvents.push(eventObject); // Save the event in the in-memory storage
        console.log(JSON.stringify(eventObject, null, 4));
    }
}

getEvents();