export type IUserEvent = {
  user: {
    id: string;
    name: string;
    deleted: boolean;
    real_name: string;
    tz: string;
    profile: {
      status_text: string;
      status_emoji: string;
      image_512: string;
    }
  }
};