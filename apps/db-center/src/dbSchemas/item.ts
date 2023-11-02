import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("item", {
  id: int("id").primaryKey(),
  item_name: text("name"),
  rarity: text("rarity")
    .references(() => itemRarities.name)
    .notNull(),
  item_main_type: text("main_type")
    .references(() => itemTypes.name)
    .notNull(),
  item_sub_type: text("sub_type")
    .references(() => itemSubTypes.name)
    .notNull(),
  inventory_display_tag: int("inventory_display_tag"),
  purpose_type: int("purpose_type"),
  item_desc: text("desc"),
  item_bgdesc: text("bgdesc"),
  pile_limit: int("pile_limit"),
});

export const itemTypes = sqliteTable("itemType", {
  name: text("name", {
    enum: ["Usable", "Mission", "Display", "Virtual", "Material"],
  }).primaryKey(),
  type: int("type").notNull(),
});

export const itemSubTypes = sqliteTable("itemSubType", {
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

export const itemRarities = sqliteTable("itemRarity", {
  name: text("name", {
    enum: ["VeryRare", "SuperRare", "Rare", "NotNormal", "Normal"],
  }).primaryKey(),
  type: int("type").notNull(),
});
