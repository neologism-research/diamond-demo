// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {DiamondCoreCut} from "./DiamondCoreCut.sol";
import {DiamondCoreStorage} from "./DiamondCoreStorage.sol";
import {DiamondCoreLoupe} from "./DiamondCoreLoupe.sol";

contract Diamond is DiamondCoreCut, DiamondCoreLoupe {
    receive() external payable {}

    fallback() external payable {
        DiamondStorage storage ds = getStorage();

        address facet = ds.selectorToFacetAndPosition[msg.sig].facetAddress;
        require(facet != address(0), "Diamond: Function does not exist");
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
