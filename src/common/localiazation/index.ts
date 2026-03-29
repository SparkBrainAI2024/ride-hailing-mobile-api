import { language } from "src/schema/user/user-enum";
import { en_messages } from "./en";
import { np_messages } from "./np";

export const Message = (lang, key) => {
  const keys = key.split(".");
  if (lang === language.EN) {
    return filterMessage(keys, en_messages, key);
  }
  if (lang === language.NP) {
    return filterMessage(keys, np_messages, key);
  }
};

const filterMessage = (keys, errorObject, defaultMessage) => {
  let keysLength = keys.length;
  let message = defaultMessage;
  switch (keysLength) {
    case 1:
      message = errorObject[keys[0]];
      break;
    case 2:
      message = errorObject[keys[0]]?.[keys[1]];
      break;
    case 3:
      message = errorObject[keys[0]]?.[keys[1]]?.[keys[2]];
      break;
    case 4:
      message = errorObject[keys[0]]?.[keys[1]]?.[keys[2]]?.[keys[3]];
      break;
  }
  return message ? message : defaultMessage;
};
