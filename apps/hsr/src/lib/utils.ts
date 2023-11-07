import type {
  AvatarSkillConfig,
  SkillType,
} from "@hsr/bindings/AvatarSkillConfig";

export function parseSkillType(
  skillType: SkillType | undefined | null,
  fallbackSkillDesc: string
) {
  if (skillType)
    switch (skillType) {
      case "Normal":
        return "Attack";
      case "BPSkill":
        return "Skill";
      case "Ultra":
        return "Ultimate";
      case "Talent":
        return "Talent";
      case "MazeNormal":
        return "Attack";
      case "Maze":
        return "Technique";
    }
  else
    switch (fallbackSkillDesc) {
      case "Basic ATK":
        return "Attack";
      case "Skill":
        return "BPSkill";
      case "Ultra":
        return "Ultimate";
      case "Talent":
        return "Talent";
      case "Technique":
        return "Technique";
    }
  return "";
}

const IMG_REPO = "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master";
export const img = (suffix: string) =>
  suffix.startsWith("/") ? IMG_REPO + suffix : `${IMG_REPO}/${suffix}`;

export function keepPreviousData<T>(data: T | undefined): T | undefined {
  return data;
}

export function getImagePath(
  characterId: number | null | undefined,
  skill: AvatarSkillConfig
): string | undefined {
  let ttype = "";
  if (skill.attack_type) {
    switch (skill.attack_type) {
      case "Normal":
        ttype = "basic_atk";
        break;
      case "BPSkill":
        ttype = "skill";
        break;
      case "Ultra":
        ttype = "ultimate";
        break;
      case "Talent":
        ttype = "talent";
        break;
      case "Maze":
        ttype = "technique";
        break;
      default:
        return undefined;
    }
  } else {
    switch (skill.skill_type_desc) {
      case "Basic ATK":
        ttype = "basic_atk";
        break;
      case "Skill":
        ttype = "skill";
        break;
      case "Ultra":
        ttype = "ultimate";
        break;
      case "Talent":
        ttype = "talent";
        break;
      case "Technique":
        ttype = "technique";
        break;
    }
  }
  if (!characterId) return undefined;
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/skill/${characterId}_${ttype}.png`;
}
