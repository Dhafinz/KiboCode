import { Suspense } from "react";
import { notFound } from "next/navigation";
import ChallengeClient from "./ChallengeClient";
import { CHALLENGES } from "@/data/challenges";

export function generateStaticParams() {
  return Object.keys(CHALLENGES).map((id) => ({
    challengeId: id,
  }));
}

interface PageProps {
  params: Promise<{ challengeId: string }>;
}

export default async function ChallengePage({ params }: PageProps) {
  const { challengeId } = await params;

  if (!CHALLENGES[challengeId]) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--cyan-core)",
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          Memuat Misi KiboCode... ⏳
        </div>
      }
    >
      <ChallengeClient challengeId={challengeId} />
    </Suspense>
  );
}
