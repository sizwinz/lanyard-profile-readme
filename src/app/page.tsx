"use client";

import React, { useState, useEffect, JSX } from "react";
import { motion } from "motion/react";
import { isSnowflake } from "@/utils/snowflake";
import { IParameterInfo, PARAMETER_INFO } from "@/utils/parameters";
import * as Icon from "lucide-react";
import { InfoTooltip } from "@/components/Popover";
import { cn, filterLetters } from "@/utils/helpers";

export default function Home() {
  const [originUrl, setOriginUrl] = useState("");

  useEffect(() => {
    setOriginUrl(window.location.origin);
  }, []);

  const ORIGIN_URL =
    originUrl ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://discord-rp-for-github.vercel.app");

  const [userId, setUserId] = useState("");
  const [userError, setUserError] = useState<string | JSX.Element>();

  const [isLoaded, setIsLoaded] = useState(false);
  const [options, setOptions] = useState<Record<string, string | boolean>>({});

  async function onLoadDiscordId(userId: string) {
    setUserId(userId);
    setIsLoaded(false);
    setUserError(undefined);

    if (userId.length < 1) return;
    if (userId.length > 0 && !isSnowflake(userId))
      return setUserError("Invalid Discord ID");
  }

  const url = `${ORIGIN_URL}/api/${userId}${
    Object.keys(options).length > 0
      ? `?${Object.keys(options)
          .map((option) => `${option}=${options[option]}`)
          .join("&")}`
      : ""
  }`;

  return (
    <>
      <main className="flex min-h-screen max-w-[100vw] flex-col items-center max-sm:px-4">
        <div className="relative mt-16 flex w-auto flex-row gap-8">
          <MainSection url={url} userId={userId} className="max-lg:hidden" />

          <div className="w-full sm:max-w-[30rem]">
            <p className="mb-2 text-left text-3xl font-semibold text-[var(--foreground)]">
              🏷️ lanyard-profile-readme{" "}
            </p>

            <p className="mb-2 text-sm text-[var(--muted)]">
              Uses{" "}
              <a
                href="https://github.com/Phineas/lanyard"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[var(--accent)] underline decoration-transparent underline-offset-2 transition-colors duration-150 ease-out hover:decoration-current"
              >
                Lanyard
              </a>{" "}
              to display your Discord Presence anywhere.
            </p>

            <div className="flex h-[2.25rem] w-full flex-row gap-2">
              <input
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--control-bg)] px-2.5 py-1.5 font-mono text-sm text-[var(--foreground)] transition-colors duration-150 ease-out placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                onChange={(e) => onLoadDiscordId(e.target.value)}
                value={userId || ""}
                placeholder="Enter your Discord ID"
              />
            </div>

            {!isLoaded ? (
              <motion.p
                variants={{
                  open: { opacity: 1, display: "block" },
                  closed: { opacity: 0, display: "none" },
                }}
                initial="closed"
                animate={userError ? "open" : "closed"}
                className="mt-1 text-sm text-red-500"
                transition={{ duration: 0.15 }}
              >
                {userError}
              </motion.p>
            ) : null}

            <MainSection
              url={url}
              userId={userId}
              className="block lg:hidden"
            />

            <div
              className={cn(
                "mb-4 mt-4 flex flex-col rounded-lg border border-[var(--border)] bg-[var(--canvas-subtle)] p-3 text-[var(--foreground)]"
              )}
            >
              <div className="grid-rows-auto mb-4 flex w-full flex-col gap-2.5 sm:grid sm:grid-cols-2">
                {PARAMETER_INFO.filter((item) => item.type !== "boolean").map(
                  (item) => {
                    return (
                      <div
                        key={item.parameter}
                        className="flex flex-col gap-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[var(--foreground)]">{item.title}</p>
                          <InfoTooltip
                            content={item.description || "Unknown"}
                          />
                        </div>

                        {item.type === "string" && (
                          <input
                            className="relative h-8 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--control-bg)] px-2 py-0.5 text-sm text-[var(--foreground)] outline-none transition-all duration-150 ease-out placeholder:text-[var(--muted)] focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={item.options?.placeholder || "..."}
                            onChange={(e) => {
                              if (e.target.value.length < 1) {
                                const prevOptions = { ...options };
                                delete prevOptions[item.parameter];
                                return setOptions(prevOptions);
                              }

                              const filteredValue = encodeURIComponent(
                                filterLetters(
                                  e.target.value,
                                  (
                                    PARAMETER_INFO.find(
                                      (p) => p.parameter === item.parameter
                                    ) as { options: { omit: string[] } }
                                  ).options.omit
                                )
                              );

                              setOptions((prev) => ({
                                ...prev,
                                [item.parameter]: filteredValue,
                              }));
                            }}
                            value={decodeURIComponent(
                              (options[item.parameter] as string) || ""
                            )}
                          />
                        )}

                        {item.type === "list" && (
                          <div className="relative">
                            <select
                              value={(options[item.parameter] as string) || ""}
                              onChange={(e) => {
                                if (e.target.value.length < 1) {
                                  const prevOptions = { ...options };
                                  delete prevOptions[item.parameter];
                                  return setOptions(prevOptions);
                                }

                                setOptions((prev) => ({
                                  ...prev,
                                  [item.parameter]: e.target.value,
                                }));
                              }}
                              className={cn(
                                "relative h-8 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--control-bg)] px-2 py-0.5 text-sm text-[var(--foreground)] outline-none transition-all duration-150 ease-out placeholder:text-[var(--muted)] focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
                                {
                                  "text-[var(--muted)]":
                                    !options[item.parameter] ||
                                    options[item.parameter] === "",
                                }
                              )}
                            >
                              <option value="" className="bg-[var(--control-bg)]">
                                None
                              </option>
                              {item.options.list.map((option) => (
                                <option
                                  value={option.value}
                                  key={option.value}
                                  className="bg-[var(--control-bg)]"
                                >
                                  {option.name}
                                </option>
                              ))}
                            </select>
                            <Icon.ChevronDown
                              size={14}
                              className="absolute right-2 top-0 my-auto flex h-full text-[var(--muted)]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* Separated for easier styling/readability */}
              <div className="sm:grid-rows-auto flex flex-col gap-2 sm:grid sm:grid-cols-2">
                {(
                  PARAMETER_INFO.filter(
                    (item) => item.type === "boolean"
                  ) as Extract<IParameterInfo[number], { type: "boolean" }>[]
                ).map((item) => {
                  return (
                    <div
                      key={item.parameter}
                      className="flex flex-row items-start gap-2.5 text-sm"
                    >
                      <input
                        type="checkbox"
                        className={cn(
                          "mt-0.5 max-h-4 min-h-4 min-w-4 max-w-4 cursor-pointer appearance-none before:overflow-clip before:rounded-[0.25rem] after:absolute after:h-4 after:w-4 after:rounded-[0.25rem] after:border after:border-[var(--border)] after:transition-all after:duration-150 after:ease-out",
                          {
                            "after:border-[var(--accent)] after:bg-[var(--accent-muted)]":
                              options[item.parameter] === !item.invertBoolean,
                            "after:bg-[var(--control-bg)] after:hover:bg-[var(--canvas-subtle)]":
                              options[item.parameter] !== !item.invertBoolean,
                          }
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setOptions((prev) => ({
                              ...prev,
                              [item.parameter]: item.invertBoolean
                                ? !e.target.checked
                                : e.target.checked,
                            }));
                          } else {
                            const prevOptions = { ...options };
                            delete prevOptions[item.parameter];
                            setOptions(prevOptions);
                          }
                        }}
                      />

                      <p
                        className="text-[var(--foreground)]"
                        style={{
                          textDecoration: PARAMETER_INFO.find(
                            (p) => p.parameter === item.parameter
                          )?.deprecated
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.title}
                      </p>

                      <InfoTooltip content={item.description || "Unknown"} />
                    </div>
                  );
                })}
              </div>

              <a
                href="https://github.com/cnrad/lanyard-profile-readme?tab=readme-ov-file#options"
                rel="noreferrer noopener"
                target="_blank"
                className="mt-4 flex w-full flex-row items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--control-bg)] py-1.5 text-sm text-[var(--muted)] transition-colors duration-150 ease-out hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                More info
                <Icon.ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const MainSection = ({
  url,
  userId,
  className,
}: {
  url: string;
  userId: string;
  className: string;
}) => {
  const [copyState, setCopyState] = useState("Copy");
  const [outputType, setOutputType] = useState<"markdown" | "html" | "url">(
    "markdown"
  );

  const copyContent = {
    markdown: (() => {
      const lightUrl = new URL(url);
      const darkUrl = new URL(url);
      lightUrl.searchParams.set("theme", "light");
      darkUrl.searchParams.set("theme", "dark");

      return `<a href="https://discord.com/users/${userId}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="${darkUrl.href}">
    <source media="(prefers-color-scheme: light)" srcset="${lightUrl.href}">
    <img src="${lightUrl.href}" alt="Discord Presence">
  </picture>
</a>`;
    })(),
    html: (() => {
      const lightUrl = new URL(url);
      const darkUrl = new URL(url);
      lightUrl.searchParams.set("theme", "light");
      darkUrl.searchParams.set("theme", "dark");

      return `<a href="https://discord.com/users/${userId}"><picture><source media="(prefers-color-scheme: dark)" srcset="${darkUrl.href}"><source media="(prefers-color-scheme: light)" srcset="${lightUrl.href}"><img src="${lightUrl.href}" alt="Discord Presence"></picture></a>`;
    })(),
    url: `${url}`,
  };

  return (
    <div
      className={cn(
        "mt-2 flex flex-col gap-2 w-full sm:min-w-[30rem] sm:max-w-[30rem]",
        className
      )}
    >
      {userId.length > 0 && isSnowflake(userId) ? (
        <img
          src={url}
          alt="Your Lanyard Banner"
          className="mx-auto"
          style={{ height: "auto", width: "100%", maxWidth: "410px" }}
        />
      ) : (
        <div className="flex min-h-64 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--canvas-subtle)] px-16 text-center font-mono text-sm text-[var(--muted)]">
          Enter your Discord ID to preview your Lanyard Banner
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-1">
        {(["markdown", "html", "url"] as const).map((type) => (
          <button
            key={type}
            className={cn(
              "cursor-pointer rounded-md border border-[var(--border)] px-1.5 py-1 font-mono text-sm font-medium uppercase tracking-wide text-[var(--muted)] transition-colors duration-100 ease-out",
              {
                "border-[var(--accent)] bg-[var(--accent-muted)] font-semibold text-[var(--accent)]":
                  outputType === type,
                "hover:border-[var(--accent)] hover:bg-[var(--canvas-subtle)]":
                  outputType !== type,
              }
            )}
            onClick={() => setOutputType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="my-2 break-all rounded-lg border border-[var(--border)] bg-[var(--canvas-subtle)] px-3 py-2 font-mono text-sm text-[var(--accent)]">
        {copyContent[outputType]}
      </div>

      <button
        className="w-full cursor-pointer rounded-md border border-[var(--border)] bg-[var(--canvas-subtle)] px-3 py-1 font-mono text-sm font-medium text-[var(--muted)] transition-colors duration-75 ease-out hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)]"
        onClick={() => {
          navigator.clipboard.writeText(copyContent[outputType]);
          setCopyState("Copied!");
          setTimeout(() => setCopyState("Copy"), 1500);
        }}
      >
        {copyState}
      </button>
    </div>
  );
};
