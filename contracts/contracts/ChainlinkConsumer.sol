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

    uint64 subscriptionId;

    uint256 agentPlaceTreasury;

    // Router address Check to get the router address for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    address oracle;

    //Callback gas limit
    uint32 gasLimit = 300000;
    // donID
    bytes32 donID;

    struct AgentStruct {
        address creator;
        address lockAddress;
        bool isOpenForContributions;
    }

    // Mapping from agentID to agentStruct
    mapping(uint16 => AgentStruct) public agents;

    // Mapping from agentID to agentVersionID
    mapping(uint16 => uint16) agentVersions;

    // Mapping from requestID to response containing the topK agents
    mapping(bytes32 => bytes) private round_winners;

    // JavaScript source codes for the reward mechanisms
    mapping(bytes32 => string) public sources;

    // Reward distributions for the reward mechanisms
    mapping(bytes32 => uint8[]) public rewardDistributions;

    // Mapping from requestID to sourceID 
    mapping(bytes32 => bytes32) public requestToSource;

    // Mapping from sourceID to functionForwarder that can call the performUpkeep
    mapping(bytes32 => address) public functionsForwarders;
    
    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);

    // Event to log responses
    event RoundWinners(
        bytes32 requestId,
        bytes32 sourceID,
        bytes response
    );

    event rewardMechanismRegistered(
        string sourceName,
        string sourceCode,
        bytes32 sourceID,
        uint8[] rewardDistributions
    );

    /// @notice Initializes the contract
    /// @param _oracle The address of the Chainlink Function oracle
    /// @param _donID Chainlink's contract chainID => donID 
    /// @param _subscriptionId The subscription ID for Chainlink Functions
    constructor(
        address _oracle,
        bytes32 _donID,
        uint64 _subscriptionId
    ) FunctionsClient(_oracle) ERC20("DAI AGENTS", "DAIA"){

        subscriptionId = _subscriptionId;

        donID = _donID;
    }

    /// @notice Set the setRewardMechanism that `performUpkeep` is called from
    /// a trusted address the chainlink forwarder
    /// @dev Only callable by the owner
    /// @param _sourceName sourceID to Forwarder address
    /// @param _sourceCode sourceID to Forwarder address
    /// @param _functionForwader chainlink automation forwarder address
    /// @param _rewardDistributions the reward distributions for the topK agents
    function addRewardMechanism(
        string memory _sourceName, 
        string memory _sourceCode, 
        address _functionForwader,
        uint8[] memory _rewardDistributions
    ) external onlyOwner {
        bytes32 _sourceID = createSourceID(_sourceName);
        functionsForwarders[_sourceID] = _functionForwader;
        sources[_sourceID] = _sourceCode;
        for(uint8 i = 0; i < _rewardDistributions.length; i++){
            rewardDistributions[_sourceID].push(_rewardDistributions[i]);
        }
        emit rewardMechanismRegistered(_sourceName, _sourceCode, _sourceID, _rewardDistributions);
    }

    /**
     * @notice Sends an HTTP request for character information
     * @param sourceID The ID of the source to send the request to
     */
    function sendRequest(
        bytes32 sourceID
    ) external {
        require(functionsForwarders[sourceID] == msg.sender);
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sources[sourceID]); // Initialize the request with JS code

        // Send the request and store the request ID
        bytes32 reqID = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        requestToSource[reqID] = sourceID;
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
        // Emit an event to log the RoundWinners response from a sourceID mechanism
        emit RoundWinners(requestId, requestToSource[requestId], response);
    }

    function rewardsDistribution(bytes32 _requestID) external{
        string memory winners = string(round_winners[_requestID]);

        bytes memory decodedResponse = Helpers.stringToBytes(winners);

        uint16[] memory topkAgents = Helpers.decodeUint16ArrayRLE(decodedResponse);

        bytes32 rewardMechanismID = requestToSource[_requestID];

        for(uint8 i = 0; i < rewardDistributions[rewardMechanismID].length; i++){
            address tempWinner = agents[topkAgents[i]].creator;
            uint256 tempReward = rewardDistributions[rewardMechanismID][i] * 10 ** 18;
            // Minting tokens to the topK agents 
            _mint(tempWinner, tempReward);
        }
    }
     
    function createSourceID(string memory _sourceID) internal pure returns(bytes32){
        return keccak256(abi.encode(_sourceID));
    }
}