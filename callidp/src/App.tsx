import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useAnchorWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Program, web3, BN } from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import React, { FC, ReactNode, useMemo } from "react";
import idl from "./idl.json";
import idl_mint from "./mint_nft.json";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider } from "@project-serum/anchor";

console.log(idl);

require("./App.css");
require("@solana/wallet-adapter-react-ui/styles.css");

const App: FC = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = () => {
  const wallet = useAnchorWallet();
  const baseAccount = web3.Keypair.generate();

  function getProvider() {
    if (!wallet) {
      return null;
    }
    // const network = "http://127.0.0.1:8899";
    // const connection = new Connection(network, "processed");
    const connection = new Connection(clusterApiUrl("devnet"), "processed");
    // const network = "http://127.0.0.1:8899";
    // const connection = new Connection(network, "processed");

    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );

    return provider;
  }

  async function createCounter() {
    // data nft
    const testNftTitle = Buffer.from("Enouvo", "utf-8");
    const testNftSymbol = Buffer.from("Enouvo", "utf-8");
    const testNftUri = Buffer.from("https://raw.githubusercontent.com/DevThienVKU/NFT/main/NFT_Enouvo.json", "utf-8");
    
    // Token metadata program ID
    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    const provider = getProvider();

    if (!provider) {
      return;
    }

    //mint account
    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: provider.wallet.publicKey,
    });

    console.log(`Address: ${provider.wallet.publicKey}`);

    console.log(`New token: ${mintKeypair.publicKey}`);

    // metadata adrress
    const metadataAddress = (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    console.log("Metadata initialized");

    // master edition address
    const masterEditionAddress = (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    console.log("Master edition metadata initialized");

    const a = JSON.stringify(idl_mint);
    const b = JSON.parse(a);
    const program = new Program(b, idl_mint.metadata.address, provider);
    console.log("program", idl_mint.metadata.address);
    try {
      await program.methods
        .mint(testNftTitle, testNftSymbol, testNftUri)
        .accounts({
          masterEdition: masterEditionAddress,
          metadata: metadataAddress,
          mint: mintKeypair.publicKey,
          tokenAccount: tokenAddress,
          mintAuthority: provider.wallet.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([mintKeypair])
        .rpc();
    } catch (err) {
      console.log("Transcation error: ", err);
    }
  }

  // async function increment() {
  //     const provider = getProvider();

  //     if (!provider) {
  //         return;
  //     }

  //     const a = JSON.stringify(idl);
  //     const b = JSON.parse(a);
  //     const program = new Program(b, idl.metadata.address, provider);
  //     try {
  //         await program.rpc.increment({
  //             accounts: {
  //                 myAccount: baseAccount.publicKey,
  //             },
  //         });

  //         const account = await program.account.myAccount.fetch(baseAccount.publicKey);
  //         console.log('account: ', account.data.toString());
  //     }
  //     catch (err) {
  //         console.log("Transcation error: ", err);
  //     }
  // }

  // async function decrement() {
  //     const provider = getProvider();

  //     if (!provider) {
  //         return;
  //     }

  //     const a = JSON.stringify(idl);
  //     const b = JSON.parse(a);
  //     const program = new Program(b, idl.metadata.address, provider);
  //     try {
  //         await program.rpc.decrement({
  //             accounts: {
  //                 myAccount: baseAccount.publicKey,
  //             },
  //         });

  //         const account = await program.account.myAccount.fetch(baseAccount.publicKey);
  //         console.log('account: ', account.data.toString());
  //     }
  //     catch (err) {
  //         console.log("Transcation error: ", err);
  //     }
  // }

  // async function update() {
  //     const provider = getProvider();
  //     if (!provider) {
  //         return;
  //     }

  //     const a = JSON.stringify(idl);
  //     const b = JSON.parse(a);
  //     const program = new Program(b, idl.metadata.address, provider);
  //     try {
  //         await program.rpc.update(new BN(100), {
  //             accounts: {
  //                 myAccount: baseAccount.publicKey,
  //             },
  //         });

  //         const account = await program.account.myAccount.fetch(baseAccount.publicKey);
  //         console.log('account: ', account.data.toString());
  //     }
  //     catch (err) {
  //         console.log("Transcation error: ", err);
  //     }
  // }

  return (
    <div className="App">
      <button onClick={createCounter}>Initialize</button>
      {/* <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
            <button onClick={update}>Update</button> */}
      <WalletMultiButton />
    </div>
  );
};
