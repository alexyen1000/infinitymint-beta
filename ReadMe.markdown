# InfinityMint by 0x0zAgency

## 🗿 Requirements

-   Mac OSX (any version), Windows (XP, Vista, 7, 8, 10, 11), Debian (5+), Ubuntu (14+)
-   Node **16.0.0** or Higher
-   (Optional) Nix

## 🗿 Installation

`npm i infinitymint`

InfinityMint also provides a working [_Nix_](https://nixos.org) setup out of the box for development.
This is to prevent conflicts in environment between the end developer & shipping to production.

Access to the environment is provided via a _Nix Flake._ To enter;
`nix develop`

InfinityMint works with both Javascript and Typescript and can be used in both the browser and in node.

## 🗿 Setup

You will need to create a new file in the current working directory (the one with your package.json) or the node project called `hardhat.config.js` or `hardhat.config.ts`, depending on if you are using InfinityMint in a TypeScript or Javascript environment.

Please either download the configuration file and place it in your node projects root or copy the following contents into your hardhat configuration file. If you are bringing InfinityMint into an already established hardhat project. Then simply backup the contents of your current hardhat configuration file as you will be able to place it into InfinityMint's configuration file instead.

[Link to hardhat.config.ts (for ts)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/hardhat.config.ts)

[Link to hardhat.config.js (for js)](https://github.com/0x0zAgency/infinitymint-beta/blob/master/examples/js/hardhat.config.js)

InfinityMint will automatically create a `infinitymint.config.ts` or `infinitymint.config.js` depending on the environment. This new project file which is created is where you configure both hardhat and InfinityMint and other things which can be installed into InfinityMint.

Please view our official documentation and [examples](https://docs.infinitymint.app/modules/examples_examples.html) for more information.

## 🗿 Documentation

[Official Documentation](https://docs.infinitymint.app)</br>
[TypeDoc Documentation](https://typedoc.org/)
