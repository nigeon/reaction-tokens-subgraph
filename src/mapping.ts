import { Address } from '@graphprotocol/graph-ts'
import { ReactionDeployed } from "../generated/ReactionFactory/ReactionFactory"
import { Staked, Reacted } from "../generated/templates/ReactionToken/ReactionToken"
import { ReactionDef, Stake, Reaction, User } from "../generated/schema"

export function handleReactionDeployed(event: ReactionDeployed): void {
  let entity = ReactionDef.load(event.transaction.from.toHex())
  if (entity == null) {
    entity = new ReactionDef(event.transaction.from.toHex())
  }

  entity.user = createUser(event.params.creator).id;
  entity.contract = event.params.reactionContractAddr;
  entity.name = event.params.reactionTokenName;
  entity.symbol = event.params.reactionTokenSymbol;

  entity.save()
}

export function handleStake(event: Staked): void {
  let entity = Stake.load(event.transaction.from.toHex())
  if (entity == null) {
    entity = new Stake(event.transaction.from.toHex())
  }

  entity.user = createUser(event.params.author).id;
  entity.token = event.params.stakingTokenAddress;
  entity.amount = event.params.amount;
  
  entity.save()
}

export function handleReacted(event: Reacted): void {
  let entity = Reaction.load(event.transaction.from.toHex())
  if (entity == null) {
    entity = new Reaction(event.transaction.from.toHex())
  }

  entity.user = createUser(event.params.author).id;
  entity.reaction = ReactionDef.load(event.params.reactionTokenAddress.toHex()).id;
  entity.amount = event.params.amount;
  entity.nft = event.params.nftAddress;
  
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