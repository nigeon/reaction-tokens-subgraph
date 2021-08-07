import { Address, DataSourceContext } from '@graphprotocol/graph-ts'
import { ReactionDeployed } from "../generated/ReactionFactory/ReactionFactory"
import { Staked, Reacted } from "../generated/templates/ReactionToken/ReactionToken"
import { ReactionDef, Stake, Reaction, User } from "../generated/schema"
import { ReactionToken as ReactionTokenTemplate } from "../generated/templates"

export function handleReactionDeployed(event: ReactionDeployed): void {
  let entity = ReactionDef.load(event.params.reactionContractAddr.toHex())
  if (entity == null) {
    entity = new ReactionDef(event.params.reactionContractAddr.toHex())
  }
  
  entity.user = createUser(event.params.creator).id;
  entity.contract = event.params.reactionContractAddr;
  entity.name = event.params.reactionTokenName;
  entity.symbol = event.params.reactionTokenSymbol;
  entity.save()

  let context = new DataSourceContext();
  context.setBytes('contract', event.params.reactionContractAddr)
  ReactionTokenTemplate.createWithContext(event.params.reactionContractAddr, context);
}

export function handleStake(event: Staked): void {
  let entity = Stake.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new Stake(event.transaction.hash.toHex())
  }

  entity.user = createUser(event.params.author).id;
  entity.token = event.params.stakingTokenAddress;
  entity.amount = event.params.amount;
  
  entity.save()
}

export function handleReacted(event: Reacted): void {
  let entity = Reaction.load(event.transaction.hash.toHex())
  if (entity == null) {
    entity = new Reaction(event.transaction.hash.toHex())
  }

  let reactionDef = ReactionDef.load(event.params.reactionTokenAddress.toHex());

  entity.user = createUser(event.params.author).id;
  entity.reaction = reactionDef.id;
  entity.amount = event.params.amount;
  entity.nft = event.params.nftAddress;
  entity.tokenId = event.params.tokenId;
  
  entity.save()
}

export function createUser(address: Address): User {
  let user = User.load(address.toHexString())
  if (user === null) {
    user = new User(address.toHexString())
    user.address = address;
    user.save()
  }

  return user as User;
}