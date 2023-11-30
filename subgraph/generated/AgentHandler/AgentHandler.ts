// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get spender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class RequestFulfilled extends ethereum.Event {
  get params(): RequestFulfilled__Params {
    return new RequestFulfilled__Params(this);
  }
}

export class RequestFulfilled__Params {
  _event: RequestFulfilled;

  constructor(event: RequestFulfilled) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }
}

export class RequestSent extends ethereum.Event {
  get params(): RequestSent__Params {
    return new RequestSent__Params(this);
  }
}

export class RequestSent__Params {
  _event: RequestSent;

  constructor(event: RequestSent) {
    this._event = event;
  }

  get id(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }
}

export class Response extends ethereum.Event {
  get params(): Response__Params {
    return new Response__Params(this);
  }
}

export class Response__Params {
  _event: Response;

  constructor(event: Response) {
    this._event = event;
  }

  get requestId(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get response(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class agentRegistered extends ethereum.Event {
  get params(): agentRegistered__Params {
    return new agentRegistered__Params(this);
  }
}

export class agentRegistered__Params {
  _event: agentRegistered;

  constructor(event: agentRegistered) {
    this._event = event;
  }

  get agentID(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get creator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get UnlockSubscriptionContract(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get isOpenForContributions(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }
}

export class agentVersionRegistered extends ethereum.Event {
  get params(): agentVersionRegistered__Params {
    return new agentVersionRegistered__Params(this);
  }
}

export class agentVersionRegistered__Params {
  _event: agentVersionRegistered;

  constructor(event: agentVersionRegistered) {
    this._event = event;
  }

  get agentID(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get agentVersionID(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get creator(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get agentMetadataCID(): string {
    return this._event.parameters[3].value.toString();
  }
}

export class AgentHandler__agentsResult {
  value0: Address;
  value1: Address;
  value2: boolean;

  constructor(value0: Address, value1: Address, value2: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    return map;
  }

  getCreator(): Address {
    return this.value0;
  }

  getLockAddress(): Address {
    return this.value1;
  }

  getIsOpenForContributions(): boolean {
    return this.value2;
  }
}

export class AgentHandler extends ethereum.SmartContract {
  static bind(address: Address): AgentHandler {
    return new AgentHandler("AgentHandler", address);
  }

  agents(param0: i32): AgentHandler__agentsResult {
    let result = super.call("agents", "agents(uint16):(address,address,bool)", [
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))
    ]);

    return new AgentHandler__agentsResult(
      result[0].toAddress(),
      result[1].toAddress(),
      result[2].toBoolean()
    );
  }

  try_agents(param0: i32): ethereum.CallResult<AgentHandler__agentsResult> {
    let result = super.tryCall(
      "agents",
      "agents(uint16):(address,address,bool)",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new AgentHandler__agentsResult(
        value[0].toAddress(),
        value[1].toAddress(),
        value[2].toBoolean()
      )
    );
  }

  allowance(owner: Address, spender: Address): BigInt {
    let result = super.call(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)]
    );

    return result[0].toBigInt();
  }

  try_allowance(owner: Address, spender: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(owner), ethereum.Value.fromAddress(spender)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  approve(spender: Address, amount: BigInt): boolean {
    let result = super.call("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBoolean();
  }

  try_approve(spender: Address, amount: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  balanceOf(account: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(account: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  decimals(): i32 {
    let result = super.call("decimals", "decimals():(uint8)", []);

    return result[0].toI32();
  }

  try_decimals(): ethereum.CallResult<i32> {
    let result = super.tryCall("decimals", "decimals():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  decreaseAllowance(spender: Address, subtractedValue: BigInt): boolean {
    let result = super.call(
      "decreaseAllowance",
      "decreaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(subtractedValue)
      ]
    );

    return result[0].toBoolean();
  }

  try_decreaseAllowance(
    spender: Address,
    subtractedValue: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "decreaseAllowance",
      "decreaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(subtractedValue)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  increaseAllowance(spender: Address, addedValue: BigInt): boolean {
    let result = super.call(
      "increaseAllowance",
      "increaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(addedValue)
      ]
    );

    return result[0].toBoolean();
  }

  try_increaseAllowance(
    spender: Address,
    addedValue: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "increaseAllowance",
      "increaseAllowance(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(spender),
        ethereum.Value.fromUnsignedBigInt(addedValue)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  interval(): BigInt {
    let result = super.call("interval", "interval():(uint256)", []);

    return result[0].toBigInt();
  }

  try_interval(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("interval", "interval():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  keyPurchasePrice(
    param0: Address,
    param1: Address,
    param2: Address,
    param3: Bytes
  ): BigInt {
    let result = super.call(
      "keyPurchasePrice",
      "keyPurchasePrice(address,address,address,bytes):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromAddress(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );

    return result[0].toBigInt();
  }

  try_keyPurchasePrice(
    param0: Address,
    param1: Address,
    param2: Address,
    param3: Bytes
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "keyPurchasePrice",
      "keyPurchasePrice(address,address,address,bytes):(uint256)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromAddress(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  lastTimeStamp(): BigInt {
    let result = super.call("lastTimeStamp", "lastTimeStamp():(uint256)", []);

    return result[0].toBigInt();
  }

  try_lastTimeStamp(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "lastTimeStamp",
      "lastTimeStamp():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  s_forwarderAddress(): Address {
    let result = super.call(
      "s_forwarderAddress",
      "s_forwarderAddress():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_s_forwarderAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "s_forwarderAddress",
      "s_forwarderAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  topKAgentsSplitRewards(param0: i32): i32 {
    let result = super.call(
      "topKAgentsSplitRewards",
      "topKAgentsSplitRewards(uint8):(uint8)",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))]
    );

    return result[0].toI32();
  }

  try_topKAgentsSplitRewards(param0: i32): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "topKAgentsSplitRewards",
      "topKAgentsSplitRewards(uint8):(uint8)",
      [ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(param0))]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  totalSupply(): BigInt {
    let result = super.call("totalSupply", "totalSupply():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalSupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalSupply", "totalSupply():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  transfer(to: Address, amount: BigInt): boolean {
    let result = super.call("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(to),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBoolean();
  }

  try_transfer(to: Address, amount: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(to),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transferFrom(from: Address, to: Address, amount: BigInt): boolean {
    let result = super.call(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromAddress(to),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBoolean();
  }

  try_transferFrom(
    from: Address,
    to: Address,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(from),
        ethereum.Value.fromAddress(to),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _oracle(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _unlockContract(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _donID(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get _subscriptionId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _source(): string {
    return this._call.inputValues[4].value.toString();
  }

  get _gasLimit(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get _topK(): i32 {
    return this._call.inputValues[6].value.toI32();
  }

  get _splits(): Array<i32> {
    return this._call.inputValues[7].value.toI32Array();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class DecreaseAllowanceCall extends ethereum.Call {
  get inputs(): DecreaseAllowanceCall__Inputs {
    return new DecreaseAllowanceCall__Inputs(this);
  }

  get outputs(): DecreaseAllowanceCall__Outputs {
    return new DecreaseAllowanceCall__Outputs(this);
  }
}

export class DecreaseAllowanceCall__Inputs {
  _call: DecreaseAllowanceCall;

  constructor(call: DecreaseAllowanceCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get subtractedValue(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DecreaseAllowanceCall__Outputs {
  _call: DecreaseAllowanceCall;

  constructor(call: DecreaseAllowanceCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class HandleOracleFulfillmentCall extends ethereum.Call {
  get inputs(): HandleOracleFulfillmentCall__Inputs {
    return new HandleOracleFulfillmentCall__Inputs(this);
  }

  get outputs(): HandleOracleFulfillmentCall__Outputs {
    return new HandleOracleFulfillmentCall__Outputs(this);
  }
}

export class HandleOracleFulfillmentCall__Inputs {
  _call: HandleOracleFulfillmentCall;

  constructor(call: HandleOracleFulfillmentCall) {
    this._call = call;
  }

  get requestId(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get response(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get err(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class HandleOracleFulfillmentCall__Outputs {
  _call: HandleOracleFulfillmentCall;

  constructor(call: HandleOracleFulfillmentCall) {
    this._call = call;
  }
}

export class IncreaseAllowanceCall extends ethereum.Call {
  get inputs(): IncreaseAllowanceCall__Inputs {
    return new IncreaseAllowanceCall__Inputs(this);
  }

  get outputs(): IncreaseAllowanceCall__Outputs {
    return new IncreaseAllowanceCall__Outputs(this);
  }
}

export class IncreaseAllowanceCall__Inputs {
  _call: IncreaseAllowanceCall;

  constructor(call: IncreaseAllowanceCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get addedValue(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class IncreaseAllowanceCall__Outputs {
  _call: IncreaseAllowanceCall;

  constructor(call: IncreaseAllowanceCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class PurchaseSubscriptionCall extends ethereum.Call {
  get inputs(): PurchaseSubscriptionCall__Inputs {
    return new PurchaseSubscriptionCall__Inputs(this);
  }

  get outputs(): PurchaseSubscriptionCall__Outputs {
    return new PurchaseSubscriptionCall__Outputs(this);
  }
}

export class PurchaseSubscriptionCall__Inputs {
  _call: PurchaseSubscriptionCall;

  constructor(call: PurchaseSubscriptionCall) {
    this._call = call;
  }

  get _agentID(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _values(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get _recipients(): Array<Address> {
    return this._call.inputValues[2].value.toAddressArray();
  }

  get _data(): Array<Bytes> {
    return this._call.inputValues[3].value.toBytesArray();
  }
}

export class PurchaseSubscriptionCall__Outputs {
  _call: PurchaseSubscriptionCall;

  constructor(call: PurchaseSubscriptionCall) {
    this._call = call;
  }
}

export class RegisterAgentCall extends ethereum.Call {
  get inputs(): RegisterAgentCall__Inputs {
    return new RegisterAgentCall__Inputs(this);
  }

  get outputs(): RegisterAgentCall__Outputs {
    return new RegisterAgentCall__Outputs(this);
  }
}

export class RegisterAgentCall__Inputs {
  _call: RegisterAgentCall;

  constructor(call: RegisterAgentCall) {
    this._call = call;
  }

  get agentConfig(): RegisterAgentCallAgentConfigStruct {
    return changetype<RegisterAgentCallAgentConfigStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }
}

export class RegisterAgentCall__Outputs {
  _call: RegisterAgentCall;

  constructor(call: RegisterAgentCall) {
    this._call = call;
  }
}

export class RegisterAgentCallAgentConfigStruct extends ethereum.Tuple {
  get agentID(): i32 {
    return this[0].toI32();
  }

  get subscriptionExpirationDuration(): BigInt {
    return this[1].toBigInt();
  }

  get tokenAddress(): Address {
    return this[2].toAddress();
  }

  get keyPrice(): BigInt {
    return this[3].toBigInt();
  }

  get basisPoint(): BigInt {
    return this[4].toBigInt();
  }

  get lockName(): string {
    return this[5].toString();
  }

  get lockSymbol(): string {
    return this[6].toString();
  }

  get baseTokenURI(): string {
    return this[7].toString();
  }

  get isOpenForContributions(): boolean {
    return this[8].toBoolean();
  }
}

export class RegisterAgentVersionCall extends ethereum.Call {
  get inputs(): RegisterAgentVersionCall__Inputs {
    return new RegisterAgentVersionCall__Inputs(this);
  }

  get outputs(): RegisterAgentVersionCall__Outputs {
    return new RegisterAgentVersionCall__Outputs(this);
  }
}

export class RegisterAgentVersionCall__Inputs {
  _call: RegisterAgentVersionCall;

  constructor(call: RegisterAgentVersionCall) {
    this._call = call;
  }

  get _agentID(): i32 {
    return this._call.inputValues[0].value.toI32();
  }

  get _agentVersionID(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get _agentMetadataCID(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class RegisterAgentVersionCall__Outputs {
  _call: RegisterAgentVersionCall;

  constructor(call: RegisterAgentVersionCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RewardsDistributionCall extends ethereum.Call {
  get inputs(): RewardsDistributionCall__Inputs {
    return new RewardsDistributionCall__Inputs(this);
  }

  get outputs(): RewardsDistributionCall__Outputs {
    return new RewardsDistributionCall__Outputs(this);
  }
}

export class RewardsDistributionCall__Inputs {
  _call: RewardsDistributionCall;

  constructor(call: RewardsDistributionCall) {
    this._call = call;
  }

  get _requestID(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class RewardsDistributionCall__Outputs {
  _call: RewardsDistributionCall;

  constructor(call: RewardsDistributionCall) {
    this._call = call;
  }
}

export class SendRequestCall extends ethereum.Call {
  get inputs(): SendRequestCall__Inputs {
    return new SendRequestCall__Inputs(this);
  }

  get outputs(): SendRequestCall__Outputs {
    return new SendRequestCall__Outputs(this);
  }
}

export class SendRequestCall__Inputs {
  _call: SendRequestCall;

  constructor(call: SendRequestCall) {
    this._call = call;
  }
}

export class SendRequestCall__Outputs {
  _call: SendRequestCall;

  constructor(call: SendRequestCall) {
    this._call = call;
  }
}

export class SetForwarderAddressCall extends ethereum.Call {
  get inputs(): SetForwarderAddressCall__Inputs {
    return new SetForwarderAddressCall__Inputs(this);
  }

  get outputs(): SetForwarderAddressCall__Outputs {
    return new SetForwarderAddressCall__Outputs(this);
  }
}

export class SetForwarderAddressCall__Inputs {
  _call: SetForwarderAddressCall;

  constructor(call: SetForwarderAddressCall) {
    this._call = call;
  }

  get forwarderAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetForwarderAddressCall__Outputs {
  _call: SetForwarderAddressCall;

  constructor(call: SetForwarderAddressCall) {
    this._call = call;
  }
}

export class TransferCall extends ethereum.Call {
  get inputs(): TransferCall__Inputs {
    return new TransferCall__Inputs(this);
  }

  get outputs(): TransferCall__Outputs {
    return new TransferCall__Outputs(this);
  }
}

export class TransferCall__Inputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get to(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class TransferCall__Outputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get _agentID(): i32 {
    return this._call.inputValues[0].value.toI32();
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class Withdraw1Call extends ethereum.Call {
  get inputs(): Withdraw1Call__Inputs {
    return new Withdraw1Call__Inputs(this);
  }

  get outputs(): Withdraw1Call__Outputs {
    return new Withdraw1Call__Outputs(this);
  }
}

export class Withdraw1Call__Inputs {
  _call: Withdraw1Call;

  constructor(call: Withdraw1Call) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class Withdraw1Call__Outputs {
  _call: Withdraw1Call;

  constructor(call: Withdraw1Call) {
    this._call = call;
  }
}