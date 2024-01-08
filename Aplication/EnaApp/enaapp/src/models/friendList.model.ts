import { User } from "./user.model";

export interface FriendList {
    id?: number;
    userId?: number;
    user?: User;
    friendId?: number;
    friend?: User;
  }