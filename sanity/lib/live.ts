import type { SanityClient } from "next-sanity";
import { client } from "./client";

let sanityFetch: any;
let SanityLive: any;

/* Only call defineLive on the server */
if (typeof window === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { defineLive } = require("next-sanity/live") as {
    defineLive: (opts: { client: SanityClient }) => { sanityFetch: any; SanityLive: any };
  };

  const live = defineLive({ client });
  sanityFetch = live.sanityFetch;
  SanityLive = live.SanityLive;
} else {
  /* Client-side no-op stubs to avoid runtime errors */
  sanityFetch = async (..._args: any[]) => {
    throw new Error("sanityFetch can only be used on the server. Use server-side fetching or pass data from a server component.");
  };
  SanityLive = () => null;
}

export { sanityFetch, SanityLive };