import React, { useEffect, useState } from 'react';

import './Arena.css';



import { Connection } from "@metaplex/js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import {Provider, Program ,web3,BN } from '@project-serum/anchor';
import idl from '../../idl.json';
import kp from '../../keypair.json'




// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

const opts = {
  preflightCommitment: "processed"
}



/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
//  */
// was an input to arena { characterNFT }
const Arena = ({boss, setBoss}) => {
  
  
  // State
  // const [gameContract, setGameContract] = useState(null);
  // const [boss, setBoss] = useState(null);
  const [nft, setNft] = useState(null);
  const [attackState, setAttackState] = useState('');

  const getJSON = async url => {
    const response = await fetch(url);
    if(!response.ok) // check if response worked (no 404 errors etc...)
      throw new Error(response.statusText);
  
    const data = response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
  }
  
  const getCharacter = async() => {
    try {
      const connection = new Connection("devnet");
      const tokenMint = "C4zvjfKCysUuTJvGgJVVaKjiWD9uqbikoaHWEKnDdFE1";
      const metadataPDA = await Metadata.getPDA(new PublicKey(tokenMint));
      const tokenMetadata = await Metadata.load(connection, metadataPDA);
      const arweaveUri = tokenMetadata.data.data.uri;
      console.log(arweaveUri);
      console.log("Fetching data...");
      const data = await getJSON(arweaveUri);
      const  character = {
        name: data.attributes[0].value,
        imageURI: data.image,
        hp: data.attributes[2].value,
        maxHp: data.attributes[3].value,
        attackDamage: data.attributes[4].value,
      };
      console.log(data.image)
      setNft(character);
      console.log("character is ", nft);
      

  
    } catch (error) {
      console.log("Error in getCharacter: ", error)
      //setBossName(null);
    }
  };


  

 
  // UseEffects
  useEffect(() => {
    getCharacter()
    console.log(nft)
  }, []);
  // Actions
  const getProvider = () => {
    const connection = new Connection("devnet");
    const provider = new Provider(connection, window.solana, opts.preflightCommitment,);

    return provider;
  }

  const runAttackAction = async () => {
    try {
      
      

      setAttackState('attacking');
      console.log('Attacking boss...');
      const provider = getProvider();
      const program = new Program(idl,programID,provider);
      const damage = new BN(nft.attackDamage)
      const attackTxn = await program.rpc.attackBoss(damage,{
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        });
      //const attackTxn = await gameContract.attackBoss();
      await attackTxn.wait();
      console.log('attackTxn:', attackTxn);
      setAttackState('hit');
      
    } catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState('');
    }
  };

 
  return (
    <div className="arena-container">
      {/* Replace your Boss UI with this */}
      {boss && (
        <div className="boss-container">
          {/* Add attackState to the className! After all, it's just class names */}
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
            </button>
          </div>
        </div>
      )}
  
      {/* Replace your Character UI with this */}
      {nft && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{nft.name}</h2>
              <img
                src={nft.imageURI}
                alt={`Character ${nft.name}`}
              />
              <div className="health-bar">
                <progress value={nft.hp} max={nft.maxHp} />
                <p>{`${nft.hp} / ${nft.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${nft.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Arena;




  // const getGifList = async() => {
  //   try {
  //     const provider = getProvider();
  //     const program = new Program(idl, programID, provider);
  //     const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
  //     console.log("Got the account", account)
  //     setBossName(account.bossName)
  
  //   } catch (error) {
  //     console.log("Error in getGifList: ", error)
  //     setBossName(null);
  //   }
  // }
  
  // useEffect(() => {
  //   if (walletAddress) {
  //     console.log('Fetching GIF list...');
  //     getGifList()
  //   }
  // }, [walletAddress]);

  // const initialise = async () =>{

  //   try {
  //     const provider = getProvider();
  //     const program = new Program(idl, programID, provider);
  //     console.log("ping")
  //     let CI = new BN(1);
  //     let HP = new BN(300);
  //     let AD = new BN(50);

      
  //     let robin = {characterIndex: CI, characterName: "Rob",
  //                  imageLink:"https://i.imgur.com/9CbYcwZ.png" , hp: HP, 
  //                  maxHp: HP ,attackDamage: AD };
      
  //     await program.rpc.initialize(robin,{
  //       accounts: {
  //         baseAccount: baseAccount.publicKey,
  //         user: provider.wallet.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       },
  //       signers: [baseAccount]
  //     });
  //     console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
  //     await getGifList();
  
  //   } catch(error) {
  //     console.log("Error creating BaseAccount account:", error)
  //   }

    
  // }