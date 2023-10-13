import { Events } from '@hackathon-rugby-is-easy/core/events';

export const handler = async ({ Records }: {
  Records: {
    eventName: string;
    dynamodb: {
      NewImage: {
        PK: { S: string };
        SK: { S: string };
      };
      OldImage: {
        PK: { S: string };
        SK: { S: string };
      };
    };
  }[]
}) => {
  await Promise.all(Records.map(async (record) => {
    const { eventName, dynamodb } = record;

    if (eventName !== 'MODIFY' && eventName !== 'INSERT') {
      return;
    }

    const { NewImage } = dynamodb;

    switch (NewImage.PK.S) {
      case 'Response': {
        await Events.ResponseUpdated.publish({
          responseId: NewImage.SK.S,
        });
        break;
      }
      default: {
        break;
      }
    }
  }));
};