import { redirect } from "next/navigation";

// The icon browser now lives at the site root; keep old /icons links working.
export default function IconsRedirect() {
  redirect("/");
}
