import { InferSelectModel, relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("honkai_item", {
  id: int("id").primaryKey(),
  itemName: text("name"),
  rarity: text("rarity").references(() => itemRarities.name, {
    onDelete: "set null",
  }),
  itemMainType: text("main_type").references(() => itemTypes.name, {
    onDelete: "set null",
  }),
  itemSubType: text("sub_type").references(() => itemSubTypes.name, {
    onDelete: "set null",
  }),
  inventoryDisplayTag: int("inventory_display_tag"),
  purposeType: int("purpose_type"),
  itemDesc: text("desc"),
  itemBgdesc: text("bgdesc"),
  pileLimit: int("pile_limit"),
});

export type ItemSchema = InferSelectModel<typeof items>;

export const itemRelations = relations(items, ({ one }) => ({
  mainType: one(itemTypes, {
    fields: [items.itemMainType],
    references: [itemTypes.name],
  }),
  subType: one(itemSubTypes, {
    fields: [items.itemSubType],
    references: [itemSubTypes.name],
  }),
  rarity: one(itemRarities, {
    fields: [items.rarity],
    references: [itemRarities.name],
  }),
}));

export const itemTypes = sqliteTable("honkai_itemType", {
  name: text("name", {
    enum: ["Usable", "Mission", "Display", "Virtual", "Material"],
  }).primaryKey(),
  type: int("type").notNull(),
});

export const itemTypeRelation = relations(itemTypes, ({ many }) => ({
  items: many(items),
}));

export const itemSubTypes = sqliteTable("honkai_itemSubType", {
  name: text("name", {
    enum: [
      "Book",
      "Virtual",
      "Gift",
      "ChatBubble",
      "Food",
      "PhoneTheme",
      "GameplayCounter",
      "RelicRarityShowOnly",
      "ForceOpitonalGift",
      "Material",
      "MuseumExhibit",
      "RelicSetShowOnly",
      "MuseumStuff",
      "Formula",
      "Mission",
    ],
  }).primaryKey(),
  type: int("type").notNull(),
});

export const itemSubTypeRelations = relations(itemSubTypes, ({ many }) => ({
  items: many(items),
}));

export const itemRarities = sqliteTable("honkai_itemRarity", {
  name: text("name", {
    enum: ["VeryRare", "SuperRare", "Rare", "NotNormal", "Normal"],
  }).primaryKey(),
  type: int("type").notNull(),
});

export const itemRarityRelations = relations(itemRarities, ({ many }) => ({
  items: many(items),
}));
