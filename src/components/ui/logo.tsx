import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">B</div>
      <span>BharatSetu AI</span>
    </Link>
  );
}
