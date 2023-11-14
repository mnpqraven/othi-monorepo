import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, int, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import { avatars } from "./avatar";
import { items } from "./item";

export type AvatarPromotionSchema = InferSelectModel<typeof avatarToPromotions>;
export const avatarToPromotions = sqliteTable(
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
  })
);

export const avatarToPromotionToItems = sqliteTable(
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
  })
);

export const avatarPromotionRelations = relations(
  avatarToPromotions,
  ({ one }) => ({
    promotion: one(avatars, {
      fields: [avatarToPromotions.characterId],
      references: [avatars.id],
    }),
  })
);

export const avatarPromotionItemRelations = relations(
  avatarToPromotionToItems,
  ({ one }) => ({
    avatar: one(avatars, {
      fields: [avatarToPromotionToItems.characterId],
      references: [avatars.id],
    }),
    promotion: one(avatarToPromotions, {
      fields: [avatarToPromotionToItems.ascension],
      references: [avatarToPromotions.ascension],
    }),
    item: one(items, {
      fields: [avatarToPromotionToItems.itemId],
      references: [items.id],
    }),
  })
);
