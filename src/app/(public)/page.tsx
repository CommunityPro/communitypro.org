import { MembersSpotlightSection } from "@/features/members";
import { getHomeData } from "@/features/github/server";
import {
  Community,
  Cta,
  GlobeSection,
  Hero,
  HowItWorks,
  PageviewTracker,
  Statement,
  StatsStrip,
} from "@/features/home";

export const revalidate = 3600;

export default async function Page() {
  const data = await getHomeData();

  return (
    <div className="w-full overflow-x-clip">
      <PageviewTracker />
      <section className="flex min-h-screen w-full items-center pt-40 pb-24 sm:pt-48">
        <div className="mx-auto w-full max-w-5xl px-4">
          <Hero faces={data.wall.slice(0, 6)} featured={data.featured} stats={data.stats} />
        </div>
      </section>
      <section className="w-full py-28 sm:py-40">
        <div className="mx-auto max-w-6xl px-4">
          <StatsStrip stats={data.stats} />
        </div>
      </section>
      <section className="bg-panel w-full py-40 sm:py-56">
        <Statement />
      </section>
      <section className="w-full py-28 sm:py-44">
        <div className="mx-auto max-w-7xl px-4">
          <GlobeSection hubs={data.hubs} />
        </div>
      </section>
      <section className="w-full py-28 sm:py-44">
        <div className="mx-auto max-w-7xl px-4">
          <HowItWorks practiceRepo={data.practiceRepo} />
        </div>
      </section>
      <section className="w-full py-28 sm:py-44">
        <div className="mx-auto max-w-7xl px-4">
          <Community contributors={data.contributors} wall={data.wall} />
        </div>
      </section>
      <section className="w-full py-28 sm:py-44">
        <div className="mx-auto max-w-7xl px-4">
          <MembersSpotlightSection />
        </div>
      </section>
      <Cta stats={data.stats} />
    </div>
  );
}
