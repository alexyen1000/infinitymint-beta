{
  description = "InfinityMint Nix Flake";

  inputs = {
    nixpkgs = { url = "github:nixos/nixpkgs/nixos-unstable"; };
    npmlock2nix = {
      url = "github:winston0410/npmlock2nix/issue113";
      flake = false;
    };
    pnpm2nix = {
      url = "github:nix-community/pnpm2nix/master";
      flake = false;
    };
    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs = { nixpkgs.follows = "nixpkgs"; };
    };
  };

  outputs = { nixpkgs, flake-utils, npmlock2nix, pnpm2nix, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system};
      inputLock = (builtins.fromJSON (builtins.readFile ./package-lock.json));

        rewriteDep = package: package //
          (if package ? resolved then {
            resolved = "file://${pkgs.fetchurl {
              url = package.resolved;
              outputHashAlgo = builtins.elemAt (builtins.split "-" package.integrity) 0;
              outputHash = builtins.elemAt (builtins.split "-" package.integrity) 2;
            }}";
          } else {}) //
          (if package ? dependencies then {
            dependencies = rewriteDeps package.dependencies;
          } else {});

        rewriteDeps = dependencies: builtins.mapAttrs (name: rewriteDep) dependencies;

        outputLock = builtins.toJSON ({ lockfileVersion = 2; dependencies = rewriteDeps inputLock.dependencies; });

        infinitymint = pkgs.stdenv.mkDerivation {
          name = "infinitymint";

          nativeBuildInputs = [ pkgs.nodejs-18_x ];

          src = ./.;

          passAsFile = [ "packageLock" ];

          packageLock = outputLock;

          NO_UPDATE_NOTIFIER = true;

          installPhase = ''
            cp --no-preserve=mode -r $src $out
            cd $out
            cp $packageLockPath package-lock.json
            npm ci --production
          '';
        };
      in {
        lib = (pkgs.callPackage ./lib.nix {
          npmlock2nix = pkgs.callPackage npmlock2nix { };
          yarn2nix = pkgs.yarn2nix;
          pnpm2nix = pkgs.callPackage pnpm2nix { };
        });
        devShell = pkgs.mkShell {
            buildInputs = [
              pkgs.nodejs-18_x
              pkgs.libuuid
              pkgs.python3
              pkgs.pkg-config
            ];
          };

          dockerImage = pkgs.dockerTools.buildImage {
            name = "infinitymint";
            tag = "latest";

            config = {
              Cmd = [ "${pkgs.nodejs-18_x}/bin/node" "./dist/index.js" ];
              ExposedPorts = {
                "3000/tcp" = {};
                "80/tcp" = {};
                "443/tcp" = {};
              };
            };
          };
      });
}