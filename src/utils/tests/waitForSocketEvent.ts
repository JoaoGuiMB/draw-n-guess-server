import { Socket as ClientSocket } from "socket.io-client";

interface Response {
  message: string;
}

export default function waitFor(emitter: ClientSocket, event: string) {
  return new Promise<Response>((resolve) => {
    emitter.once(event, resolve);
  });
}
