import React from "react";
import type { ProfileCardProps } from "./ProfileCard";

const shorten = (value: string | undefined, length: number) => {
  const clean = (value ?? "").replace(/[\x00-\x1f]/g, " ");
  return clean.length > length ? clean.slice(0, length - 1) + "…" : clean;
};

/** Opt-in native SVG renderer matching the connected README cards. */
export function ReadmeCard({ data, settings, images }: ProfileCardProps) {
  const light = settings.theme === "light";
  const panel = light ? "#f3f2ef" : "#191c1e";
  const inset = light ? "#ecece9" : "#101213";
  const ink = light ? "#242b31" : "#e8e3d9";
  const muted = light ? "#55616a" : "#bfc4c9";
  const border = light ? "#b9c0c1" : "#353a3d";
  const accent = light ? "#c34f1b" : "#df6124";
  const status = ["online", "idle", "dnd", "offline"].includes(data.discord_status) ? data.discord_status : "offline";
  const statusColor = { online: "#43b581", idle: "#faa61a", dnd: "#f04747", offline: "#747f8d" }[status];
  const activity = settings.hideActivity === true ? undefined : data.activities.find(a =>
    a.type === 0 && !settings.ignoreAppId?.includes(a.application_id ?? ""));
  const spotify = data.listening_to_spotify && !settings.hideSpotify ? data.spotify : undefined;
  const music = !data.listening_to_spotify ? data.activities.find(a =>
    a.type === 2 && !(a.name === "Apple Music" && settings.hideAppleMusic)) : undefined;
  const both = !!(activity && (spotify || music));
  const hasContent = !!(activity || spotify || music);
  const height = hasContent ? 344 : 280;
  const boxWidth = both ? 328 : 680;
  const textLimit = both ? 26 : 68;
  const title = settings.showDisplayName ? (data.discord_user.global_name || data.discord_user.username) : data.discord_user.username;
  const idle = settings.idleMessage ?? "Away from the keyboard. Back to building soon.";
  const idleWords = idle.split(/\s+/);
  const idleLines: string[] = [""];
  for (const word of idleWords) {
    const last = idleLines.length - 1;
    if ((idleLines[last] + " " + word).length > 82) idleLines.push(word);
    else idleLines[last] += (idleLines[last] ? " " : "") + word;
  }
  const caption = (x: number, y: number, value: string, size = 13, color = muted, bold = false) =>
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={bold ? 700 : 400}>{value}</text>;
  const art = (base64: string | null | undefined, x: number, y: number) => base64 ?
    <image x={x} y={y} width="56" height="56" preserveAspectRatio="xMidYMid slice" href={`data:image/png;base64,${base64}`} /> :
    <g><rect x={x} y={y} width="56" height="56" fill={panel} stroke={border} />
      {caption(x + 12, y + 35, "</>", 16, accent, true)}</g>;
  const box = (x: number, label: string, body: React.ReactNode) => <g>
    <rect x={x} y="172" width={boxWidth} height="144" rx="2" fill={inset} stroke={border} />
    {caption(x + 16, 198, label, 11, accent, true)}
    {body}
  </g>;
  const progress = spotify ? Math.max(0, Math.min(1,
    (Date.now() - spotify.timestamps.start) / Math.max(1, spotify.timestamps.end - spotify.timestamps.start))) : 0;
  const musicX = both ? 384 : 32;
  return <svg xmlns="http://www.w3.org/2000/svg" width="744" height={height}
    viewBox={`0 0 744 ${height}`} data-layout="readme" role="img"
    fontFamily="DejaVu Sans,Arial,sans-serif">
    <title>DISCORD / RIGHT NOW</title>
    <desc>{title}: {status}. {activity?.name || ""} {spotify?.song || music?.details || ""}</desc>
    <defs><clipPath id="readme-avatar"><circle cx="64" cy="108" r="30" /></clipPath></defs>
    <path d={`M12 12H732V${height - 32}L712 ${height - 12}H12Z`} fill={panel} stroke={border} />
    {caption(32, 44, "DISCORD / RIGHT NOW", 15, accent, true)}
    <circle cx="624" cy="39" r="4" fill={statusColor} />
    {caption(638, 44, status === "dnd" ? "BUSY" : status.toUpperCase(), 11, muted, true)}
    <path d="M32 62H712M32 152H712" stroke={border} />
    {images.avatar ? <image x="34" y="78" width="60" height="60" clipPath="url(#readme-avatar)"
      href={`data:image/png;base64,${images.avatar}`} /> : <circle cx="64" cy="108" r="30" fill={inset} stroke={border} />}
    <circle cx="88" cy="130" r="6" fill={statusColor} stroke={panel} strokeWidth="3" />
    {caption(112, 103, shorten(title, 44), 21, ink, true)}
    {caption(112, 126, "@" + shorten(data.discord_user.username, 54), 13)}
    {activity && box(32, "IN THE WORKSHOP", <>
      {art(images.activityImages[0]?.largeImage, 48, 216)}
      {caption(120, 230, shorten(activity.name, textLimit), 14, ink, true)}
      {caption(120, 252, shorten(activity.details, textLimit), 12)}
      {caption(120, 273, shorten(activity.state, textLimit), 12)}
      {!settings.hideTimestamp && activity.timestamps?.start && caption(48, 301,
        `${Math.max(0, Math.floor((Date.now() - activity.timestamps.start) / 60000))} min · elapsed`, 10)}
    </>)}
    {(spotify || music) && box(musicX, spotify ? "ON REPEAT / SPOTIFY" : `LISTENING / ${shorten(music?.name, 24).toUpperCase()}`, <>
      {art(images.albumCover, musicX + 16, 216)}
      {caption(musicX + 88, 230, shorten(spotify?.song || music?.details, textLimit), 14, ink, true)}
      {caption(musicX + 88, 252, shorten(spotify?.artist || music?.state, textLimit), 12)}
      {caption(musicX + 88, 273, shorten(spotify?.album || music?.assets?.large_text, textLimit), 11)}
      {spotify && <><rect x={musicX + 16} y="295" width={boxWidth - 32} height="3" fill={border} />
        <rect x={musicX + 16} y="295" width={(boxWidth - 32) * progress} height="3" fill={accent} /></>}
    </>)}
    {!hasContent && <g><rect x="32" y="172" width="680" height="80" rx="2" fill={inset} stroke={border} />
      {idleLines.slice(0, 3).map((line, i) => <React.Fragment key={i}>{caption(48, 196 + i * 19, shorten(line, 82), 13)}</React.Fragment>)}
    </g>}
  </svg>;
}
