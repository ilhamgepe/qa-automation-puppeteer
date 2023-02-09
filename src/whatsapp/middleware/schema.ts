import { AllowedSchema } from "express-json-validator-middleware";

export const messageSchema: AllowedSchema = {
  type: "object",
  required: ["chatid"],
  properties: {
    chatid: { type: "string" },
    message: { type: "string" },
    isGroup: { type: "boolean" },
  },
};
