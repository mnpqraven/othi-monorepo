import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, int, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import { avatars } from "./avatar";
import { items } from "./item";

export type AvatarPromotionSchema = InferSelectModel<typeof avatarPromotions>;
export const avatarPromotions = sqliteTable(
  "honkai_avatarPromotion",
  {
    characterId: int("avatar_id")
      .references(() => avatars.id, {
        onDelete: "cascade",
      })
      .notNull(),
    ascension: int("ascension").notNull(),
    maxLevel: int("max_level").notNull(),
    requireLevel: int("trailblaze_level_require"),
    baseAttack: int("base_attack").notNull(),
    baseDefense: int("base_defense").notNull(),
    baseHp: int("base_hp").notNull(),
    addAttack: int("add_attack").notNull(),
    addDefense: int("add_defense").notNull(),
    addHp: int("add_hp").notNull(),
    baseSpeed: int("base_speed").notNull(),
    critChance: int("crit_chance").notNull(),
    critDamage: int("crit_damage").notNull(),
    aggro: int("aggro").notNull(),
  },
  (t) => ({
    primaryKey: primaryKey(t.characterId, t.ascension),
    ascensionIdx: index("honkai_avatarPromotion_ascension_idx").on(t.ascension),
  }),
);

export const avatarPromotionItems = sqliteTable(
  "honkai_avatarPromotion_item",
  {
    characterId: int("avatar_id").references(() => avatars.id, {
      onDelete: "cascade",
    }),
    ascension: int("ascension"),
    itemId: int("item_id").references(() => items.id),
    amount: int("item_amount").default(0),
  },
  (t) => ({
    primaryKey: primaryKey(t.ascension, t.characterId, t.itemId),
    ascensionIdx: index("honkai_avatarPromotionItem_ascension_idx").on(
      t.ascension,
    ),
  }),
);

export const avatarPromotionRelations = relations(
  avatarPromotions,
  ({ one }) => ({
    promotion: one(avatars, {
      fields: [avatarPromotions.characterId],
      references: [avatars.id],
    }),
  }),
);

export const avatarPromotionItemRelations = relations(
  avatarPromotionItems,
  ({ one }) => ({
    avatar: one(avatars, {
      fields: [avatarPromotionItems.characterId],
      references: [avatars.id],
    }),
    promotion: one(avatarPromotions, {
      fields: [avatarPromotionItems.ascension],
      references: [avatarPromotions.ascension],
    }),
    item: one(items, {
      fields: [avatarPromotionItems.itemId],
      references: [items.id],
    }),
  }),
);
