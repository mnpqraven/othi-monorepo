// @generated by protoc-gen-es v1.4.1 with parameter "target=ts"
// @generated from file shared.proto (package dm.shared, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message dm.shared.CharId
 */
export class CharId extends Message<CharId> {
  /**
   * @generated from field: uint32 char_id = 1;
   */
  charId = 0;

  constructor(data?: PartialMessage<CharId>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "dm.shared.CharId";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "char_id", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): CharId {
    return new CharId().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): CharId {
    return new CharId().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): CharId {
    return new CharId().fromJsonString(jsonString, options);
  }

  static equals(
    a: CharId | PlainMessage<CharId> | undefined,
    b: CharId | PlainMessage<CharId> | undefined,
  ): boolean {
    return proto3.util.equals(CharId, a, b);
  }
}
