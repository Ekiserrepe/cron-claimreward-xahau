# Xahau ClaimReward Automation with CronSet

Automated system for claiming Xahau rewards using Hooks and CronSet transactions. This project provides tools to calculate, schedule, and automate ClaimReward transactions on the Xahau network.


## ✨ Features

- 📊 Check account reward status and balance
- 🧮 Calculate next claim time automatically
- ⏰ Schedule automated claims using CronSet
- 🪝 Install Hooks for automated claim execution
- 🛡️ Safety margin calculations for timing precision

## 📦 Prerequisites

- Node.js >= 14.0.0
- npm or yarn
- Xahau account with sufficient balance
- Account seed (for transactions)

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/Ekiserrepe/cron-claimreward-xahau.git
cd cron-claimreward-xahau

# Install dependencies
npm install

# Or using yarn
yarn install
```

## 📁 Project Structure

```
cron-claimreward-xahau/
├── accountSet.js          # Configure account settings
├── checkAccount.js        # Check account info and calculate next claim
├── cronSet.js             # Set up automated CronSet transaction
├── installHook.js         # Install ClaimReward Hook
├── uninstallCronSet.js   # Remove existing CronSet schedule
├── uninstallHook.js      # Remove installed ClaimReward Hook
├── clearAccountFlag.js   # Clear the AccountSet hook flag
├── claimReward.c          # C Hook for automated claiming
├── package.json           # Project dependencies
└── README.md              # This file
```

## 🎯 Usage

### Setup Workflow

Follow these steps in order to set up automated rewards claiming:

### 1. Configure Account Settings (AccountSet)

First, configure your account settings:

```bash
npm run accountset
# or
node accountSet.js
```

This sets up basic account configuration on Xahau.

### 2. Install ClaimReward Hook

Install the Hook that will handle automated claiming:

```bash
npm run installhook
# or
node installHook.js
```

This deploys the ClaimReward Hook (claimReward.c) to your account. The hookhash available in both networks is '805351CE26FB79DA00647CEFED502F7E15C2ACCCE254F11DEFEDDCE241F8E9CA'. If you don't trust it, you can build your own from claimReward.c

### 3. Set Up Automated Claims with CronSet

Set up the automated schedule.

First, check your account to get the correct StartTime:

```bash
node checkAccount.js
```

**Output:**
```
=== ACCOUNT INFO ===

Address: rYourAddress...
Balance: 999593284 drops
Balance (XAH): 999.593284 XAH
Sequence: 817032697
RewardTime: 817034201
RewardLgrFirst: 3776333
RewardLgrLast: 3777131

Account exists: true
Is opted in to rewards: true

=== NEXT CLAIM INFO ===

Next Claim Date: 2025/12/21, 1:09:41 PM

⭐ For cronSet.js:
StartTime: 819634181
StartTime + 1 hour (for safety): 819637781 - 2025/12/21, 2:09:41 PM

DelaySeconds (30d 3h 13m): 2603580
```

Then configure and run CronSet:

```bash
# Edit cronSet.js first:
# - Set your seed
# - Set StartTime from checkAccount.js output (or 0 if first time, never opt-in before)
# - Set DelaySeconds (use 2603580 for 30d 3h 13m)
# - Set RepeatCount (number of times to repeat, 256 is the max)

npm run cronset
# or
node cronSet.js
```

If you need to remove the automation later:

```bash
npm run uninstallcron
# or
node uninstallCronSet.js

npm run uninstallhook
# or
node uninstallHook.js

npm run clearflag
# or
node clearAccountFlag.js
```

**StartTime Options:**
- **If first opt-in**: `StartTime: 0` (if you never opt-in before)
- **If already claimed before**: Use the calculated `StartTime` from `checkAccount.js`
- **For safety**: Use `StartTime + 1 hour` value from `checkAccount.js`

## ⚙️ Configuration

### Environment Setup

Edit the relevant JavaScript files and configure:

```javascript
const seed = 'sYourSeedHere';           // Your account seed
const network = 'wss://xahau-test.net'; // Testnet
// const network = 'wss://xahau.network';  // Mainnet
```

### CronSet Configuration

In `cronSet.js`, configure these parameters:

```javascript
{
  "TransactionType": "CronSet",
  "Account": "rYourAddress",
  "StartTime": 819637781,        // From checkAccount.js (with safety margin)
  "RepeatCount": 12,             // Number of claims (e.g., 12 for 1 year, 256 is the max number allowed)
  "DelaySeconds": 2603580,       // 30 days, 3 hours, 13 minutes
}
```

## 📊 Important Constants

### Time Constants

- **RIPPLED_EPOCH_OFFSET**: `946684800` seconds (difference between Unix Epoch and Rippled Epoch)
- **REWARD_DELAY_SECONDS**: `2599980` seconds (30 days, 2 hours, 13 minutes)
- **RECOMMENDED_DELAY**: `2603580` seconds (30 days, 3 hours, 13 minutes - with 1 hour safety margin)


### Genesis Issuer

- **Address**: `rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh`

## 🔧 How It Works

### Xahau Rewards System

1. **Opt-In**: Account must submit an initial `ClaimReward` transaction
2. **Claiming**: After opt-in, rewards can be claimed every ~30 days
3. **Timing**: Exact delay is 30 days, 2 hours, 13 minutes (2,599,980 seconds)
4. **Automation**: Use CronSet to schedule automatic claims

### Workflow

```
1. Configure Account (accountSet.js)
   ↓
2. Install Hook (installHook.js)
   ↓
3. First Claim / Opt-In (Hook triggers automatically or manual claim)
   ↓
4. Check Account Status (checkAccount.js)
   ↓
5. Calculate Next Claim Time (automatically shown in checkAccount.js)
   ↓
6. Configure CronSet with StartTime + DelaySeconds (cronSet.js)
   ↓
7. Submit CronSet Transaction
   ↓
8. Automated Claims Execute on Schedule
```

**Important Notes:**
- **First time users**: Use `StartTime: 0` in CronSet for immediate first claim
- **Existing claimers**: Use calculated `StartTime` from `checkAccount.js`
- **Safety margin**: Add 1 hour to StartTime (use the "safety" value from checkAccount.js)

## 🛡️ Security Considerations

### Private Key Management

⚠️ **IMPORTANT**: Never commit your seed/private keys to version control

### Recommended Practices

1. **Test on Testnet First**: Always test with `wss://xahau-test.net`
2. **Verify Transactions**: Check transaction results before proceeding
3. **Use Safety Margins**: Add 1 hour to StartTime to ensure claim is available
4. **Monitor Execution**: Check that CronSet transactions execute successfully
5. **XAH balance**: Add enough XAH in your account to be able to run all the transactions you are expecting.

### Network Selection

```javascript
// Testnet (for testing)
const network = 'wss://xahau-test.net';;

// Mainnet (for production)
const network = 'wss://xahau.network';
```

## 📚 Resources

- [Xahau Documentation](https://xahau.network/docs)
- [Xahau Hooks Documentation](https://xahau.network/docs/hooks)

## ⚠️ Special Thanks

Denis Angell and Satish from XRPL Labs for the original hook code and assitance. 
