/* eslint-disable prefer-const */
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import * as qrcode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";
dotenv.config();
const app: Express = express();
const port = process.env.port;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({ authStrategy: new LocalAuth() });
client.initialize();
const date = new Date().toLocaleString("id-ID");

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR RECEIVED", qr);
});

client.on("ready", () => {
  console.log("Whatsapp Client is ready!" + date);
});

app.post("/", (req: Request, res: Response) => {
  const originalId: string = req.body.chatid;
  const isGroup: boolean = req.body.isGroup ? true : false;
  const msg = req.body.message;

  const chatId = isGroup
    ? originalId.concat("@g.us")
    : originalId.concat("@c.us");

  client
    .sendMessage(chatId, msg)
    .then((resp) => {
      res.status(200).json({ body: resp.body, from: resp.from, to: resp.to });
    })
    .catch((e) => {
      console.log("error ges: " + e);
      if (
        e.message.include("Evaluation failed: Error: wid error: invalid wid")
      ) {
        res
          .status(500)
          .json({ error: "chat id tidak di temukan, masukan dengan  benar" });
      } else {
        res.status(500).json({
          error: "ada kesalahan di server. coba lagi setelah 5 menit",
        });
      }
    });
});

app.get("/contact", (req: Request, res: Response) => {
  client
    .getContacts()
    .then((resp) => {
      res.json({ resp });
    })
    .catch((e) => {
      res.status(500).json({ error: e.message });
    });
});

app.listen(port, () => {
  console.log(
    `whatsapp api is running on port:${port} \n please wait until whatsapp client is ready!`
  );
});
