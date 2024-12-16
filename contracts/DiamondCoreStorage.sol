// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

abstract contract DiamondCoreStorage {
    struct FacetAddressAndPosition {
        address facetAddress;
        uint16 functionSelectorPosition; // position in facetFunctionSelectors.functionSelectors array
    }

    struct FacetFunctionSelectors {
        bytes4[] functionSelectors;
        uint16 facetAddressPosition; // position of facetAddress in facetAddresses array
    }

    struct DiamondStorage {
        address contractOwner; // owner of the contract
        // maps function selector to the facet address and
        // the position of the selector in the facetFunctionSelectors.selectors array
        mapping(bytes4 => FacetAddressAndPosition) selectorToFacetAndPosition;
        // maps facet addresses to function selectors
        mapping(address => FacetFunctionSelectors) facetFunctionSelectors;
        // facet addresses
        address[] facetAddresses;
        // Used to query if a contract implements an interface.
        // Used to implement ERC-165.
        mapping(bytes4 => bool) supportedInterfaces;
    }

    // Creates and returns the storage pointer to the struct.
    function getStorage() internal pure returns (DiamondStorage storage fs) {
        // keccak256("diamond.core.storage")
        assembly {
            fs.slot := 0xb08236d4879334bece1965ab3a812fad8e40dec4929b65f11b873dfaf386da86
        }
        return fs;
    }
}
