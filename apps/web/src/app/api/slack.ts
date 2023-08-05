import { WebClient } from "@slack/web-api";
import { isNil } from "lodash";

let webClient: WebClient;

export async function sendSlackMessage(
  markdown: string,
  disableNotification = false
) {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (isNil(webClient)) {
    webClient = new WebClient(process.env.SLACK_TOKEN);
  }

  const channel = "#tradescreener-bot";
  const stage = "production";
  const text = `[${stage}] ${markdown}`;

  try {
    await webClient.chat.postMessage({
      channel,
      ...(disableNotification ? ({ link_names: 0 } as any) : {}),
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text,
          },
        },
      ],
    });
  } catch (error) {
    console.error("failed to send message", error);
  }
}
