import { useContractWrite, usePrepareContractWrite, useChainId } from "wagmi";
import { CONTRACTS } from "@/constants/contracts";
import { useState } from "react";

const ContractInteractions = ({}) => {
  const chainID = useChainId();

  //   REGISTER AGENT
  const [registerAgentArgs, setRegisterAgentArgs] = useState({
    agentName: "", //  assistant Id
    agentID: 1, // assistant id of the assitant model into uint16
    subscriptionExpirationDuration: 2592000, // One Month in seconds by default or Take from Creator
    tokenAddress: "0x0000000000000000000000000000000000000000", // native for now
    keyPrice: 1, // amount for the Sub
    basisPoint: 100, // referre fee i.e. 100point == 1%
    lockName: "Subscription of AssistantName", // `Subscription of AssistantName`
    lockSymbol: "SOA", // SOA``
    baseTokenURI: "",
    category: "", // Category
    isOpenForContributions: false, // check to make it open For Contributions
  });
  const { config, error } = usePrepareContractWrite({
    // @ts-ignore
    address: CONTRACTS.AIMarket[chainID].contract,
    // @ts-ignore
    abi: CONTRACTS.AIMarket[chainID].abi,
    functionName: "subscribe",
    args: [
      registerAgentArgs.agentName,
      registerAgentArgs.agentID,
      registerAgentArgs.subscriptionExpirationDuration,
      registerAgentArgs.tokenAddress,
      registerAgentArgs.keyPrice,
      registerAgentArgs.basisPoint,
      registerAgentArgs.lockName,
      registerAgentArgs.lockSymbol,
      registerAgentArgs.baseTokenURI,
      registerAgentArgs.category,
      registerAgentArgs.isOpenForContributions,
    ],
  });
  const { write, data, isLoading, isSuccess, isError } =
    useContractWrite(config);

  //   REGISTER AGENT VERSION

  const [registerAgentVersionArgs, setRegisterAgentVersionArgs] = useState({
    rootAgentID: 1,
    agentVersionID: 2,
    agentVersionName: "v1.0",
    agentMetadataCID: "QmW4h1w3q5d5N9uR1Zo",
  });
  const { config: configVersion, error: errorVersion } =
    usePrepareContractWrite({
      // @ts-ignore
      address: CONTRACTS.AIMarket[chainID].contract,
      // @ts-ignore
      abi: CONTRACTS.AIMarket[chainID].abi,
      functionName: "registerAgentVersion",
      args: [
        registerAgentVersionArgs.rootAgentID,
        registerAgentVersionArgs.agentVersionID,
        registerAgentVersionArgs.agentVersionName,
        registerAgentVersionArgs.agentMetadataCID,
      ],
    });

  const {
    write: writeVersion,
    data: dataVersion,
    isLoading: isLoadingVersion,
    isSuccess: isSuccessVersion,
    isError: isErrorVersion,
  } = useContractWrite(configVersion);

  //   PURCHASE SUBSCRIPTION
  const [purchaseSubscriptionArgs, setPurchaseSubscriptionArgs] = useState({
    agentID: 1,
    value: 1,
  });

  const { config: configPurchase, error: errorPurchase } =
    usePrepareContractWrite({
      // @ts-ignore
      address: CONTRACTS.AIMarket[chainID].contract,
      // @ts-ignore
      abi: CONTRACTS.AIMarket[chainID].abi,
      functionName: "purchaseSubscription",
      args: [purchaseSubscriptionArgs.agentID, purchaseSubscriptionArgs.value],
    });

  const {
    write: writePurchase,
    data: dataPurchase,
    isLoading: isLoadingPurchase,
    isSuccess: isSuccessPurchase,
    isError: isErrorPurchase,
  } = useContractWrite(configPurchase);

  //   WITHDRAW INCOME FROM SUBSCRIPTIONS MADE FROM THE AGENTID

  const [withdrawArgs, setWithdrawArgs] = useState({
    agentID: 1,
  });

  const { config: configWithdraw, error: errorWithdraw } =
    usePrepareContractWrite({
      // @ts-ignore
      address: CONTRACTS.AIMarket[chainID].contract,
      // @ts-ignore
      abi: CONTRACTS.AIMarket[chainID].abi,
      functionName: "withdraw",
      args: [withdrawArgs.agentID],
    });

  const {
    write: writeWithdraw,
    data: dataWithdraw,
    isLoading: isLoadingWithdraw,
    isSuccess: isSuccessWithdraw,
    isError: isErrorWithdraw,
  } = useContractWrite(configWithdraw);
};
