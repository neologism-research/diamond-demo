// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {DiamondCoreStorage} from "./DiamondCoreStorage.sol";

abstract contract DiamondOwnership is DiamondCoreStorage {
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function setContractOwner(address _newOwner) external {
        DiamondStorage storage ds = getStorage();

        address previousOwner = ds.contractOwner;
        ds.contractOwner = _newOwner;
        emit OwnershipTransferred(previousOwner, _newOwner);
    }

    function enforceIsContractOwner() internal view {
        DiamondStorage storage ds = getStorage();
        require(tx.origin == ds.contractOwner, "Enforced for contract owner only");
    }

    modifier onlyOwner() {
        DiamondStorage storage ds = getStorage();
        require(tx.origin == ds.contractOwner, "Restricted to contract owner only");
        _;
    }

    function getOwner() public view returns (address) {
        DiamondStorage storage ds = getStorage();
        return ds.contractOwner;
    }
}
