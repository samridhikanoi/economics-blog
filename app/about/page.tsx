import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Samridhi Kanoi, economics writer covering inflation, labor markets, trade, and global macroeconomics.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-ink">About</h1>
      <div className="mt-6 prose prose-neutral max-w-none">
        <p>
          Samridhi Kanoi is an economics writer focused on making sense of
          the macro forces shaping everyday life — inflation and interest
          rates, labor markets, trade policy, housing, energy, and the slow
          reordering of the global financial system.
        </p>
        <p>
          Her writing draws on public data, central bank communications, and
          mainstream economic research to explain not just what is happening
          in the global economy, but why it matters and what tends to get
          missed in the headline-driven news cycle. The goal of{" "}
          <em>The Economics Desk</em> is analytical clarity over hot takes:
          fewer predictions, more context.
        </p>
        <p>
          She writes about topics ranging from central bank policy and
          emerging market debt to housing affordability and the economics of
          the energy transition, aiming for pieces that hold up a few months
          after publication, not just on the day a headline breaks.
        </p>
        <p>
          Have a topic you&apos;d like to see covered, or spot something that
          needs a correction? Feedback is always welcome.
        </p>
      </div>
    </div>
  );
}
