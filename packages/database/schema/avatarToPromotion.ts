import { int, sqliteTable } from "drizzle-orm/sqlite-core";

export const avatarToPromotions = sqliteTable("honkai_avatarPromotion", {
  avatar_id: int("id").primaryKey(),
  // promotion: Vec<u32>,
  // promotion_cost_list: Vec<Vec<MiniItem>>,
  // max_level: Vec<u32>,
  // player_level_require: u32,
  // attack_base: Vec<f64>,
  // attack_add: Vec<f64>,
  // defence_base: Vec<f64>,
  // defence_add: Vec<f64>,
  // hpbase: Vec<f64>,
  // hpadd: Vec<f64>,
  // speed_base: f64,
  // critical_chance: f64,
  // critical_damage: f64,
  // base_aggro: f64,
});
