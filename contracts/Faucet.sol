//SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";

import "./IFaucet.sol";

contract Faucet is Owned, IFaucet {
    uint256 public numOfFunders;
    mapping(uint256 => address) private funders;
    mapping(address => bool) private isExist;
    // this event emits when someone call the Function addFunds(),
    //this will give you the address and value
    event funderAdded(address funder, uint256 value);

    event withdrawal(address receiver, uint256 value);

    constructor() {
        owner = msg.sender;
    }

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 0.1 ether,
            "Can not withdraw more than 0.1 ether "
        );
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    // this is payable function which helps to receive ethers into this contract account
    receive() external payable {}

    // this function helps to receive ether to this contract and also add the funder to a mapping
    // funders and store the information
    function addFunds() external payable override {
        emit funderAdded(msg.sender, msg.value);
        if (!isExist[msg.sender]) {
            isExist[msg.sender] = true;
            uint256 index = numOfFunders++;
            funders[index] = msg.sender;
        }
    }

    // This will give you the funder at specific index
    function getFunderAtIndex(uint256 index) external view returns (address) {
        return funders[index];
    }

    // This will give you all funders who funded this contract
    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = funders[i];
        }
        return _funders;
    }

    // this will withdraw the ethereum from contract.
    function withdraw(uint256 _amount)
        external
        override
        limitWithdraw(_amount)
    {
        emit withdrawal(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }
}
