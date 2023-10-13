import { Events } from '@hackathon-rugby-is-easy/core/events';

export const handler = async ({ Records }: {
  Records: {
    eventName: string;
    dynamodb: {
      NewImage: {
        PK: { S: string };
        SK: { S: string };
        upvotes: { N: string };
        downvotes: { N: string };
      };
      OldImage?: {
        upvotes: { N: string };
        downvotes: { N: string };
      };
    };
  }[]
}) => {
  await Promise.all(Records.map(async (record) => {
    const { eventName, dynamodb } = record;

    if (eventName !== 'MODIFY' && eventName !== 'INSERT') {
      return;
    }

    const { NewImage, OldImage } = dynamodb;

    switch (NewImage.PK.S) {
      case 'Response': {
        await Events.ResponseUpdated.publish({
          responseId: NewImage.SK.S,
          upvotes: +NewImage.upvotes.N,
          previousUpvotes: OldImage === undefined ? 0 : +OldImage.upvotes.N,
          downvotes: +NewImage.downvotes.N,
          previousDownvotes: OldImage === undefined ? 0 : +OldImage.downvotes.N,
        });
        break;
      }
      default: {
        break;
      }
    }
  }));
};