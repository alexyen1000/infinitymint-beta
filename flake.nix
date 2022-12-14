{
  description = "InfinityMint Nix Flake";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    npmlock2nix = {
      url = "github:nix-community/npmlock2nix/master";
      flake = false;
    };
  };
  outputs = {
    self,
    nixpkgs,
    flake-utils,
    npmlock2nix,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages."${system}";
      nl2nix = import npmlock2nix {inherit pkgs;};
      node = pkgs.nodejs-16_x;
      nodeModules = nl2nix.node_modules {
        src = ./.;
        nodejs = node;
      };
    in rec {
      defaultPackage = package.nodenix;
      package.nodenix = nl2nix.build {
        src = ./.;
        buildCommands = ["npm run build"];
        installPhase = ''
        npm i
        '';
        # Use this specific node version.
        node_modules_attrs = {
          nodejs = node;
        };
      };

      devShell = nl2nix.shell {
        src = ./.;
        node_modules_attrs = {
          nodejs = node;
        };
        nativeBuildInputs =
          (with pkgs; ([
            # Alejandra is used for nix file formatting
            alejandra
          ]
        ));
      };
    });
}