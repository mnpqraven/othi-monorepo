const PREFIX = "time_" as const;

export class CategoryDropId {
  readonly day: number;
  readonly startTime: string;
  readonly id: `${typeof PREFIX}${string}_${string}`;

  constructor(opt: { day: number; time: string }) {
    const { day, time } = opt;
    this.day = day;
    this.startTime = time;
    this.id = `${PREFIX}${day}_${time}`;
  }

  static fromId(idLike: string): CategoryDropId | undefined {
    const noPrefix = idLike.slice(PREFIX.length);
    const dashIndex = noPrefix.indexOf("_");
    const dayLeft = Number(noPrefix.slice(0, dashIndex));
    const timeRight = noPrefix.slice(dashIndex + 1);
    return new CategoryDropId({ day: dayLeft, time: timeRight });
  }
}
