// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext
} from "@graphprotocol/graph-ts";

export class ReactionToken extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("ReactionToken", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "ReactionToken",
      [address.toHex()],
      context
    );
  }
}

export class StakedFlow extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("StakedFlow", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "StakedFlow",
      [address.toHex()],
      context
    );
  }
}
