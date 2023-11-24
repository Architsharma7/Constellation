// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library Helpers {

    function stringToBytes(string memory input) internal pure returns (bytes memory) {
        bytes memory temp = bytes(input);
        require(temp.length >= 2, "Source string not properly formatted.");
        require(temp[0] == '0' && (temp[1] == 'x' || temp[1] == 'X'), "Source string must start with '0x'.");

        if (temp.length == 2) {
            // String is only '0x'
            return new bytes(0);
        }

        uint256 byteLength = (temp.length - 2) / 2;
        bytes memory byteArray = new bytes(byteLength);
        
        for (uint256 i = 2; i < temp.length; i += 2) {
            byteArray[(i - 2) / 2] = bytes1(toByte(temp[i]) * 16 + toByte(temp[i + 1]));
        }

        return byteArray;
    }

    function toByte(bytes1 char) internal pure returns (uint8) {
        uint8 byteValue = uint8(char);
        if (byteValue >= 48 && byteValue <= 57) {  // '0' - '9'
            return byteValue - 48;
        }
        if (byteValue >= 97 && byteValue <= 102) { // 'a' - 'f'
            return byteValue - 97 + 10;
        }
        if (byteValue >= 65 && byteValue <= 70) {  // 'A' - 'F'
            return byteValue - 65 + 10;
        }
        revert("Invalid character in string");
    }

    function decodeUint16ArrayRLE(bytes memory data) internal pure returns (uint16[] memory) {
        require(data.length % 4 == 0, "Data length must be a multiple of 4");

        uint256 decodedSize = 0;

        // First pass: calculate the total size of the decoded array
        for (uint256 i = 0; i < data.length; i += 4) {
            uint16 count = toUint16(data, i);
            decodedSize += count;
        }

        uint16[] memory decodedArray = new uint16[](decodedSize);
        uint256 decodedIndex = 0;

        // Second pass: decode the RLE data
        for (uint256 i = 0; i < data.length; i += 4) {
            uint16 count = toUint16(data, i);
            uint16 value = toUint16(data, i + 2);
            for (uint16 j = 0; j < count; j++) {
                decodedArray[decodedIndex++] = value;
            }
        }

        return decodedArray;
    }

    function toUint16(bytes memory data, uint256 startIndex) internal pure returns (uint16) {
        require(startIndex + 2 <= data.length, "Index out of bounds");
        uint16 value;
        assembly {
            value := mload(add(add(data, 0x2), startIndex))
        }
        return value;
    }
}