export type PostUserInput = {
  username: string;
  userEmail?: string;
};

export type PostUserOutput = {
  username: string;
  sessionId: string;
  userEmail?: string;
};

export type PostQuestionInput = {
  username: string;
};

export type PostQuestionOutput = {
  username: string;
  questionId: string;
};
