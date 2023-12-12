export const Topic = {
  ADS: "Ads",
  LIVE: "Live",
  LEVEL: "Level",
  REWARD: "Reward",
  STREAK: "Streak",
  COMMENT: "Comment",
  GENERAL: "General",
};

export default interface Notification {
  icon: string;
  image: string;
  title: string;
  body: string;
  topic: keyof typeof Topic,
  is_read: string;
  metadata: Record<string, string>;
}
