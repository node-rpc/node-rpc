import crypto from "crypto";

export function md5(content: string): Buffer {
    const md5Hash: crypto.Hash = crypto.createHash("md5");
    return md5Hash.update(content).digest();
}

