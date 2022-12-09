import { Connection, PublicKey } from "@solana/web3.js";

(async () => {
  const connection = new Connection("https://api.devnet.solana.com");
  const tokenMint = "4PAffbmnPRCS3YTr1ENtJXsmV2qyY9GFssNDHb9yhQcN";

  const largestAccounts = await connection.getTokenLargestAccounts(
    new PublicKey(tokenMint)
  );
  const largestAccountInfo = await connection.getParsedAccountInfo(
    largestAccounts.value[0].address
  );
  console.log(largestAccountInfo.value.data.parsed.info.owner);
  /*
    PublicKey {
        _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
    }
     */
})();