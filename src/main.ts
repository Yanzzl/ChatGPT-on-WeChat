import QRCode from "qrcode";
import { WechatyBuilder } from "wechaty";
import { ChatGPTBot } from "./chatgpt.js";

// Wechaty instance
const weChatBot = WechatyBuilder.build({
  name: "my-wechat-bot",
  // puppet: "wechaty-puppet-wechat",
  puppetOptions: {
    uos: true, // 开启uos协议
  },

});
// ChatGPTBot instance
const chatGPTBot = new ChatGPTBot();

async function main() {
  weChatBot
    // scan QR code for login
    .on("scan", async (qrcode, status) => {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
      console.log(`💡 Scan QR Code to login: ${status}\n${url}`);
      console.log(
        await QRCode.toString(qrcode, { type: "terminal", small: true })
      );
    })
    // login to WeChat desktop account
    .on("login", async (user: any) => {
      console.log(`✅ User ${user} has logged in`);
      chatGPTBot.setBotName(user.name());
      await chatGPTBot.startGPTBot();
    })
    // message handler
    .on("message", async (message: any) => {
      try {
        console.log(`📨 ${message}`);
        // add your own task handlers over here to expand the bot ability!
        // e.g. if a message starts with "Hello", the bot sends "World!"
        if (message.text().startsWith("Hello")) {
          await message.say("World!");
          return;
        }
        // handle message for chatGPT bot
        console.log(message.room())
        console.log(typeof message.room())
        await chatGPTBot.onMessage(message);
      } catch (e) {
        console.error(`❌ ${e}`);
      }
    });

  try {
    await weChatBot.start();
  } catch (e) {
    console.error(`❌ Your Bot failed to start: ${e}`);
    console.log(
      "🤔 Can you login WeChat in browser? The bot works on the desktop WeChat"
    );
  }
}
main();
