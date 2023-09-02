import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import {
  channel,
  channelsRelations,
  conversation,
  directMessage,
  member,
  message,
  profile,
  server,
  serversRelations,
} from "./schema/schema";
// create the connection
const connection = connect({
  host: process.env.PLANETSCALE_DATABASE_HOST,
  username: process.env.PLANETSCALE_DATABASE_USERNAME,
  password: process.env.PLANETSCALE_DATABASE_PASSWORD,
});

export const db = drizzle(connection, {
  schema: {
    profiles: profile,
    servers: server,
    members: member,
    channels: channel,
    messages: message,
    conversations: conversation,
    directMessages: directMessage,
    serversRelations,
    channelsRelations,
  },
});
export type DBClient = typeof db;
