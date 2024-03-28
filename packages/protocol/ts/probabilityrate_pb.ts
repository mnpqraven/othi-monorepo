// @generated by protoc-gen-es v1.4.1 with parameter "target=ts"
// @generated from file probabilityrate.proto (package probabilityrate, syntax proto3)
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
 * @generated from enum probabilityrate.BannerType
 */
export enum BannerType {
  /**
   * @generated from enum value: SSR = 0;
   */
  SSR = 0,

  /**
   * @generated from enum value: SR = 1;
   */
  SR = 1,

  /**
   * @generated from enum value: LC = 2;
   */
  LC = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(BannerType)
proto3.util.setEnumType(BannerType, "probabilityrate.BannerType", [
  { no: 0, name: "SSR" },
  { no: 1, name: "SR" },
  { no: 2, name: "LC" },
]);

/**
 * @generated from message probabilityrate.ProbabilityRatePayload
 */
export class ProbabilityRatePayload extends Message<ProbabilityRatePayload> {
  /**
   * @generated from field: int32 current_eidolon = 1;
   */
  currentEidolon = 0;

  /**
   * @generated from field: int32 pity = 2;
   */
  pity = 0;

  /**
   * @generated from field: int32 pulls = 3;
   */
  pulls = 0;

  /**
   * @generated from field: bool next_guaranteed = 4;
   */
  nextGuaranteed = false;

  /**
   * @generated from field: optional int32 enpitomized_pity = 5;
   */
  enpitomizedPity?: number;

  /**
   * @generated from field: probabilityrate.BannerType banner = 6;
   */
  banner = BannerType.SSR;

  constructor(data?: PartialMessage<ProbabilityRatePayload>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "probabilityrate.ProbabilityRatePayload";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: "current_eidolon",
      kind: "scalar",
      T: 5 /* ScalarType.INT32 */,
    },
    { no: 2, name: "pity", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "pulls", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    {
      no: 4,
      name: "next_guaranteed",
      kind: "scalar",
      T: 8 /* ScalarType.BOOL */,
    },
    {
      no: 5,
      name: "enpitomized_pity",
      kind: "scalar",
      T: 5 /* ScalarType.INT32 */,
      opt: true,
    },
    { no: 6, name: "banner", kind: "enum", T: proto3.getEnumType(BannerType) },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ProbabilityRatePayload {
    return new ProbabilityRatePayload().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ProbabilityRatePayload {
    return new ProbabilityRatePayload().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ProbabilityRatePayload {
    return new ProbabilityRatePayload().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | ProbabilityRatePayload
      | PlainMessage<ProbabilityRatePayload>
      | undefined,
    b:
      | ProbabilityRatePayload
      | PlainMessage<ProbabilityRatePayload>
      | undefined,
  ): boolean {
    return proto3.util.equals(ProbabilityRatePayload, a, b);
  }
}

/**
 * @generated from message probabilityrate.ProbabilityRateResponse
 */
export class ProbabilityRateResponse extends Message<ProbabilityRateResponse> {
  /**
   * @generated from field: int32 roll_budget = 1;
   */
  rollBudget = 0;

  /**
   * @generated from field: repeated probabilityrate.ReducedSims data = 2;
   */
  data: ReducedSims[] = [];

  constructor(data?: PartialMessage<ProbabilityRateResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "probabilityrate.ProbabilityRateResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "roll_budget", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "data", kind: "message", T: ReducedSims, repeated: true },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ProbabilityRateResponse {
    return new ProbabilityRateResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ProbabilityRateResponse {
    return new ProbabilityRateResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ProbabilityRateResponse {
    return new ProbabilityRateResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | ProbabilityRateResponse
      | PlainMessage<ProbabilityRateResponse>
      | undefined,
    b:
      | ProbabilityRateResponse
      | PlainMessage<ProbabilityRateResponse>
      | undefined,
  ): boolean {
    return proto3.util.equals(ProbabilityRateResponse, a, b);
  }
}

/**
 * @generated from message probabilityrate.ReducedSims
 */
export class ReducedSims extends Message<ReducedSims> {
  /**
   * @generated from field: repeated probabilityrate.ReducedSim index = 1;
   */
  index: ReducedSim[] = [];

  constructor(data?: PartialMessage<ReducedSims>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "probabilityrate.ReducedSims";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "index", kind: "message", T: ReducedSim, repeated: true },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ReducedSims {
    return new ReducedSims().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ReducedSims {
    return new ReducedSims().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ReducedSims {
    return new ReducedSims().fromJsonString(jsonString, options);
  }

  static equals(
    a: ReducedSims | PlainMessage<ReducedSims> | undefined,
    b: ReducedSims | PlainMessage<ReducedSims> | undefined,
  ): boolean {
    return proto3.util.equals(ReducedSims, a, b);
  }
}

/**
 * @generated from message probabilityrate.ReducedSim
 */
export class ReducedSim extends Message<ReducedSim> {
  /**
   * @generated from field: int32 eidolon = 1;
   */
  eidolon = 0;

  /**
   * @generated from field: double rate = 2;
   */
  rate = 0;

  constructor(data?: PartialMessage<ReducedSim>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "probabilityrate.ReducedSim";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "eidolon", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 2, name: "rate", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>,
  ): ReducedSim {
    return new ReducedSim().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>,
  ): ReducedSim {
    return new ReducedSim().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>,
  ): ReducedSim {
    return new ReducedSim().fromJsonString(jsonString, options);
  }

  static equals(
    a: ReducedSim | PlainMessage<ReducedSim> | undefined,
    b: ReducedSim | PlainMessage<ReducedSim> | undefined,
  ): boolean {
    return proto3.util.equals(ReducedSim, a, b);
  }
}
