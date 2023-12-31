use tracing::info;

use crate::{
    builder::traits::DbAction,
    handler::error::WorkerError,
    routes::honkai::dm_api::{
        atlas::SignatureAtlas,
        character::{eidolon::*, promotion_config::AvatarPromotionConfig, types::*},
        character_skill::types::*,
        equipment::{equipment_config::*, equipment_skill_config::*},
        equipment_skill::skill_tree_config::SkillTreeConfig,
        item::types::*,
        types::*,
    },
};

pub async fn seed_common() -> Result<(), WorkerError> {
    info!("seeding common tables...");
    Path::seed().await?;
    Element::seed().await?;
    SkillType::seed().await?;

    ItemType::seed().await?;
    ItemSubType::seed().await?;
    ItemRarity::seed().await?;

    info!("common tables seeded!");
    Ok(())
}

pub async fn seed_table() -> Result<(), WorkerError> {
    info!("seeding main tables...");

    Item::seed().await?;

    AvatarConfig::seed().await?;
    AvatarSkillConfig::seed().await?;
    SkillTreeConfig::seed().await?;
    AvatarRankConfig::seed().await?;
    AvatarPromotionConfig::seed().await?;

    EquipmentSkillConfig::seed().await?;
    EquipmentConfig::seed().await?;
    SignatureAtlas::seed().await?;

    info!("main tables seeded!");
    Ok(())
}
