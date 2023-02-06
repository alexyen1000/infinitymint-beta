//SPDX-License-Identifier: UNLICENSED
//llydia cross 2021
pragma solidity ^0.8.0;

import './RaritySVG.sol';

contract RarityImage is RaritySVG {
    constructor(string memory _tokenName, address valuesContract)
        RaritySVG(_tokenName, valuesContract)
    {
        tokenName = _tokenName;
        typeOf = 'image'; //returns an image (png, jpeg)
    }
}
