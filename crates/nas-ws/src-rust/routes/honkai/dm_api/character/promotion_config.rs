use super::types::MiniItem;
use crate::{
    builder::{get_db_client, traits::DbAction},
    handler::error::WorkerError,
    routes::honkai::{dm_api::types::Param, traits::DbData},
};
use async_trait::async_trait;
use libsql_client::{args, Statement};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UpstreamAvatarPromotionConfig {
    #[serde(alias = "AvatarID")]
    avatar_id: u32,
    #[serde(alias = "Promotion")]
    promotion: u32,
    #[serde(alias = "PromotionCostList")]
    promotion_cost_list: Vec<MiniItem>,
    #[serde(alias = "MaxLevel")]
    max_level: u32,
    #[serde(alias = "PlayerLevelRequire")]
    player_level_require: Option<u32>,
    #[serde(alias = "AttackBase")]
    attack_base: Param,
    #[serde(alias = "AttackAdd")]
    attack_add: Param,
    #[serde(alias = "DefenceBase")]
    defence_base: Param,
    #[serde(alias = "DefenceAdd")]
    defence_add: Param,
    #[serde(alias = "HPBase")]
    hpbase: Param,
    #[serde(alias = "HPAdd")]
    hpadd: Param,
    #[serde(alias = "SpeedBase")]
    speed_base: Param,
    #[serde(alias = "CriticalChance")]
    critical_chance: Param,
    #[serde(alias = "CriticalDamage")]
    critical_damage: Param,
    #[serde(alias = "BaseAggro")]
    base_aggro: Param,
}

#[derive(Serialize, Deserialize, Debug, Clone, JsonSchema)]
pub struct AvatarPromotionConfig {
    pub avatar_id: u32,
    pub promotion: Vec<u32>,
    pub promotion_cost_list: Vec<Vec<MiniItem>>,
    pub max_level: Vec<u32>,
    pub player_level_require: u32,
    pub attack_base: Vec<f64>,
    pub attack_add: Vec<f64>,
    pub defence_base: Vec<f64>,
    pub defence_add: Vec<f64>,
    pub hpbase: Vec<f64>,
    pub hpadd: Vec<f64>,
    pub speed_base: f64,
    pub critical_chance: f64,
    pub critical_damage: f64,
    pub base_aggro: f64,
}

#[async_trait]
impl DbData for AvatarPromotionConfig {
    type TUpstream = HashMap<u32, BTreeMap<u32, UpstreamAvatarPromotionConfig>>;
    type TLocal = HashMap<u32, AvatarPromotionConfig>;

    fn path_data() -> &'static str {
        "ExcelOutput/AvatarPromotionConfig.json"
    }

    async fn upstream_convert(from: Self::TUpstream) -> Result<Self::TLocal, WorkerError> {
        let local = from
            .into_iter()
            .map(|(main_key, inner_map)| {
                let default_first = inner_map.get(&0).unwrap();

                let data: AvatarPromotionConfig = AvatarPromotionConfig {
                    avatar_id: main_key,
                    promotion: inner_map.values().map(|e| e.promotion).collect(),
                    promotion_cost_list: inner_map
                        .values()
                        .map(|e| e.promotion_cost_list.clone())
                        .collect(),
                    max_level: inner_map.values().map(|e| e.max_level).collect(),
                    player_level_require: default_first.player_level_require.unwrap_or_default(),
                    attack_base: inner_map.values().map(|e| e.attack_base.value).collect(),
                    attack_add: inner_map.values().map(|e| e.attack_add.value).collect(),
                    defence_base: inner_map.values().map(|e| e.defence_base.value).collect(),
                    defence_add: inner_map.values().map(|e| e.defence_add.value).collect(),
                    hpbase: inner_map.values().map(|e| e.hpbase.value).collect(),
                    hpadd: inner_map.values().map(|e| e.hpadd.value).collect(),
                    speed_base: default_first.speed_base.value,
                    critical_chance: default_first.critical_chance.value,
                    critical_damage: default_first.critical_damage.value,
                    base_aggro: default_first.base_aggro.value,
                };
                (main_key, data)
            })
            .collect();
        Ok(local)
    }
}

#[async_trait]
impl DbAction for AvatarPromotionConfig {
    async fn seed() -> Result<(), WorkerError> {
        let client = get_db_client().await?;
        let promotion_db = AvatarPromotionConfig::get_upstream().await?;
        let promotion_statements = promotion_db
            .values()
            .flat_map(|outer| {
                outer
                    .values()
                    .map(|inner| {
                        let UpstreamAvatarPromotionConfig {
                            avatar_id,
                            promotion,
                            max_level,
                            player_level_require,
                            attack_base,
                            attack_add,
                            defence_base,
                            defence_add,
                            hpbase,
                            hpadd,
                            speed_base,
                            critical_chance,
                            critical_damage,
                            base_aggro,
                            promotion_cost_list: _,
                        } = inner.clone();

                        Statement::with_args(
                            "INSERT OR REPLACE INTO honkai_avatarPromotion (
                                avatar_id, ascension, max_level, trailblaze_level_require,
                                base_attack, base_defense, base_hp,
                                add_attack, add_defense, add_hp,
                                base_speed, crit_chance, crit_damage, aggro
                            ) VALUES (
                                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                            )",
                            args!(
                                avatar_id,
                                promotion,
                                max_level,
                                player_level_require,
                                attack_base.value,
                                defence_base.value,
                                hpbase.value,
                                attack_add.value,
                                defence_add.value,
                                hpadd.value,
                                speed_base.value,
                                critical_chance.value,
                                critical_damage.value,
                                base_aggro.value
                            ),
                        )
                    })
                    .collect::<Vec<Statement>>()
            })
            .collect::<Vec<Statement>>();

        let item_statements = promotion_db
            .values()
            .flat_map(|outer| {
                outer
                    .values()
                    .flat_map(|inner| {
                        inner
                            .promotion_cost_list
                            .iter()
                            .map(|cost| {
                                Statement::with_args(
                                    "INSERT OR REPLACE INTO honkai_avatarPromotion_item (
                                        avatar_id, ascension, item_id, item_amount
                                    ) VALUES ( ?, ?, ?, ?)",
                                    args!(
                                        inner.avatar_id,
                                        inner.promotion,
                                        cost.item_id,
                                        cost.item_num
                                    ),
                                )
                            })
                            .collect::<Vec<Statement>>()
                    })
                    .collect::<Vec<Statement>>()
            })
            .collect::<Vec<Statement>>();

        client.batch(promotion_statements).await?;
        client.batch(item_statements).await?;

        Ok(())
    }
    async fn teardown() -> Result<(), WorkerError> {
        let client = get_db_client().await?;
        client.execute("DELETE FROM honkai_avatarPromotion").await?;

        Ok(())
    }
}
