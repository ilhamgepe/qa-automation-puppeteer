import axios, { AxiosError } from "axios";
import sendErrorMessage from "../sendMessage";

interface body {
  title: string;
  amount: number;
  expires_at: string;
  description: string;
  _token: string;
}
interface header {
  Cookie: string;
  Accept: string;
  "Content-Type": string;
  Cache: string;
}
export default async function createPL(
  url: string | null,
  body: body,
  header: header
) {
  await axios
    .post(
      url ?? "https://purwantara.id/payment-links",
      {
        ...body,
      },
      {
        headers: {
          ...header,
        },
        withCredentials: true,
      }
    )
    .then((res) => {
      if (res.status == 200) {
        console.log("berhasil create paymentlink");
      }
    })
    .catch(async (e: AxiosError) => {
      const message = `error di pembuatan paymentlink, message : ${e.message}`;
      await sendErrorMessage(message);
      throw new Error(message);
    });
}
