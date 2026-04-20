export type User = {
  id: number;
  nickname: string;

  profileImageUrl?: string;
  mannerTemperature?: number;

  department?: string;
  bio?: string;
  tags?: string[];

  isVerified?: boolean;
};
