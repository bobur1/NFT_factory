const factoryABI = require("../abi/erc721-factory-abi.json");
const contractABI = require("../abi/erc721-abi.json");
const factoryAddress = "0x467Db24669200A2E54398316b9CdbC2Cf3E3D468";
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

// const checkAddressExistenceInCollectionCreated = async (addressToCheck) => {
//   // Create an instance of the contract
//   const contract = new ethers.Contract(factoryAddress, factoryABI, provider);
//   const toBlock = await provider.getBlockNumber();
//   const fromBlock = toBlock - 1000;
//   // Create the event filter with the indexed address
//   const eventFilter = {
//     address: factoryAddress,
//     fromBlock: fromBlock,
//     toBlock: toBlock,
//     topics: [
//       ethers.utils.id("CollectionCreated(address,string,string)"),
//       ethers.utils.hexZeroPad(addressToCheck, 32)
//     ],
//   };
//   // Retrieve the contract events based on the event filter
//   const events = await contract.queryFilter(eventFilter);
//   // Check if any events are found
//   const isAddressExist = events.length > 0;
//   return isAddressExist;
// }

// Alternative way to check whether the contract has been created by factory
const checkAddressExistenceInCollectionCreated = async (addressToCheck) => {
  const apiKey = process.env.REACT_APP_POLYGONSCAN_API_KEY;
  const topic0 = ethers.utils.id("CollectionCreated(address,string,string)"); // filter by created collections
  const topic1 = ethers.utils.hexZeroPad(addressToCheck, 32);
  let url = `https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${factoryAddress}&topic0=${topic0}&topic1=${topic1}&apikey=${apiKey}`;
  try {
    let response = await fetch(url);
    let responseJson = await response.json();

    return responseJson.result.length > 0;
   } catch(error) {
    console.error(error);
    return false
  }
  
}
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const createCollection = async (name, symbol) => {
  if (name.trim() == "" || symbol.trim() == "") {
    return {
      success: false,
      factoryStatus: "❗Please make sure all fields are completed before minting.",
    };
  }

  window.contract = await new ethers.Contract(factoryAddress, factoryABI, provider);

  const contractInterface = new ethers.utils.Interface(factoryABI);
    const transactionParameters = {
      to: factoryAddress,
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: contractInterface.encodeFunctionData('createCollection', [name, symbol]),
    };
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      const transaction = await provider.getTransaction(txHash);
      const receipt = await transaction.wait();
      const newCollectionAddress = receipt.logs[0].address; // 1st event is transfering ownership in newly created nft contract
      
      return {
        success: true,
        factoryStatus:
          `✅ Created new NFT collection: ${newCollectionAddress}. \n Check out your transaction on Etherscan: https://mumbai.polygonscan.com/tx/${txHash}`
      };
    } catch (error) {
      return {
        success: false,
        factoryStatus: "😥 Something went wrong: " + error.message,
      };
    }
};

export const mintNFT = async (address, url) => {
  if (url.trim() == "" || address.trim() == "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }

  if(!ethers.utils.isAddress(address)) {
    return {
      success: false,
      status: "❗Please enter valid address format.",
    };
  }
  
  const isFactoryCreatedNft = await checkAddressExistenceInCollectionCreated(address);

  if(!isFactoryCreatedNft) {
    return {
      success: false,
      status: `❗Please enter only factory created Nft addresses. ${factoryAddress}`,
    };
  }
  window.contract = await new ethers.Contract(address, contractABI, provider);
  console.log("contract --> "+ window.contract.address)

  console.log("tx param --> "+window.ethereum.selectedAddress)
  const contractInterface = new ethers.utils.Interface(contractABI);
    const transactionParameters = {
      to: address, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: contractInterface.encodeFunctionData('mint', [window.ethereum.selectedAddress, url]),
    };
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      return {
        success: true,
        status:
          "✅ Check out your transaction on Etherscan: https://mumbai.polygonscan.com/tx/" +
          txHash,
      };
    } catch (error) {
      return {
        success: false,
        status: "😥 Something went wrong: " + error.message,
      };
    }
};