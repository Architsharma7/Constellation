// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";

import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";


/**
 * @title AgentPlace
 * @notice 
 * @dev 
 */
contract AgentPlace is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;

    uint256 month = month;

    uint256 public interval; // interval specifies the time between upkeeps

    uint256 public lastTimeStamp; // lastTimeStamp tracks the last upkeep performed

    address public s_forwarderAddress;

    uint64 subscriptionId;

    uint256 agentPlaceTreasury;

    struct AgentStruct {
        address creator;
        address splitterContract;
        string metadata;
    }

    struct Subscription {
        uint256 start;
        uint256 end;
        uint8 SubscriptionType;
    }

    mapping(uint16 => AgentStruct) public agents;

    mapping(address => Subscription) public subscriptions;

    // Custom error type
    error UnexpectedRequestID(bytes32 requestId);

    // Event to log responses
    event Response(
        bytes32 indexed requestId,
        uint32[] topk
    );

    // Router address - Hardcoded for Mumbai
    // Check to get the router address for your supported network https://docs.chain.link/chainlink-functions/supported-networks
    address oracle = 0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C;
    // JavaScript source code
    // Fetch character name from the Star Wars API.
    // Documentation: https://swapi.dev/documentation#people
    string source =
        "const characterId = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://swapi.dev/api/people/${characterId}/`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.name);";
    //Callback gas limit
    uint32 gasLimit = 300000;
    // donID - Hardcoded for Mumbai
    bytes32 donID = 0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000;


    /// @notice Initializes the contract
    /// @param _oracle The address of the Chainlink Function oracle
    /// @param _forwarderAddress The address of the Chainlink oracle Automation Forwarder
    /// @param _donID Chainlink's contract chainID => donID 
    /// @param _subscriptionId The subscription ID for Chainlink Functions
    /// @param _source The source code for the Chainlink Functions request
    /// @param _gasLimit The gas limit for the Chainlink Functions request callback
    constructor(
        address _oracle,
        address _forwarderAddress,
        bytes32 _donID,
        uint64 _subscriptionId,
        string memory _source,
        uint32 _gasLimit
    ) FunctionsClient(_oracle) {
        s_forwarderAddress = _forwarderAddress;
        subscriptionId = _subscriptionId;
        source = _source;
        gasLimit = _gasLimit;
        donID = _donID;
    }

    function subscribe(uint8 subscriptionType)external payable{
        // Handle create subscription
    }

    function registerAgent(string memory agentID)external {
        // Check Subscription plan
    } 

    function checkUpkeep(
        bytes calldata /*checkData*/
    ) external view returns (bool, bytes memory) {
        bool needsUpkeep = (block.timestamp - lastTimeStamp) > interval;
        return (needsUpkeep, bytes(""));
    }

    function performUpkeep(bytes calldata /*performData*/) external {
        require(
            msg.sender == s_forwarderAddress,
            "This address does not have permission to call performUpkeep"
        );
        lastTimeStamp = block.timestamp;
        sendRequest();
    }

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
    ) internal {
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

        uint32[] memory topkAgents = abi.decode(response, (uint32[]));
        uint256 bal = agentPlaceTreasury - address(this).balance;
        agentPlaceTreasury > address(this).balance?  
        bal =  agentPlaceTreasury - address(this).balance: 
        bal = address(this).balance - agentPlaceTreasury; 

        if(bal != 0){
            uint oneTenth = SafeMath.div(bal ,  10);
            agentPlaceTreasury = SafeMath.mul(oneTenth , 7);
        }
        for(uint i = 0; i < topkAgents.length; i++){

        }
        // Emit an event to log the response
        emit Response(requestId, topkAgents);
    }
}