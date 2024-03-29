// @generated by protoc-gen-connect-query v0.6.0 with parameter "target=ts,import_extension=none"
// @generated from file character.proto (package dm.character, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CharId } from "./shared_pb";
import { CharacterMetadata, CharacterMetadatas } from "./character_pb";
import { Empty, MethodKind } from "@bufbuild/protobuf";
import {
  createQueryService,
  createUnaryHooks,
  UnaryFunctionsWithHooks,
} from "@connectrpc/connect-query";

export const typeName = "dm.character.CharacterMetadataService";

/**
 * @generated from service dm.character.CharacterMetadataService
 */
export const CharacterMetadataService = {
  typeName: "dm.character.CharacterMetadataService",
  methods: {
    /**
     * @generated from rpc dm.character.CharacterMetadataService.ById
     */
    byId: {
      name: "ById",
      I: CharId,
      O: CharacterMetadata,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc dm.character.CharacterMetadataService.List
     */
    list: {
      name: "List",
      I: Empty,
      O: CharacterMetadatas,
      kind: MethodKind.Unary,
    },
  },
} as const;

const $queryService = createQueryService({ service: CharacterMetadataService });

/**
 * @generated from rpc dm.character.CharacterMetadataService.ById
 */
export const byId: UnaryFunctionsWithHooks<CharId, CharacterMetadata> = {
  ...$queryService.byId,
  ...createUnaryHooks($queryService.byId),
};

/**
 * @generated from rpc dm.character.CharacterMetadataService.List
 */
export const list: UnaryFunctionsWithHooks<Empty, CharacterMetadatas> = {
  ...$queryService.list,
  ...createUnaryHooks($queryService.list),
};
