// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

abstract contract FacetDemoStorage_v1_0 {
    struct FacetStorage {
        uint256 value1;
        bool value2;
    }

    // Creates and returns the storage pointer to the struct.
    function getStorage() internal pure returns (FacetStorage storage fs) {
        assembly {
            // keccak256("facet.demo.storage")
            fs.slot := 0x73c1df8bf99a0ecdcaaedd9afa8f44a73e31f47584a296442faf02a00c868ebb
        }
        return fs;
    }
}
