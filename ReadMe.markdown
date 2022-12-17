# InfinityMint by 0x0zAgency

## 🗿 Requirements

- Mac OSX (any version), Windows (XP, Vista, 7, 8, 10, 11), Debian (5+), Ubuntu (14+)
- Node **18.5.0** or Higher

## 🗿 Installation

First, run `npm install --build-from-source` in the root of the repository.
If you are not using the *InfinityChain*, then you will first need to start *ganache*.
To do this, enter a `GANACHE_URL` within your `.env`.

### ⛔️ OpenSSL Legacy Provider

You might encounter an error regarding ESVP being unsupported on your machine.
To solve this, simply run the following in a terminal before you run `npm run start`.

`export NODE_OPTIONS=--openssl-legacy-provider`

### ⛔️ NODE_OPTIONS: --openssl-legacy-provider is invalid

You might encounter this error if you are trying to run InfinityMint at a lower version than node **18.15.0**.
To fix this, simply head to the `.env` file in this repository and remove the `NODE_OPTIONS` line.

*** 🗿 Getting Started

By default, *InfinityMint* will be ready to go.
You can use your arrow keys to navigate the menus and you can press enter to select an option.
The default project will be set to *PartyTime*, a slightly complex *InfinityMint* project which shows off many of the features of the minter.
You can deploy it via the `deploy_project` button.

When you first deploy, InfinityMint will ask for a *export* location.
This is going to be either *InfinityMint* or *InfinityMint-classic* depending on what you cloned earlier in the installation phase.

An /export/ is simply a website or location InfinityMint will export assets and smart contract **ABI**s,
& can be configured to the projects demands.

The projects which are used by InfinityMint are stored in a a folder called *projects* located in the repository.

### 🗿 Resources

[Official Documentation](<https://docs.infinitymint.app>)
[TypeDoc Documentation](<https://typedoc.org/>)
