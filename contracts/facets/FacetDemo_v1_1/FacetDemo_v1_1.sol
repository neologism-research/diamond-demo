// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {FacetDemoStorage_v1_1} from "./FacetDemoStorage_v1_1.sol";

contract FacetDemo_v1_1 is FacetDemoStorage_v1_1 {
    function getValue1() external view returns (uint256) {
        return getStorage().value1;
    }

    function setValue1(uint256 _value) external {
        getStorage().value1 = _value * 2;
    }

    function getValue2() external view returns (bool) {
        return getStorage().value2;
    }

    function setValue2(bool _value) external {
        getStorage().value2 = _value;
    }
}
