// @generated by protoc-gen-connect-es v1.5.0 with parameter "target=ts,import_extension=.ts"
// @generated from file character.proto (package dm.character, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { CharId } from "./shared_pb.ts";
import { CharacterMetadata, CharacterMetadatas } from "./character_pb.ts";
import { Empty, MethodKind } from "@bufbuild/protobuf";

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
  }
} as const;

