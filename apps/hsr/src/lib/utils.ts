import type { SkillType } from "@hsr/bindings/AvatarSkillConfig";

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
  attackType: SkillType | null | undefined,
  typeDesc: string
): string | undefined {
  let ttype = "";
  if (attackType) {
    switch (attackType) {
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
    switch (typeDesc) {
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

export function sortSkillsByDesc<
  T extends { attackType: SkillType | null | undefined }
>(a: T, b: T) {
  const toInt = (ttype: SkillType | null | undefined) => {
    if (ttype === "Maze") return 5;
    if (ttype === "Ultra") return 4;
    if (ttype === "BPSkill") return 3;
    if (ttype === "Talent") return 2;
    if (ttype === "Normal") return 1;
    return 0;
  };
  return toInt(a.attackType) - toInt(b.attackType);
}
