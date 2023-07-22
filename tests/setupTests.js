/* eslint-disable no-undef */
import crypto from "@trust/webcrypto";

global.crypto = {
  subtle: crypto.subtle,
  getRandomValues: crypto.getRandomValues,
};
