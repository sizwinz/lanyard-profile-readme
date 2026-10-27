import React from "react";
import type { ProfileCardProps } from "./ProfileCard";
import { Badges, UnknownIconDark, UnknownIconLight } from "@/utils/badges";
import { getFlags } from "@/utils/helpers";

const imageUri = (value: string) => `data:image/${value.startsWith('UklGR') ? 'webp' : value.startsWith('R0lG') ? 'gif' : value.startsWith('/9j/') ? 'jpeg' : 'png'};base64,${value}`;

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
  const activities = settings.hideActivity === true ? [] : data.activities.filter(a =>
    [0, 1, 3, 5].includes(a.type) && !settings.ignoreAppId?.includes(a.application_id ?? ""));
  const spotify = data.listening_to_spotify && !settings.hideSpotify ? data.spotify : undefined;
  const music = !data.listening_to_spotify ? data.activities.find(a =>
    a.type === 2 && !(a.name === "Apple Music" && settings.hideAppleMusic)) : undefined;
  const cards = activities.length + (spotify || music ? 1 : 0);
  const both = cards > 1;
  const hasContent = cards > 0;
  const height = hasContent ? 184 + Math.ceil(cards / 2) * 160 : 280;
  const boxWidth = both ? 328 : 680;
  const textLimit = both ? 26 : 68;
  const customStatus = !settings.hideStatus ? data.activities.find(a => a.type === 4) : undefined;
  const flags = settings.hideBadges ? [] : getFlags(data.discord_user.public_flags);
  if (!settings.hideBadges && data.discord_user.avatar?.startsWith('a_')) flags.push('Nitro');
  const title = settings.showDisplayName ? (data.discord_user.global_name || data.discord_user.username) : data.discord_user.username;
  const tag = shorten(data.discord_user.primary_guild?.tag, 14);
  const tagWidth = Math.min(160, 44 + tag.length * 8);
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
  const art = (base64: string | null | undefined, x: number, y: number, name = '</>') => base64 && base64 !== UnknownIconDark && base64 !== UnknownIconLight ?
    <image x={x} y={y} width="56" height="56" preserveAspectRatio="xMidYMid slice" href={imageUri(base64)} /> :
    <g><rect x={x} y={y} width="56" height="56" fill={panel} stroke={border} />
      {caption(x + 12, y + 35, name.slice(0, 2).toUpperCase(), 16, accent, true)}</g>;
  const box = (x: number, label: string, body: React.ReactNode, row = 0) => <g transform={`translate(0 ${row * 160})`}>
    <rect x={x} y="172" width={boxWidth} height="144" rx="2" fill={inset} stroke={border} />
    {caption(x + 16, 198, label, 11, accent, true)}
    {body}
  </g>;
  const progressOf = (timestamps: {start: number; end?: number} | undefined) => timestamps?.end ? Math.max(0, Math.min(1,
    (Date.now() - timestamps.start) / Math.max(1, timestamps.end - timestamps.start))) : 0;
  const musicTimestamps = spotify?.timestamps || music?.timestamps;
  const musicX = both && activities.length % 2 ? 384 : 32;
  return <svg xmlns="http://www.w3.org/2000/svg" width="744" height={height}
    viewBox={`0 0 744 ${height}`} data-layout="readme" role="img"
    fontFamily="DejaVu Sans,Arial,sans-serif">
    <title>DISCORD / RIGHT NOW</title>
    <desc>{title}: {status}. {activities.map(a => a.name).join(', ')} {spotify?.song || music?.details || ""}</desc>
    <defs><clipPath id="readme-avatar"><circle cx="64" cy="108" r="30" /></clipPath></defs>
    <path d={`M12 12H732V${height - 32}L712 ${height - 12}H12Z`} fill={panel} stroke={border} />
    {caption(32, 44, "DISCORD / RIGHT NOW", 15, accent, true)}
    <circle cx="624" cy="39" r="4" fill={statusColor} />
    {caption(638, 44, status === "dnd" ? "BUSY" : status.toUpperCase(), 11, muted, true)}
    <path d="M32 62H712M32 152H712" stroke={border} />
    {images.avatar ? <image x="34" y="78" width="60" height="60" clipPath="url(#readme-avatar)"
      href={imageUri(images.avatar)} /> : <circle cx="64" cy="108" r="30" fill={inset} stroke={border} />}
    {!settings.hideDecoration && images.avatarDecoration && <image data-role="avatar-decoration" x="24" y="68" width="80" height="80" href={imageUri(images.avatarDecoration)} />}
    <circle cx="88" cy="130" r="6" fill={statusColor} stroke={panel} strokeWidth="3" />
    {caption(112, 103, shorten(title, 28), 21, ink, true)}
    {caption(112, 126, "@" + shorten(data.discord_user.username, 54), 13)}
    {flags.slice(0, 8).map((flag, i) => <image key={flag} data-role="profile-badge" x={500 + i * 24} y="82" width="18" height="18" href={imageUri(Badges[flag as keyof typeof Badges])} />)}
    {!settings.hideTag && images.clanBadge && <g>
      <rect x={712 - tagWidth} y="108" width={tagWidth} height="28" rx="2" fill={inset} stroke={border} />
      <image data-role="server-tag" x={722 - tagWidth} y="114" width="16" height="16" href={imageUri(images.clanBadge)} />
      {caption(746 - tagWidth, 127, tag, 12)}</g>}
    {customStatus && <g>{images.userEmoji && <image x="112" y="131" width="14" height="14" href={imageUri(images.userEmoji)} />}
      {caption(images.userEmoji ? 133 : 112, 144, shorten((images.userEmoji ? '' : customStatus.emoji?.name ?? '') + ' ' + (customStatus.state ?? ''), 70), 11)}</g>}
    {activities.map((activity, i) => {
      const x = both && i % 2 ? 384 : 32;
      return <React.Fragment key={activity.id || i}>{box(x,
        ({0:'CURRENT ACTIVITY', 1:'STREAMING', 3:'WATCHING', 5:'COMPETING'} as Record<number, string>)[activity.type], <>
      {art(images.activityImages[i]?.largeImage, x + 16, 216, activity.name)}
      {images.activityImages[i]?.smallImage && <image x={x + 55} y="256" width="20" height="20" href={imageUri(images.activityImages[i].smallImage!)} />}
      {caption(x + 88, 230, shorten(activity.name, textLimit), 14, ink, true)}
      {caption(x + 88, 252, shorten(activity.details, textLimit), 12)}
      {caption(x + 88, 273, shorten(activity.state, textLimit), 12)}
      {!settings.hideTimestamp && activity.timestamps?.end && <>
        <rect x={x + 16} y="284" width={boxWidth - 32} height="3" fill={border} />
        <rect x={x + 16} y="284" width={(boxWidth - 32) * progressOf(activity.timestamps)} height="3" fill={accent} />
      </>}
      {!settings.hideTimestamp && activity.timestamps?.start && caption(x + 16, 301,
        `${Math.max(0, Math.floor((Date.now() - activity.timestamps.start) / 60000))} min · elapsed`, 10)}
    </>, Math.floor(i / 2))}</React.Fragment>;
    })}
    {(spotify || music) && box(musicX, spotify ? "ON REPEAT / SPOTIFY" : `LISTENING / ${shorten(music?.name, 24).toUpperCase()}`, <>
      {art(images.albumCover, musicX + 16, 216)}
      {caption(musicX + 88, 230, shorten(spotify?.song || music?.details, textLimit), 14, ink, true)}
      {caption(musicX + 88, 252, shorten(spotify?.artist || music?.state, textLimit), 12)}
      {caption(musicX + 88, 273, shorten(spotify?.album || music?.assets?.large_text, textLimit), 11)}
      {!settings.hideTimestamp && musicTimestamps?.end && <><rect x={musicX + 16} y="295" width={boxWidth - 32} height="3" fill={border} />
        <rect x={musicX + 16} y="295" width={(boxWidth - 32) * progressOf(musicTimestamps)} height="3" fill={accent} /></>}
    </>, Math.floor(activities.length / 2))}
    {!hasContent && <g><rect x="32" y="172" width="680" height="80" rx="2" fill={inset} stroke={border} />
      {idleLines.slice(0, 3).map((line, i) => <React.Fragment key={i}>{caption(48, 196 + i * 19, shorten(line, 82), 13)}</React.Fragment>)}
    </g>}
  </svg>;
}
