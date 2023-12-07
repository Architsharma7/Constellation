// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

import {ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {Helpers} from "./library/Helpers.sol";

/**
 * @title ChainlinkConsumer
 * @notice 
 * @dev 
 */
abstract contract ChainlinkConsumer is FunctionsClient, Ownable , ERC20{

    using FunctionsRequest for FunctionsRequest.Request;

    uint64 subscriptionId;

    uint256 agentPlaceTreasury;

    // Router address Check to get the router address for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    address oracle;

    //Callback gas limit
    uint32 gasLimit = 300000;

    uint256 max = type(uint).max;

    uint256 month = 31 days;

    // donID
    bytes32 donID;

    struct AgentStruct {
        address creator;
        address lockAddress;
        bool isOpenForContributions;
    }

    struct RequestData {
        bool executed;
        bytes32 sourceID;
    }

    struct FunctionData {
        address functionForwarder;
        uint8 numberOfWinners;
        // users => true , agents => false
        bool usersOrAgents;
    }

    // Mapping from agentID to agentStruct
    mapping(uint32 => AgentStruct) public agents;

    // Mapping from agentID to agentVersionID
    mapping(uint32 => uint32) public agentVersions;

    // Mapping from requestID to response containing the topK agents
    mapping(bytes32 => bytes) public roundWinners;

    // JavaScript source codes for the reward mechanisms
    mapping(bytes32 => string) public sources;

    // Reward distributions for the reward mechanisms
    mapping(bytes32 => mapping(uint8 => uint256)) public rewardDistributions;

    // Mapping from sourceID to functionForwarder that can call the performUpkeep
    mapping(bytes32 => FunctionData) public functionData;

    // Mapping from requestID to sourceID 
    mapping(bytes32 => RequestData) public requestData;

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
        uint256[] rewardDistributions
    );

    event RoundRewardsDistributed(
        bytes32 requestId,
        bytes32 sourceID,
        uint32[] topkAgents,
        address[] topkUsers
    );

    /// @notice Initializes the contract
    /// @param _oracle The address of the Chainlink Function oracle
    /// @param _donID Chainlink's contract chainID => donID 
    /// @param _subscriptionId The subscription ID for Chainlink Functions
    constructor(
        address _oracle,
        bytes32 _donID,
        uint64 _subscriptionId
    ) FunctionsClient(_oracle) ERC20("RocketAI", "RAI"){

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
        uint256[] memory _rewardDistributions
    ) external onlyOwner {
        bytes32 _sourceID = createSourceID(_sourceName);

        if(_sourceID == createSourceID("usersRewardMechanism")){
            functionData[_sourceID].usersOrAgents = true;
        }
        uint8 size = uint8(_rewardDistributions.length);

        functionData[_sourceID].numberOfWinners = size;
        functionData[_sourceID].functionForwarder = _functionForwader;

        sources[_sourceID] = _sourceCode;
        for(uint8 i = 0; i < size; i++){
            rewardDistributions[_sourceID][i] = _rewardDistributions[i];
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
        require(functionData[sourceID].functionForwarder == msg.sender);
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(sources[sourceID]); // Initialize the request with JS code

        // Send the request and store the request ID
        bytes32 reqID = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        requestData[reqID].sourceID = sourceID;
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

        roundWinners[requestId] = response;
        // Emit an event to log the RoundWinners response from a sourceID mechanism
        emit RoundWinners(requestId, requestData[requestId].sourceID, response);
    }

    function rewardsDistribution(bytes32 _requestID) public{

        require(requestData[_requestID].executed == false, "Already executed");
        
        requestData[_requestID].executed = true;

        bytes32 _sourceID = requestData[_requestID].sourceID;

        uint8 size = functionData[_sourceID].numberOfWinners;

        if(functionData[_sourceID].usersOrAgents){

            uint32[] memory topkAgents = new uint32[](1);

            address[] memory topkUsers = Helpers.splitConcatenatedAddresses(roundWinners[_requestID]);
            // Minting tokens to the topK users
            for(uint8 i = 0; i < size; i++){
                address tempWinner = topkUsers[i];
                uint256 tempReward = rewardDistributions[_sourceID][i];
                // Minting tokens to the topK agents 
                _mint(tempWinner, tempReward * 10 ** 18 );
            }

            emit RoundRewardsDistributed(_requestID, _sourceID, topkAgents, topkUsers);

        }else{      

            uint32[] memory topkAgents = Helpers.decodeBytesToUint32Array(roundWinners[_requestID]);

            address[] memory agentCreators = new address[](size);
            // Minting tokens to the topK agents
            for(uint8 i = 0; i < functionData[_sourceID].numberOfWinners; i++){
                address tempWinner = agents[topkAgents[i]].creator;

                agentCreators[i] = tempWinner;

                uint256 tempReward = rewardDistributions[_sourceID][i];
                // Minting tokens to the topK agents 
                _mint(tempWinner, tempReward * 10 ** 18 );
            }

            emit RoundRewardsDistributed(_requestID, _sourceID, topkAgents, agentCreators);
        }
    }
     
    function createSourceID(string memory _sourceID) internal pure returns(bytes32){
        return keccak256(abi.encode(_sourceID));
    }
}