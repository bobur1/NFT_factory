import { task } from 'hardhat/config';
import { BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { Address } from 'cluster';

task('createCollection', 'Create NFT collection')
    .addParam('factory', 'NFT factory address')
    .addParam('name', 'NFT collection name')
    .addParam('symbol', 'NFT collection symbol')
	.setAction(async ({ factory, name, symbol }, { ethers }) => {    
        const NFTFactory = await ethers.getContractFactory('NFTFactory');
        const contract = NFTFactory.attach(factory);

        // event listener from https://stackoverflow.com/questions/68432609/contract-event-listener-is-not-firing-when-running-hardhat-tests-with-ethers-js
        const contractTx: ContractTransaction = await contract.createCollection(name, symbol);
        const contractReceipt: ContractReceipt = await contractTx.wait();
        const event = contractReceipt.events?.find(event => event.event === 'CollectionCreated');
        const eCollectionAddress: Address = event?.args!['collection'];
        const eName: String = event?.args!['name'];
        const eSymbol: String = event?.args!['symbol'];            
    	console.log(`Collection address: ${eCollectionAddress}`);
    	console.log(`Name: ${eName}`);
    	console.log(`Symbol: ${eSymbol}`);
    });
