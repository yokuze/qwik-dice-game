import type * as Party from 'partykit/server';
import { onConnect } from 'y-partykit';


export default class Server implements Party.Server {
   constructor(readonly party: Party.Party) {}

   onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
      // A websocket just connected!
      console.log(
`Connected:
   id: ${conn.id}
   room: ${this.party.id}
   url: ${new URL(ctx.request.url).pathname}`
      );

      return onConnect(conn, this.party);
   }
}

Server satisfies Party.Worker;
