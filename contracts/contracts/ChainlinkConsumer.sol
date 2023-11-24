// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./library/Helpers.sol";

/**
 * @title ChainlinkConsumer
 * @notice 
 * @dev 
 */
abstract contract ChainlinkConsumer is FunctionsClient, Ownable , ERC20 {

    using FunctionsRequest for FunctionsRequest.Request;

    // uint256 month = 31 days;

    uint256 MIN = 60;

    uint256 public interval = 15 * MIN; // interval specifies the time between upkeeps

    uint256 public lastTimeStamp; // lastTimeStamp tracks the last upkeep performed

    address public s_forwarderAddress;

    uint64 subscriptionId;

    uint256 agentPlaceTreasury;

    // Router address Check to get the router address for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    address oracle;
    // JavaScript source code
    string source;
    //Callback gas limit
    uint32 gasLimit;
    // donID
    bytes32 donID;

    struct AgentStruct {
        address creator;
        address lockAddress;
        bool isOpenForContributions;
    }

    mapping(uint16 => AgentStruct) public agents;

    mapping(uint16 => uint16) agentVersions;

    mapping(uint8 => uint8) public topKAgentsSplitRewards;

    mapping(bytes32 => bytes) private round_winners;
    
    uint8 topK;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);

    // Event to log responses
    event Response(
        bytes32 indexed requestId,
        bytes response
    );

    /// @notice Initializes the contract
    /// @param _oracle The address of the Chainlink Function oracle
    /// @param _donID Chainlink's contract chainID => donID 
    /// @param _subscriptionId The subscription ID for Chainlink Functions
    /// @param _source The source code for the Chainlink Functions request
    /// @param _gasLimit The gas limit for the Chainlink Functions request callback
    constructor(
        address _oracle,
        bytes32 _donID,
        uint64 _subscriptionId,
        string memory _source,
        uint32 _gasLimit,
        uint8 _topK,
        uint8[] memory splits
    ) FunctionsClient(_oracle) ERC20("D_AI_AGENTS", "DAIA"){
        require(_topK == splits.length, "error must be equal");
        for(uint8 i = 0; i < _topK; i++){
            topKAgentsSplitRewards[i] = splits[i];
        }
        topK = _topK;

        subscriptionId = _subscriptionId;
        // Source to handle agents usage updates by our end
        source = _source;

        lastTimeStamp = block.timestamp;
        gasLimit = _gasLimit;
        donID = _donID;
    }

    // function checkUpkeep(
    //     bytes calldata /*checkData*/
    // ) external view returns (bool, bytes memory) {
    //     bool needsUpkeep = (block.timestamp - lastTimeStamp) > interval;
    //     return (needsUpkeep, bytes(""));
    // }

    // function performUpkeep(bytes calldata /*performData*/) external {
    //     bool needsUpkeep = (block.timestamp - lastTimeStamp + 60) > interval;
    //     require(needsUpkeep);
    //     // require(
    //     //     msg.sender == s_forwarderAddress,
    //     //     "This address does not have permission to call performUpkeep"
    //     // );
    //     lastTimeStamp = block.timestamp;
    //     sendRequest();
    // }

    /// @notice Set the address that `performUpkeep` is called from
    /// @dev Only callable by the owner
    /// @param forwarderAddress the address to set
    function setForwarderAddress(address forwarderAddress) external onlyOwner {
        s_forwarderAddress = forwarderAddress;
    }

    /**
     * @notice Sends an HTTP request for character information
     */
    function sendRequest(
        // string[] calldata args
    ) external {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source); // Initialize the request with JS code

        // Send the request and store the request ID
        _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
    }

    /**
     * @notice Callback function for fulfilling a request
     * @param requestId The ID of the request to fulfill
     * @param response The HTTP response data
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory /* err */
    ) internal override {

        round_winners[requestId] = response;
        // Emit an event to log the response
        emit Response(requestId, response);
    }

    function rewardsDistribution(bytes32 _requestID) external{
        string memory winners = string(round_winners[_requestID]);

        bytes memory decodedResponse = Helpers.stringToBytes(winners);

        uint16[] memory topkAgents = Helpers.decodeUint16ArrayRLE(decodedResponse);

        for(uint8 i = 0; i < topkAgents.length; i++){
            address tempWinner = agents[topkAgents[i]].creator;
            uint256 tempReward = topKAgentsSplitRewards[i];
            // Minting tokens to the topK agents 
            _mint(tempWinner, tempReward * 10 ** 16);
        }
    }

    // /**
    //  * @notice Function to renew the topK agents splits sum much be dividable with 10
    //  * @param _topK number of agent winners announced each month based on their usage and users feedback 
    //  * @param splits splits to each one 
    //  */
    // function setTopKAgentsSplitRewards(uint8 _topK, uint8[] memory splits) external onlyOwner{
    //     require(_topK == splits.length, "error must be equal");
    //     for(uint8 i = 0; i < _topK; i++){
    //         topKAgentsSplitRewards[i] = splits[i];
    //     }
    //     topK = _topK;
    // }
}