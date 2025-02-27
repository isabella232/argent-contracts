/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */
require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
// const deployManager = require("./utils/deploy-manager.js");

const AWSWalletProvider = require("./utils/aws-wallet-provider.js");

const _gasPrice = (process.env.DEPLOYER_GAS_PRICE || "").replace(/_/g, "") || 20_000_000_000;
const _gasLimit = (process.env.DEPLOYER_GAS_LIMIT || "").replace(/_/g, "") || 8_000_000;

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "1597649375983",
    },

    private: {
      provider: () => new HDWalletProvider(process.env.PRIVATE_NETWORK_MNEMONIC, process.env.PRIVATE_NETWORK_URL),
      network_id: process.env.PRIVATE_NETWORK_ID
    },

    dev: {
      provider: () => new AWSWalletProvider(
        `https://rinkeby.infura.io/v3/${process.env.INFURA_KEY}`,
        "argent-smartcontracts-dev",
        "backend/deploy.key"
      ),
      network_id: 4, // rinkeby
      gas: _gasLimit,
      gasPrice: _gasPrice
    },

    test: {
      provider: () => new AWSWalletProvider(
        `https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`,
        "argent-smartcontracts-test",
        "backend/deploy.key"
      ),
      network_id: 3, // ropsten
      gas: _gasLimit,
      gasPrice: _gasPrice
    },

    staging: {
      provider: () => new AWSWalletProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
        "argent-smartcontracts-staging",
        "backend/deploy.key"
      ),
      network_id: 1, // mainnet
      gas: _gasLimit,
      gasPrice: _gasPrice,
    },

    prod: {
      provider: () => new AWSWalletProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
        "argent-smartcontracts-prod",
        "backend/deploy.key"
      ),
      network_id: 1, // mainnet
      gas: _gasLimit,
      gasPrice: _gasPrice,
    },

    prodFork: {
      host: "localhost",
      port: 3601,
      gasPrice: 0,
      network_id: "1",
      networkCheckTimeout: 5 * 60e3, // 5 minutes
    },

    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`),
    // network_id: 3,       // Ropsten's id
    // gas: 5_500_000,      // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },

    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    useColors: true,
    timeout: 1_000_000,
    reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
      onlyCalledMethods: true,
      excludeContracts: ["Migrations"],
      outputFile: "gas-usage-report.log"
    },
  },

  plugins: ["solidity-coverage", "truffle-plugin-verify", "truffle-flatten"],

  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
};
