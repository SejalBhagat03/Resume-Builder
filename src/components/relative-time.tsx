import { useEffect, useState } from "react";
import { formatRelative } from "@/lib/resume-store";

export function RelativeTime({ ts }: { ts: number }) {
  const [text, setText] = useState<string>("");
  useEffect(() => {
    setText(formatRelative(ts));
    const i = setInterval(() => setText(formatRelative(ts)), 30000);
    return () => clearInterval(i);
  }, [ts]);
  return <span suppressHydrationWarning>{text}</span>;
}
