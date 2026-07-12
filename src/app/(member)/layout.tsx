import { RequireActiveMember } from "@/features/auth";

export default function MemberLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RequireActiveMember>{children}</RequireActiveMember>;
}
