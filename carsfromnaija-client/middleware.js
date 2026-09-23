export const config =
  {
    matcher:
      [
        /*
         * Match all requests except static assets (images, css, js, icons)
         * and internal Vercel routes.
         */
        "/((?!api|_vercel|.*\\..*).*)",
      ],
  };

const BOT_USER_AGENTS =
  [
    "googlebot",
    "bingbot",
    "yandexbot",
    "duckduckbot",
    "baiduspider",
    "facebookexternalhit",
    "twitterbot",
    "rogerbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "showyoubot",
    "outbrain",
    "pinterest/0.",
    "slackbot",
    "vkshare",
    "w3c_validator",
    "whatsapp",
  ];

export default async function middleware(
  request,
) {
  const userAgent =
    (
      request.headers.get(
        "user-agent",
      ) ||
      ""
    ).toLowerCase();
  const isBot =
    BOT_USER_AGENTS.some(
      (
        bot,
      ) =>
        userAgent.includes(
          bot,
        ),
    );

  // If request is from a search bot, route through Prerender.io
  if (
    isBot
  ) {
    const prerenderUrl = `https://service.prerender.io/${request.url}`;
    const prerenderHeaders =
      new Headers(
        request.headers,
      );

    // Inject your secret token from environment variables
    const token =
      process
        .env
        .PRERENDER_TOKEN;
    if (
      token
    ) {
      prerenderHeaders.set(
        "X-Prerender-Token",
        token,
      );
    }

    try {
      const prerenderResponse =
        await fetch(
          prerenderUrl,
          {
            headers:
              prerenderHeaders,
            redirect:
              "manual",
          },
        );

      return prerenderResponse;
    } catch (error) {
      // Fall back to standard app execution if Prerender service times out
      return;
    }
  }

  // Regular human users continue to your standard React SPA
  return;
}
