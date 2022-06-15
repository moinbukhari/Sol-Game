import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import ethGame from './utils/EthGame.json';
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import CandyMachine from './CandyMachine';
import idl from './idl.json';
import {Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import kp from './keypair.json'

import {Program, Provider, web3, BN, getProvider} from '@project-serum/anchor';



// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}


// Constants
const TWITTER_HANDLE = 'moin4321';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const [bossName, setBossName] = useState(null);
  const [boss, setBoss] = useState(null);
  

  
  

  useEffect(() => {
    setIsLoading(true);
    console.log("HEY");
    checkIfWalletIsConnected();
    // checkNetwork();
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ethGame.abi,
        signer
      );
      
      console.log("Before");
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.log(characterNFT);
      console.log("After");
      
      if (characterNFT.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(characterNFT));
      } else {
        console.log('No character NFT found');
      }

      setIsLoading(false);

      
    };
  
    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  const renderContent = () => {

    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (boss === null && walletAddress) {
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={initialise}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      )
    } 
  
    

    if(!walletAddress){
      return(
        <div className="connect-wallet-container">
        <img
          src="https://c.tenor.com/zkvCpx70D2sAAAAC/robin-batman.gif"
          alt="Young Justice Gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
      );
    } else if (walletAddress && !characterNFT){

      console.log("Yooooooooooooooooooooo")
      console.log(window.solana)
      console.log("Got the Boss", boss)
      //return <h2>Hello</h2>;
      //return <CandyMachine walletAddress={window.solana} />;
      return  <Arena boss={boss} setBoss={setBoss} />;
      //return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } 
    else if (walletAddress && characterNFT){
      //return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      return  <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
    
  };

  const checkIfWalletIsConnected = async () => {
    try{
      const {solana} = window;
      
      if (solana && solana.isPhantom){
        console.log("Phantom wallet found");

        const response = await solana.connect({onlyIfTrusted: true});
        console.log('Connected with Public Key:', response.publicKey.toString());

        setWalletAddress(response.publicKey.toString());
        
        // if (accounts.length !== 0 ){
        //   const account = accounts[0];
        //   console.log("found an authorized account:", account);
        //   setCurrentAccount(account);
        // }else{
        //   console.log("No authorised account found");
        // }
        
        
      }else{
        setIsLoading(false);
        console.log("Solana object not found");
        return;
      }
    } catch (error){
      console.error(error);
    }
    setIsLoading(false);
  };
  
  
  const connectWalletAction = async () => {
    try{
      const {solana} = window;
      if(!solana){
        console.log('Get Phantom');
        return;
      }

      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
      
      // const accounts = await ethereum.request({
      //   method: 'eth_requestAccounts',
      // });

      // console.log('Connected', accounts[0]);
      // setCurrentAccount(accounts[0]);
      
    }catch(error){
      console.log(error);
    }
  }

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(connection, window.solana, opts.preflightCommitment,);

    return provider;
  }

  const getBoss = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      //console.log("Got the account", account)
      const bss = {
        name: account.bossName,
        imageURI: account.imageLink,
        hp: account.hp,
        maxHp: account.maxHp,
        attackDamage: account.attackDamage,
      };
      
      //setBossName(bss)
      setBoss(bss);
      console.log("Got the Boss", boss)
  
    } catch (error) {
      console.log("Error in getBoss: ", error)
      //setBossName(null);
    }
  }
  
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching Boss');
      getBoss()
    }
  }, [walletAddress]);

  const initialise = async () =>{

    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      let CI = new BN(1);
      let HP = new BN(300);
      let AD = new BN(50);

      
      let robin = {characterIndex: CI, characterName: "Rob",
                   imageLink:"https://i.imgur.com/9CbYcwZ.png" , hp: HP, 
                   maxHp: HP ,attackDamage: AD };
      
      await program.rpc.initialize(robin,{
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getBoss();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }

    
  }

  // const checkNetwork = async () => {
  //   try { 
  //     if (window.ethereum.networkVersion !== '4') {
  //       alert("Please connect to Rinkeby!")
  //     }else{
  //       console.log("You are using rinkeby!");
  //     }
  //   } catch(error) {
  //     console.log(error)
  //   }
  // }

  /*
   * This runs our function when the page loads.
   */
  

  
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ DC Young Justice ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
