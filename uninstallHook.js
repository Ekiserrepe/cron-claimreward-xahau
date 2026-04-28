const xahau = require('xahau');

const seed = 'sYourSeedHere'; // Replace with your actual seed, get one at https://xahau-test.net/
const network = "wss://xahau-test.net";

async function uninstallHook() {
  const client = new xahau.Client(network);
  const wallet = xahau.Wallet.fromSecret(seed);
  console.log(`Account: ${wallet.address}`);

  try {
    await client.connect();
    console.log('Connected to Xahau');

    const prepared = {
      "TransactionType": "SetHook",
      "Account": wallet.address,
      "Hooks": [
        {
          Hook: {
            "CreateCode": "",
            "Flags": 1, 
          },
        },
      ],
    };

    console.log("Prepared SetHook uninstall transaction:", JSON.stringify(prepared, null, 2));

    const tx = await client.submit(prepared, { wallet });
    console.log("Transaction result:", JSON.stringify(tx, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Xahau');
  }
}

uninstallHook();
