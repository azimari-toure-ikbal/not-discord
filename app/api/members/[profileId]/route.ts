import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/drizzle/db";
import { member } from "@/lib/drizzle/schema/schema";
import { and, asc, eq, not, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      profileId: string;
    };
  },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.profileId) {
      return new NextResponse("Profile ID missing", { status: 400 });
    }

    const updatedMember = await db
      .update(member)
      .set({
        role,
        updatedAt: sql`now()`,
      })
      .where(
        and(
          and(
            eq(member.serverId, serverId),
            eq(member.profileId, params.profileId),
          ),
          not(eq(member.id, profile.id)),
        ),
      );

    const members = await db.query.members.findMany({
      where: eq(member.serverId, serverId),
      orderBy: [asc(member.role)],
    });

    const allProfiles = await db.query.profiles.findMany();

    const profiles = allProfiles.filter((profile) =>
      members.find((member) => member.profileId === profile.id),
    );

    return NextResponse.json({ members, profiles });
  } catch (error) {
    console.error("Error in PATCH /api/members/[profileId]/route.ts: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { profileId: string } },
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.profileId) {
      return new NextResponse("Profile ID missing", { status: 400 });
    }

    const kickMember = await db
      .delete(member)
      .where(
        and(
          and(
            eq(member.serverId, serverId),
            eq(member.profileId, params.profileId),
          ),
          not(eq(member.id, profile.id)),
        ),
      );

    const members = await db.query.members.findMany({
      where: eq(member.serverId, serverId),
      orderBy: [asc(member.role)],
    });

    const allProfiles = await db.query.profiles.findMany();

    const profiles = allProfiles.filter((profile) =>
      members.find((member) => member.profileId === profile.id),
    );

    return NextResponse.json({ members, profiles });
  } catch (error) {
    console.error("Error in DELETE /api/members/[profileId]/route.ts: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
