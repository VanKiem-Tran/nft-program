import React from "react";
import "./App.css";
import { create, CID, IPFSHTTPClient} from "ipfs-http-client";

// const { globSource} = require('ipfs-http-client')

const projectId = '2IcFd9q8opGynfMEI2l9Zj6y4lh';
const projectSecret = '7eed3b6d8ab65155aefa60ea4e90051b';
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

function App() {
  const [images, setImages] = React.useState<{ cid: CID; path: string }[]>([]);

  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: {
        authorization,
      },
    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }

  /**
   * @description event handler that uploads the file selected by the user
   */
  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const files = (form[0] as HTMLInputElement).files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];
    // upload files
    const result = await (ipfs as IPFSHTTPClient).add(metadata);

    console.log("metadata: ", result);
  };

  return (
    <div className="App">
      <header className="App-header">
        {ipfs && (
          <>
            <p>Upload File using IPFS</p>

            <form onSubmit={onSubmitHandler}>
              <input name="file" type="file" />

              <button type="submit">Upload File</button>
            </form>

            <div>
              {images.map((image, index) => (
                <img
                  alt={`Uploaded #${index + 1}`}
                  src={"https://nft-food-safety.infura-ipfs.io/ipfs/" + image.path}
                  style={{ maxWidth: "400px", margin: "15px" }}
                  key={image.cid.toString() + index}
                />
              ))}
            </div>
          </>
        )}

        {!ipfs && (
          <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
        )}
      </header>
    </div>
  );
}

export default App;

const metadata = JSON.stringify({
  name: "", // Name
  symbol: "", // Symbol
  description: "", // Descryption
  seller_fee_basis_points: 1,
  external_url: "", // Don't put anything in here. Just a web get all NFT certificate
  attributes: [
    {
      trait_type: "Food Safety NFT Certificate",
      value: "Custom",
    },
  ],
  colecction: {
    name: "NFT Certificate Food Satefy",
    family: "Certificate",
  },
  properties: {
    files: [
      {
        image: "", //link image uri
        doc: [  //link docs uri
          "",
          "",
          "",
        ],
      },
    ],
    category: "certificate",  
    maxSupply: 0,
    creator: [
      { 
        address: "", //user address
        share: 50,
      },
      {
        address: "", //admin address
        share: 50,
      },
    ],
  },
  image: "" //link image uri
});

