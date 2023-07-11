import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
  createCollection
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [factoryStatus, setFactoryStatus] = useState("");
  const [status, setStatus] = useState("");

  const [nftAddress, setNftAddress] = useState("");
  const [url, setURL] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setFactoryStatus(status);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setFactoryStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setFactoryStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setFactoryStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setFactoryStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onCollectionCreaterPressed = async () => {
    const { success, factoryStatus } = await createCollection(name, symbol);
    setFactoryStatus(factoryStatus);
    if (success) {
      setName("");
      setSymbol("");
    }
  };

  const onMintPressed = async () => {
    const { success, status } = await mintNFT(nftAddress, url);
    setStatus(status);
    if (success) {
      setNftAddress("");
      setURL("");
    }
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <br></br>
      <h1 id="title">NFT Collection Factory</h1>
      <p>
        Simply add your nft name and symbol, then press "Create."
      </p>
      <form>
        <h2>🖼️ NFT Collection Name: </h2>
        <input
          type="text"
          placeholder="e.g. Custom NFT"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>🖼️ NFT Collection Symbol: </h2>
        <input
          type="text"
          placeholder="e.g. CSTM"
          onChange={(event) => setSymbol(event.target.value)}
        />

      </form>
      <button id="mintButton" onClick={onCollectionCreaterPressed}>
        Create
      </button>
      <p id="status" style={{ color: "red" }}>
        {factoryStatus}
      </p>

      <br></br>
      <h1 id="title">NFT Minter</h1>
      <p>
        Simply add your nft address and asset's link, then press "Mint."
      </p>
      <form>
        <h2>🤔 NFT Collection Address: </h2>
        <input
          type="text"
          placeholder="e.g. 0x3935074ecc3b794C132B6ED3adf10069B4BA0080"
          onChange={(event) => setNftAddress(event.target.value)}
        />
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />

      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
      <br></br>
      <br></br>
    </div>
  );
};

export default Minter;
