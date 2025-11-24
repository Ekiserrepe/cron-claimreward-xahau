const xahau = require('xahau');
const { derive, utils, signAndSubmit } = require("xrpl-accountlib");

const seed = 'sYourSeedHere'; // Replace with your actual seed, get one at https://xahau-test.net/
const network = "wss://xahau-test.net";

async function installHook() {
  const client = new xahau.Client(network);
  const account = derive.familySeed(seed, { algorithm: "secp256k1" });
  console.log(`Account: ${account.address}`);

  try {
    await client.connect();
    console.log('Connected to Xahau');

    const networkInfo = await utils.txNetworkAndAccountValues(network, account);

    const prepared = {
      "TransactionType": "SetHook",
      "Account": account.address,
      "Hooks": [
        {
          "Hook": {
            "HookHash": "805351CE26FB79DA00647CEFED502F7E15C2ACCCE254F11DEFEDDCE241F8E9CA",
            "HookNamespace": "0000000000000000000000000000000000000000000000000000000000000000",
            "HookOn": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFBFFFFF",
            "HookCanEmit": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFFFFFFFFFFFFFFFFBFFFFF", //Can emit ClaimReward
            "Flags": 4
          }
        }
      ],
      ...networkInfo.txValues,
    };

    console.log("Prepared SetHook transaction:", JSON.stringify(prepared, null, 2));

    const tx = await signAndSubmit(prepared, network, account);
    console.log("Transaction result:", JSON.stringify(tx, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Xahau');
  }
}

installHook();
