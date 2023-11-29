// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ChainlinkConsumer} from "./ChainlinkConsumer.sol";

import {IUnlockV12} from "@unlock-protocol/contracts/dist/Unlock/IUnlockV12.sol";

import {IPublicLockV12} from "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV12.sol";

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title AgentPlace
 * @notice
 * @dev
 */
contract AgentPlace is ChainlinkConsumer {
    IUnlockV12 unlockContract;

    struct AgentInitConfig {
        uint16 agentID;
        uint subscriptionExpirationDuration;
        address tokenAddress;
        uint keyPrice;
        uint basisPoint;
        string lockName;
        string lockSymbol;
        string baseTokenURI;
        bool isOpenForContributions;
    }

    event agentRegistered(
        uint16 agentID,
        address creator,
        address UnlockSubscriptionContract,
        bool isOpenForContributions
    );

    event agentVersionRegistered(
        uint16 agentID,
        uint16 agentVersionID,
        address creator,
        string agentMetadataCID
    );

    /// @notice Initializes the contract
    /// @param _oracle The address of the Chainlink Function oracle
    /// @param _unlockContract The address of the Chainlink oracle Automation Forwarder
    /// @param _donID Chainlink's contract chainID => donID
    /// @param _subscriptionId The subscription ID for Chainlink Functions
    /// @param _source The source code for the Chainlink Functions request
    /// @param _gasLimit The gas limit for the Chainlink Functions request callback
    constructor(
        address _oracle,
        IUnlockV12 _unlockContract,
        bytes32 _donID,
        uint64 _subscriptionId,
        string memory _source,
        uint32 _gasLimit,
        uint8 _topK,
        uint8[] memory _splits
    )
        ChainlinkConsumer(
            _oracle,
            _donID,
            _subscriptionId,
            _source,
            _gasLimit,
            _topK,
            _splits
        )
    {
        unlockContract = _unlockContract;
    }

    function registerAgent(AgentInitConfig calldata agentConfig) external {
        require(
            agents[agentConfig.agentID].creator == address(0),
            "agent already exists"
        );

        address newLockAddress = unlockContract.createLock(
            agentConfig.subscriptionExpirationDuration,
            agentConfig.tokenAddress,
            agentConfig.keyPrice,
            type(uint).max,
            agentConfig.lockName,
            bytes12(0)
        );
        IPublicLockV12(newLockAddress).setLockMetadata(
            agentConfig.lockName,
            agentConfig.lockSymbol,
            agentConfig.baseTokenURI
        );
        if (agentConfig.basisPoint > 0)
            IPublicLockV12(newLockAddress).setReferrerFee(
                address(0),
                agentConfig.basisPoint
            );
        IPublicLockV12(newLockAddress).setEventHooks(
            address(this),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0)
        );
        agents[agentConfig.agentID] = AgentStruct({
            creator: msg.sender,
            lockAddress: newLockAddress,
            isOpenForContributions: agentConfig.isOpenForContributions
        });

        emit agentRegistered(
            agentConfig.agentID,
            msg.sender,
            newLockAddress,
            agentConfig.isOpenForContributions
        );
    }

    function registerAgentVersion(
        uint16 _agentID,
        uint16 _agentVersionID,
        string memory _agentMetadataCID
    ) external {
        require(
            agents[_agentID].isOpenForContributions,
            "agent is not open for contributions"
        );
        // Check Subscription plan
        agents[_agentVersionID] = AgentStruct({
            creator: msg.sender,
            lockAddress: agents[_agentID].lockAddress,
            isOpenForContributions: false
        });

        emit agentVersionRegistered(
            _agentID,
            _agentVersionID,
            msg.sender,
            _agentMetadataCID
        );

        agentVersions[_agentVersionID] = _agentID;
    }

    /**
     * @dev PurchaseSubscription function for an agentID
     * @param _agentID to subscribe
     * @param _values array of tokens amount to pay for this purchase >= the current keyPrice - any applicable discount
     * (_values is ignored when using ETH)
     * @param _recipients array of addresses of the recipients of the purchased key
     * @param _data arbitrary data populated by the front-end which initiated the sale
     * @notice when called for an existing and non-expired key, the `_keyManager` param will be ignored
     * @dev Setting _value to keyPrice exactly doubles as a security feature. That way if the lock owner increases the
     * price while my transaction is pending I can't be charged more than I expected (only applicable to ERC-20 when more
     * than keyPrice is approved for spending).
     */
    function purchaseSubscription(
        uint16 _agentID,
        uint256[] memory _values,
        address[] memory _recipients,
        bytes[] calldata _data
    ) external payable {
        address[] memory _referrers = new address[](_values.length);
        address[] memory _keyManagers = new address[](_values.length);

        address agentLockAddress = agents[_agentID].lockAddress;
        // If the agent that we want to subscribe is a subVersion then
        // Pay the main agentID and give a referre fee to the contributor
        // Of this new agent Version. Referre fee is defined in the registerAgent function.
        if (!agents[_agentID].isOpenForContributions) {
            address referrer = agents[_agentID].creator;
            for (uint i = 0; i < _referrers.length; i++) {
                _referrers[i] = referrer;
            }
        }
        address tokenAddress = IPublicLockV12(agentLockAddress).tokenAddress();
        uint _priceToPay = IPublicLockV12(agentLockAddress).keyPrice();
        if (tokenAddress != address(0)) {
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _priceToPay
            );
            IPublicLockV12(agentLockAddress).purchase(
                _values,
                _recipients,
                _referrers,
                _keyManagers,
                _data
            );
        } else {
            IPublicLockV12(agentLockAddress).purchase{value: msg.value}(
                _values,
                _recipients,
                _referrers,
                _keyManagers,
                _data
            );
        }
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
        uint amountToTransfer = (balance / 10) * 7;
        address tokenAddress = AgentLockContract.tokenAddress();
        AgentLockContract.withdraw(
            tokenAddress,
            payable(address(this)),
            balance
        );
        address payable withdrawer = payable(_agent.creator);
        // IF Payment token is in Ethers
        if (tokenAddress == address(0)) {
            // https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/
            Address.sendValue(withdrawer, amountToTransfer);
        } else {
            IERC20 token = IERC20(tokenAddress);
            token.transfer(withdrawer, amountToTransfer);
        }
    }

    // Function to receive Ethers
    receive() external payable {}

    // Function to withdraw the platform income
    function withdraw(address tokenAddress) external onlyOwner {
        address payable withdrawer = payable(msg.sender);
        // IF Payment token is in Ethers
        if (tokenAddress == address(0)) {
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
    ) external view {
        require(from == address(this));
    }

    function keyPurchasePrice(
        address /* from */,
        address /* recipient */,
        address /* referrer */,
        bytes calldata /* data */
    ) external view returns (uint minKeyPrice) {
        return IPublicLockV12(msg.sender).keyPrice();
    }
}
