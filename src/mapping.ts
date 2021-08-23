import { Address, DataSourceContext } from '@graphprotocol/graph-ts'
import { ReactionDeployed } from "../generated/ReactionFactory/ReactionFactory"
import { Staked, Reacted, Flowed } from "../generated/templates/ReactionToken/ReactionToken"
import { Flowing } from "../generated/templates/StakedFlow/StakedFlow"
import { ReactionDef, Stake, Reaction, User, Flow, StakedFlow } from "../generated/schema"
import { ReactionToken as ReactionTokenTemplate, StakedFlow as StakedFlowTemplate } from "../generated/templates"

export function handleReactionDeployed(event: ReactionDeployed): void {
  let entity = ReactionDef.load(event.params.reactionContractAddr.toHex());
  if (entity == null) {
    entity = new ReactionDef(event.params.reactionContractAddr.toHex());
  }
  
  entity.user = createUser(event.params.creator).id;
  entity.contract = event.params.reactionContractAddr;
  entity.name = event.params.reactionTokenName;
  entity.symbol = event.params.reactionTokenSymbol;
  entity.stakingTokenAddress = event.params.stakingTokenAddress;
  entity.save();

  let context = new DataSourceContext();
  context.setBytes('contract', event.params.reactionContractAddr);
  ReactionTokenTemplate.createWithContext(event.params.reactionContractAddr, context);
}

export function handleStake(event: Staked): void {
  let entity = Stake.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new Stake(event.transaction.hash.toHex());
  }

  entity.user = createUser(event.params.author).id;
  entity.token = event.params.stakingTokenAddress;
  entity.amount = event.params.amount;
  entity.reaction = event.transaction.hash.toHex();
  entity.save();
}

export function handleReacted(event: Reacted): void {
  let entity = Reaction.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new Reaction(event.transaction.hash.toHex());
  }

  let reactionDef = ReactionDef.load(event.params.reactionTokenAddress.toHex());

  entity.user = createUser(event.params.author).id;
  entity.reaction = reactionDef.id;
  entity.amount = event.params.amount;
  entity.reactionRecipientAddress = event.params.reactionRecipientAddress;
  entity.tokenId = event.params.tokenId;
  
  entity.save();
}

export function handleFlowed(event: Flowed): void {
  let entity = Flow.load(event.transaction.hash.toHex());
  if (entity == null) {
    entity = new Flow(event.transaction.hash.toHex());
  }

  entity.stakedFlow = createStakedFlow(event.params.flow).id;
  entity.amount = event.params.amount;
  entity.stakingTokenAddress = event.params.stakingTokenAddress;
  entity.recipient = createUser(event.params.recipient).id;
  entity.stakingSuperTokenAddress = event.params.stakingSuperTokenAddress;
  entity.reaction = event.transaction.hash.toHex();
  entity.save();

  let context = new DataSourceContext();
  context.setBytes('contract', event.params.flow);
  StakedFlowTemplate.createWithContext(event.params.flow, context);
}

export function handleFlowing(event: Flowing): void {  
  let stakedFlow = createStakedFlow(event.address);
  
  stakedFlow.stakingSuperToken = event.params.stakingSuperToken;
  stakedFlow.balance = event.params.balance;
  stakedFlow.recipient = createUser(event.params.recipient).id;
  stakedFlow.flowRate = event.params.flowRate;
  stakedFlow.save();
}

export function createUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (user === null) {
    user = new User(address.toHexString());
    user.address = address;
    user.save();
  }

  return user as User;
}

export function createStakedFlow(address: Address): StakedFlow {
  let stakedFlow = StakedFlow.load(address.toHexString());
  if (stakedFlow === null) {
    stakedFlow = new StakedFlow(address.toHexString());
    stakedFlow.save();
  }

  return stakedFlow as StakedFlow;
}