//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import "./Authentication.sol";
import "./IERC721.sol";
import "./IntegrityInterface.sol";

contract InfinityMintWallet is
	Authentication,
	IERC721Receiver,
	IntegrityInterface,
	InfinityMintObject
{
	/// @notice the version type of wallet this is
	bytes public walletType = "Wallet";
	/// @notice the location of the main ERC721 contract this wallet was spawned from;
	address public erc721;
	/// @notice the main ERC721 contract this wallet is attached too
	uint32 public currentTokenId;
	/// @notice the value/balance of the current wallet
	uint256 private walletValue;

	/// @notice Fired when a deposit is made
	event Deposit(address indexed sender, uint256 amount, uint256 newTotal);
	/// @notice Fired with a withdraw is made
	event Withdraw(address indexed sender, uint256 amount, uint256 newTotal);

	/// @notice Creates new wallet contract, tokenId refers to the ERC721 contract this wallet was spawned from.
	/// @dev makes the owner field the owner of the contract not the deployer.
	/// @param tokenId the tokenId from the main ERC721 contract
	/// @param erc721Destination the main ERC721 contract
	constructor(uint32 tokenId, address erc721Destination) Authentication() {
		//this only refers to being allowed to deposit into the wallet
		currentTokenId = tokenId;
		erc721 = erc721Destination;
		walletValue = 0;
	}

	/// @notice used by InfinityMintLinker to verify this contract is the one it says
	function getIntegrity()
		public
		view
		virtual
		returns (
			address,
			address,
			uint256,
			bytes memory,
			bytes4
		)
	{
		return (
			address(this),
			deployer,
			currentTokenId,
			"wallet", //no version type with wallet
			type(IntegrityInterface).interfaceId
		);
	}

	/// @notice Opts in this contract to receipt ERC721
	function onERC721Received(
		address,
		address,
		uint256,
		bytes calldata
	) external pure returns (bytes4) {
		return IERC721Receiver.onERC721Received.selector;
	}

	/**
		@notice This can be called by the new token owner at any time and it will match the current owner of the contract to the tokenId,
		in all cases the wallet will still be attached to the owner of the tokenId and when its not it will simply move over permissions of
		the contract to the new owner
	 */
	function transferOwnershipToTokenOwner() public onlyOnce {
		address owner = IERC721(erc721).ownerOf(currentTokenId);
		require(deployer != owner, "owner of the token is the deployer");
		require(sender() == owner, "sender must be the new owner");

		transferOwnership(owner);
	}

	/// @notice Allows anyone to pay this contract address directly
	receive() external payable {
		receiveTokens(value());
	}

	function receiveTokens(uint256 value) internal {
		require(value >= 0);

		walletValue = walletValue + value;
		emit Deposit(sender(), value, walletValue);
	}

	function transfer(
		address erc721Destination,
		address to,
		uint256 tokenId
	) public onlyApproved {
		(bool success, bytes memory returnData) = erc721Destination.call{
			value: 0
		}(
			abi.encodeWithSignature(
				"transfer(address,address,uint256)",
				address(this),
				address(to),
				tokenId
			)
		);

		if (!success) {
			if (returnData.length == 0) revert("call reverted");
			else
				assembly {
					let returndata_size := mload(returnData)
					revert(add(32, returnData), returndata_size)
				}
		}
	}

	/// @notice Returns the balance of the wallet
	function getBalance() public view returns (uint256) {
		return walletValue;
	}

	/// @notice Allows anyone to deposit ERC20 into this wallet.
	function deposit() public payable onlyOnce {
		receiveTokens(value());
	}

	/// @notice Allows you to withdraw
	function withdraw() public onlyOnce onlyApproved {
		//to stop re-entry attack
		uint256 balance = (walletValue);
		walletValue = 0;
		payable(deployer).transfer(balance);
		emit Withdraw(sender(), address(this).balance, walletValue);
	}
}
