// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library Helpers {

    function stringToBytes(string memory data) internal pure returns (bytes memory) {
        bytes memory temp = bytes(data);
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

    function decodeBytesToUint32Array(bytes memory input) internal pure returns (uint32[] memory) {

        string memory decodedString = string(input);

        bytes memory data = stringToBytes(decodedString);

        require(data.length % 4 == 0, "Data length must be a multiple of 4");

        uint32[] memory decodedArray = new uint32[](data.length / 4);

        for (uint256 i = 0; i < decodedArray.length; i++) {
            decodedArray[i] = toUint32(data, i * 4);
        }

        return decodedArray;
    }

    function toUint32(bytes memory data, uint256 startIndex) internal pure returns (uint32) {
        require(startIndex + 4 <= data.length, "Index out of bounds");

        uint32 value;
        assembly {
            value := mload(add(add(data, 0x4), startIndex))
        }
        return value;
    }

    function splitConcatenatedAddresses(bytes memory input) internal pure returns (address[] memory) {

        string memory decodedString = string(input);

        bytes memory data = stringToBytes(decodedString);

        require(data.length % 20 == 0, "Data length must be a multiple of 20 bytes");

        uint256 numberOfAddresses = data.length / 20;
        address[] memory addresses = new address[](numberOfAddresses);

        for (uint256 i = 0; i < numberOfAddresses; i++) {
            bytes memory addressBytes = new bytes(20);
            for (uint256 j = 0; j < 20; j++) {
                addressBytes[j] = data[i * 20 + j];
            }
            addresses[i] = bytesToAddress(addressBytes);
        }

        return addresses;
    }

    function bytesToAddress(bytes memory bys) internal pure returns (address addr) {
        assembly {
            addr := mload(add(bys, 20))
        }
    }
}