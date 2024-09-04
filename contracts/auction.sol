//SPDX-License-Identifier :MIT

pragma solidity ^0.8.24;

contract Auction{

address public currentOwner;
uint256 public currentPrice;
uint256 public constant INITIAL_PRICE = 0.001 ether;
uint256 public constant MIN_INCREMENT_PERCENTAGE = 10;

struct PreviousOwner {
    address ownerAddress;
    uint256 ownerPrice;
}
 
PreviousOwner[] public previousOwners;

constructor () {
    currentOwner = msg.sender;
    currentPrice = INITIAL_PRICE ;
}

event ownershipTransferred(address indexed previousOwner, address indexed newOwner, uint256 price);

function updateOwner () public payable {
    require(msg.value>=currentPrice+(currentPrice*MIN_INCREMENT_PERCENTAGE/100),"Price too low");

PreviousOwner memory newPreviousOwner = PreviousOwner({
    ownerAddress : currentOwner,
    ownerPrice : currentPrice
});

previousOwners.push(newPreviousOwner);

    address previousOwner = currentOwner;
    currentOwner = msg.sender;
    currentPrice = msg.value;
    emit ownershipTransferred(previousOwner, currentOwner,currentPrice);

}

function getHistory() public view returns (PreviousOwner[] memory){
    return previousOwners;
}

}