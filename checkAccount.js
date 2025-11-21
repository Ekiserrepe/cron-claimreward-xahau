const { Client } = require('xahau');

// Constants
const RIPPLED_EPOCH_OFFSET = 946684800;
const REWARD_DELAY_SECONDS = 2599980; // 30 days, 2 hours, 13 minutes

async function checkAccount() {
  const client = new Client('wss://xahau-test.net');
  const address = 'yourAddress';

  try {
    await client.connect();
    console.log('Connected to Xahau Testnet\n');

    const { result } = await client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
    });

    console.log('=== ACCOUNT INFO ===\n');
    console.log('Address:', address);
    console.log('Balance:', result.account_data.Balance, 'drops');
    console.log('Balance (XAH):', (parseInt(result.account_data.Balance) / 1000000).toFixed(6), 'XAH');
    console.log('Sequence:', result.account_data.Sequence);
    console.log('RewardTime:', result.account_data.RewardTime || 'Not set (not opted in)');
    console.log('RewardLgrFirst:', result.account_data.RewardLgrFirst || 'Not set');
    console.log('RewardLgrLast:', result.account_data.RewardLgrLast || 'Not set');
    console.log('\nAccount exists:', true);
    console.log('Is opted in to rewards:', !!result.account_data.RewardTime);

    // Calculate next claim time if opted in
    if (result.account_data.RewardTime) {
      const rewardTime = parseInt(result.account_data.RewardTime);
      const nextClaimTime = rewardTime + REWARD_DELAY_SECONDS;
      const nextClaimDate = new Date((nextClaimTime + RIPPLED_EPOCH_OFFSET) * 1000);

      // Calculate with 1 hour safety margin
      const nextClaimTimeSafe = nextClaimTime + 3600; // +1 hour (3600 seconds)
      const nextClaimDateSafe = new Date((nextClaimTimeSafe + RIPPLED_EPOCH_OFFSET) * 1000);

      // Format date as YYYY/MM/DD, time as 12-hour format
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const timeString = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        return `${year}/${month}/${day}, ${timeString}`;
      };

      console.log('\n=== NEXT CLAIM INFO ===\n');
      console.log('Next Claim Date:', formatDate(nextClaimDate));
      console.log('\n⭐ For cronSet.js:');
      console.log('StartTime:', nextClaimTime);
      console.log('StartTime + 1 hour (for safety):', nextClaimTimeSafe, '-', formatDate(nextClaimDateSafe));

      // Calculate DelaySeconds for 30 days, 3 hours, 13 minutes
      const delaySeconds = (30 * 24 * 60 * 60) + (3 * 60 * 60) + (13 * 60);
      console.log('\nDelaySeconds (30d 3h 13m):', delaySeconds);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.disconnect();
  }
}

checkAccount();
