import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function VerifyEmail({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  if (!params.token) {
    return <p>Invalid token</p>;
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token: params.token },
  });

  if (!record || record.expiresAt < new Date()) {
    return <p>Token expired or invalid</p>;
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });

  await prisma.emailVerificationToken.delete({
    where: { id: record.id },
  });

  redirect("/login?verified=1");
}
