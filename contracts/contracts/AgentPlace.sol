// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import { ChainlinkConsumer } from "./ChainlinkConsumer.sol";

import {IUnlockV12} from "@unlock-protocol/contracts/dist/Unlock/IUnlockV12.sol";

import {IPublicLockV12} from "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV12.sol";

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

import {IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 * @title AgentPlace
 * @notice 
 * @dev 
 */
contract AgentPlace is ChainlinkConsumer {

    IUnlockV12 unlockContract;

    struct AgentInitConfig {
        string agentName;
        uint16 agentID;
        address tokenAddress;
        uint keyPrice;
        uint basisPoint; 
        string lockName;
        string lockSymbol;
        string baseTokenURI;
        string category;
        bool isOpenForContributions;
    }

    event agentRegistered(
        string agentName,
        uint16 agentID, 
        address creator, 
        address unlockSubscriptionContract,
        uint keyPrice,
        uint basisPoint,
        string categories, 
        bool isOpenForContributions
    );

    event agentVersionRegistered(
        uint16 agentID, 
        string agentVersionName,
        uint16 agentVersionID, 
        address creator, 
        string agentMetadataCID
    );

    event agentSubscriptionPurchased(
        uint16 agentID, 
        address agentCreator,
        address subscriber
    );

    /// @notice Initializes the contract
    /// @param _oracle The address of the Chainlink Function oracle
    /// @param _unlockContract The address of the Chainlink oracle Automation Forwarder
    /// @param _donID Chainlink's contract chainID => donID 
    /// @param _subscriptionId The subscription ID for Chainlink Functions
    constructor(
        address _oracle,
        IUnlockV12 _unlockContract,
        bytes32 _donID,
        uint64 _subscriptionId
    ) ChainlinkConsumer(
        _oracle,
        _donID,
        _subscriptionId
    ){
        unlockContract =  _unlockContract;
    }

    function registerAgent(
        AgentInitConfig calldata agentConfig
    ) external{
        require(agents[agentConfig.agentID].creator == address(0), "agent already exists");

        uint256 max = type(uint).max;

        uint256 month = 31 days;
 
        address newLockAddress = unlockContract.createLock(
            // Expiration duration of subscription
            month,
            agentConfig.tokenAddress,
            agentConfig.keyPrice,
            max,
            agentConfig.lockName,
            bytes12(0)
        );
        IPublicLockV12(newLockAddress).setLockMetadata(agentConfig.lockName,agentConfig.lockSymbol, agentConfig.baseTokenURI);
        if(agentConfig.basisPoint > 0 ) IPublicLockV12(newLockAddress).setReferrerFee(address(0), agentConfig.basisPoint);
        IPublicLockV12(newLockAddress).setEventHooks(address(this),address(0),address(0),address(0),address(0),address(0),address(0));
        IPublicLockV12(newLockAddress).updateLockConfig(month, max, max);
        agents[agentConfig.agentID] = AgentStruct({
            creator : msg.sender,
            lockAddress: newLockAddress,
            isOpenForContributions: agentConfig.isOpenForContributions
        });
        
        emit agentRegistered(
            agentConfig.agentName, 
            agentConfig.agentID, 
            msg.sender, 
            newLockAddress, 
            agentConfig.keyPrice,
            agentConfig.basisPoint,
            agentConfig.category,
            agentConfig.isOpenForContributions
        );
    }

    function registerAgentVersion(
        uint16 _agentID, 
        uint16 _agentVersionID,
        string memory _agentVersionName,
        string memory _agentMetadataCID
    )external {
        require(agents[_agentID].isOpenForContributions, "agent is not open for contributions");
        // Check Subscription plan
        agents[_agentVersionID] = AgentStruct({
            creator : msg.sender,
            lockAddress: agents[_agentID].lockAddress,
            isOpenForContributions: false
        });

        emit agentVersionRegistered(
            _agentID, 
            _agentVersionName, 
            _agentVersionID, 
            msg.sender, 
            _agentMetadataCID
        );

        agentVersions[_agentVersionID] = _agentID;
    } 

    /**
     * @dev PurchaseSubscription function for an agentID
     * @param _agentID to subscribe
     * @param _value array of tokens amount to pay for this purchase >= the current keyPrice - any applicable discount
    */
    function purchaseSubscription(
        uint16 _agentID,
        uint256 _value
    ) external payable{
        require(agents[_agentID].creator != address(0), "agent does not exists");
        address[] memory _referrers = new address[](1);
        address[] memory _recipients = new address[](1);
        address[] memory _keyManagers = new address[](1);
        uint256[] memory _values = new uint256[](1);
        bytes[] memory _data = new bytes[](1);

        address agentLockAddress = agents[_agentID].lockAddress;
        // If the agent that we want to subscribe is a subVersion then 
        // Pay the main agentID and give a referre fee to the contributor
        // Of this new agent Version. Referre fee is defined in the registerAgent function.
        if(!agents[_agentID].isOpenForContributions){
            address referrer = agents[_agentID].creator;
             _referrers[0] = referrer;
        }
        _values[0] = _value;
        _recipients[0] = msg.sender;
        address tokenAddress = IPublicLockV12(agentLockAddress).tokenAddress();
        uint _priceToPay = IPublicLockV12(agentLockAddress).keyPrice();
        if (tokenAddress != address(0)) {
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _priceToPay
            );
            IPublicLockV12(agentLockAddress).purchase(_values,_recipients,_referrers,_keyManagers,_data);
        }else{
            IPublicLockV12(agentLockAddress).purchase{value:msg.value}(_values,_recipients,_referrers,_keyManagers,_data);
        }

        emit agentSubscriptionPurchased(
            _agentID, 
            agents[_agentID].creator,
            msg.sender
        );
    }

    /**
     * @dev withdraw function for an agentID
     * @notice We give back to the agent creator 70% of the total
     * income from that agent the platform keeps 30% of that amount
     * @param _agentID to withdraw money from the lock contract
    */
    function withdraw(uint16 _agentID) external {
        AgentStruct memory _agent = agents[_agentID];
        IPublicLockV12 AgentLockContract = IPublicLockV12(_agent.lockAddress);
        uint balance = address(_agent.lockAddress).balance;
        uint amountToTransfer = (balance / 10 ) * 7;
        address tokenAddress = AgentLockContract.tokenAddress();
        AgentLockContract.withdraw(
            tokenAddress,
            payable(address(this)),
            balance
        );
        address payable withdrawer = payable(_agent.creator);
        // IF Payment token is in Ethers
        if(tokenAddress == address(0)) {
            // https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/
            Address.sendValue(withdrawer, amountToTransfer);
        } else {
            IERC20 token = IERC20(tokenAddress);
            token.transfer(withdrawer, amountToTransfer);
        }
    }

    // Function to receive Ethers
    receive()external payable{}

    // Function to withdraw the platform income
    function withdraw(address tokenAddress) external onlyOwner{
        address payable withdrawer = payable(msg.sender);
        // IF Payment token is in Ethers
        if(tokenAddress == address(0)) {
            // https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/
            Address.sendValue(withdrawer, address(this).balance);
        } else {
            IERC20 token = IERC20(tokenAddress);
            token.transfer(withdrawer, token.balanceOf(address(this)));
        }
    }

    function onKeyPurchase(
        uint /* tokenId */,
        address from,
        address /* recipient */,
        address /* referrer */,
        bytes calldata /* data */,
        uint /* minKeyPrice */,
        uint /* pricePaid */
    ) external view{
        require(from == address(this));
    }

    function keyPurchasePrice(    
        address /* from */,
        address /* recipient */,
        address /* referrer */,
        bytes calldata /* data */
    ) external view returns (uint minKeyPrice){
        return IPublicLockV12(msg.sender).keyPrice();
    }
}