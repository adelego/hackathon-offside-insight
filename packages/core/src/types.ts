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
  questionText: string;
  matchDetails: {
    team1: string;
    team2: string;
    date: string;
  };
  questionTimestamp?: string;
  videoFilename?: string;
};

export type PostQuestionOutput = {
  username: string;
  questionId: string;
};

export type ListUserQuestionsOutput = {
  questions: Array<any>;
};

export type PostResponseInput = {
  questionId: string;
  responseText: string;
  username: string;
};

export type PostResponseOutput = {
  questionId: string;
  responseId: string;
};

export type GetQuestionOutput = {
  questionId: string;
  questionText: string;
  matchDetails: {
    team1: string;
    team2: string;
    date: string;
  };
  questionTimestamp?: string;
  signedUrl?: string;
};

export type ListQuestionResponsesOutput = {
  responses: Array<any>;
};

export type PostMediaInput = {};

export type UsersLeaderboardOutput = {
  users: {
    username: string;
    score: number;
  }[];
};
