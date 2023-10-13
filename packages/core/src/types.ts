export type PostUserInput = {
  username: string;
  userEmail?: string;
};

export type PostUserOutput = {
  userId: string;
  username: string;
  sessionId: string;
  userEmail?: string;
};
