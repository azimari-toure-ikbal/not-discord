import { relations, sql, type InferSelectModel } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const profile = mysqlTable("profile", {
  id: varchar("id", {
    length: 40,
  }).primaryKey(),
  userId: varchar("userId", {
    length: 40,
  })
    .notNull()
    .unique(),
  name: varchar("name", {
    length: 144,
  }).notNull(),
  imageUrl: text("imageUrl"),
  email: text("email"),
  createdAt: datetime("createdAt").default(sql`now()`),
  updatedAt: datetime("updatedAt"),
});

export const server = mysqlTable(
  "server",
  {
    id: varchar("id", {
      length: 40,
    }).primaryKey(),
    name: varchar("name", {
      length: 144,
    }).notNull(),
    imageUrl: text("imageUrl").notNull(),
    inviteCode: text("inviteCode"),
    profileId: varchar("profileId", {
      length: 40,
    }),
    createdAt: datetime("createdAt").default(sql`now()`),
    updatedAt: datetime("updatedAt"),
  },
  (table) => {
    return {
      profileIdx: index("server_profile_idx").on(table.profileId),
    };
  },
);

export const member = mysqlTable(
  "member",
  {
    id: varchar("id", {
      length: 40,
    }).primaryKey(),
    role: mysqlEnum("role", ["ADMIN", "MODERATOR", "GUEST"]).default("GUEST"),
    profileId: varchar("profileId", {
      length: 40,
    }),
    serverId: varchar("serverId", {
      length: 40,
    }),
    createdAt: datetime("createdAt").default(sql`now()`),
    updatedAt: datetime("updatedAt"),
  },
  (table) => {
    return {
      profileIdx: index("memver_profile_idx").on(table.profileId),
      serverIdx: index("member_server_idx").on(table.serverId),
    };
  },
);

export const channel = mysqlTable(
  "channel",
  {
    id: varchar("id", {
      length: 40,
    }).primaryKey(),
    name: varchar("name", {
      length: 144,
    }).notNull(),
    type: mysqlEnum("type", ["TEXT", "AUDIO", "VIDEO"]).default("TEXT"),
    profileId: varchar("profileId", {
      length: 40,
    }),
    serverId: varchar("serverId", {
      length: 40,
    }),
    createdAt: datetime("createdAt").default(sql`now()`),
    updatedAt: datetime("updatedAt"),
  },
  (table) => {
    return {
      profileIdx: index("channel_profile_idx").on(table.profileId),
      serverIdx: index("channel_server_idx").on(table.serverId),
    };
  },
);

export const message = mysqlTable(
  "message",
  {
    id: varchar("id", {
      length: 40,
    }).primaryKey(),
    content: text("content"),
    fileUrl: text("fileUrl"),
    profileId: varchar("profileId", {
      length: 40,
    }),
    memberId: varchar("memberId", {
      length: 40,
    }),
    channelId: varchar("channelId", {
      length: 40,
    }),
    serverId: varchar("serverId", {
      length: 40,
    }),
    deleted: boolean("deleted").default(false),

    createdAt: datetime("createdAt").default(sql`now()`),
    updatedAt: datetime("updatedAt"),
  },
  (table) => {
    return {
      profileIdx: index("channel_profile_idx").on(table.profileId),
      serverIdx: index("channel_server_idx").on(table.serverId),
      channelIdx: index("channel_server_idx").on(table.channelId),
    };
  },
);

export const conversation = mysqlTable(
  "conversation",
  {
    id: varchar("id", {
      length: 40,
    }).primaryKey(),
    memberOneId: varchar("memberOneId", {
      length: 40,
    }).unique(),
    memberTwoId: varchar("memberTwoId", {
      length: 40,
    }).unique(),
    createdAt: datetime("createdAt").default(sql`now()`),
    updatedAt: datetime("updatedAt"),
  },
  (table) => {
    return {
      memberOneIdx: index("conversation_memberOne_idx").on(table.memberOneId),
      memberTwoIdx: index("conversation_memberTwo_idx").on(table.memberTwoId),
    };
  },
);

export const directMessage = mysqlTable(
  "directMessage",
  {
    id: varchar("id", {
      length: 40,
    }).primaryKey(),
    content: text("content"),
    fileUrl: text("fileUrl"),
    conversationId: varchar("conversationId", {
      length: 40,
    }),
    profileId: varchar("profileId", {
      length: 40,
    }),
    memberId: varchar("memberId", {
      length: 40,
    }),
    deleted: boolean("deleted").default(false),
    createdAt: datetime("createdAt").default(sql`now()`),
    updatedAt: datetime("updatedAt"),
  },
  (table) => {
    return {
      profileIdx: index("channel_profile_idx").on(table.profileId),
      memberIdx: index("channel_server_idx").on(table.memberId),
    };
  },
);

export const profilesRelations = relations(profile, ({ many }) => ({
  servers: many(server),
  members: many(member),
}));

export const serversRelations = relations(server, ({ one, many }) => ({
  members: many(member),
  profile: one(profile, {
    fields: [server.profileId],
    references: [profile.id],
  }),
  channels: many(channel),
}));

export const membersRelations = relations(member, ({ one }) => ({
  profile: one(profile, {
    fields: [member.profileId],
    references: [profile.id],
  }),
  server: one(server, {
    fields: [member.serverId],
    references: [server.id],
  }),
}));

export const messagesRelations = relations(message, ({ one }) => ({
  profile: one(profile, {
    fields: [message.profileId],
    references: [profile.id],
  }),
  server: one(server, {
    fields: [message.serverId],
    references: [server.id],
  }),
  channel: one(channel, {
    fields: [message.channelId],
    references: [channel.id],
  }),
}));

export const channelsRelations = relations(channel, ({ one }) => ({
  profile: one(profile, {
    fields: [channel.profileId],
    references: [profile.id],
  }),
  server: one(server, {
    fields: [channel.serverId],
    references: [server.id],
  }),
}));

export type Profile = InferSelectModel<typeof profile>;

export type Server = InferSelectModel<typeof server>;

export type Member = InferSelectModel<typeof member>;

export type Channel = InferSelectModel<typeof channel>;

export type Message = InferSelectModel<typeof message>;

export enum Role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  GUEST = "GUEST",
}

export enum ChannelType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}
