import axios from "axios";

export default async function sendErrorMessage(msg: string, isGroup = false) {
  await axios
    .post(`${process.env.urlWA!}:${process.env.port}`, {
      chatid: process.env.chatID,
      message: msg,
      isGroup,
    })
    .then((res) => {
      console.log("berhasil kirim pesan error");
    })
    .catch((e) => {
      console.log("gagal kirim pesan error");
    });
}
