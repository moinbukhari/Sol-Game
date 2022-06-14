import React, { useEffect, useState } from 'react';

import './Arena.css';






// import { Connection } from "@metaplex/js";
// import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
// import { PublicKey } from "@solana/web3.js";

// (async () => {
//   const connection = new Connection("devnet");
//   const tokenMint = "C4zvjfKCysUuTJvGgJVVaKjiWD9uqbikoaHWEKnDdFE1";
//   const metadataPDA = await Metadata.getPDA(new PublicKey(tokenMint));
//   const tokenMetadata = await Metadata.load(connection, metadataPDA);
//   console.log(tokenMetadata.data);
// })();




/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
//  */
// was an input to arena { characterNFT }
const Arena = ({boss, setBoss}) => {
  // State
  // const [gameContract, setGameContract] = useState(null);
  // const [boss, setBoss] = useState(null);

  // UseEffects
  useEffect(() => {


  }, []);
  // Actions
  const runAttackAction = async () => {};

  return (
    <div className="arena-container">
      {/* Replace your Boss UI with this */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content`}>
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