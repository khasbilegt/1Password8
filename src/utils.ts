import { Cache, Clipboard, environment, Icon, showToast, Toast } from "@raycast/api";
import { execFileSync } from "child_process";

import { CategoryName } from "./types";

const cache = new Cache();

const CLI_PATH =
  `${environment.assetsPath}/op` || process.arch == "arm64" ? "/opt/homebrew/bin/op" : "/usr/local/bin/op";

export const CATEGORIES_CACHE_NAME = "@categories";
export const ITEMS_CACHE_NAME = "@items";
export const PROFILE_CACHE_NAME = "@profile";

export function op<T>(key: string, args: string[]): T | undefined {
  if (cache.has(key)) {
    return JSON.parse(cache.get(key) as string);
  }

  try {
    const stdout = execFileSync(CLI_PATH, [...args, "--format=json"]);
    const items = stdout.toString();
    cache.set(key, items);
    return JSON.parse(items);
  } catch (error: any) {
    showToast({
      style: Toast.Style.Failure,
      title: "Command failed",
      message: error?.message,
      primaryAction: {
        title: "Copy logs",
        onAction: async (toast) => {
          await Clipboard.copy(error?.message);
          toast.hide();
        },
      },
    });
  }
}

export function clearCache(key?: string) {
  if (!cache.isEmpty) {
    if (key && cache.has(key)) {
      cache.remove(key);
    } else {
      cache.clear({ notifySubscribers: false });
    }
  }
}

export function getCategoryIcon(category: CategoryName) {
  switch (category) {
    case "API_CREDENTIAL":
      return Icon.Code;
    case "CREDIT_CARD":
      return Icon.CreditCard;
    case "CRYPTO_WALLET":
      return Icon.Crypto;
    case "BANK_ACCOUNT":
    case "CUSTOM":
      return Icon.Wallet;
    case "DATABASE":
      return Icon.HardDrive;
    case "DOCUMENT":
      return Icon.Document;
    case "DRIVER_LICENSE":
      return Icon.Car;
    case "EMAIL_ACCOUNT":
      return Icon.Envelope;
    case "IDENTITY":
      return Icon.Person;
    case "LOGIN":
      return Icon.Fingerprint;
    case "MEDICAL_RECORD":
      return Icon.Heartbeat;
    case "MEMBERSHIP":
      return Icon.StarCircle;
    case "OUTDOOR_LICENSE":
      return Icon.Tree;
    case "PASSPORT":
      return Icon.Globe;
    case "PASSWORD":
      return Icon.Key;
    case "REWARD_PROGRAM":
      return Icon.Gift;
    case "SECURE_NOTE":
      return Icon.Lock;
    case "SOCIAL_SECURITY_NUMBER":
      return Icon.Shield;
    case "SOFTWARE_LICENSE":
      return Icon.CodeBlock;
    case "SERVER":
    case "SSH_KEY":
      return Icon.Terminal;
    case "WIRELESS_ROUTER":
      return Icon.Wifi;
    default:
      return Icon.Key;
  }
}
