import MessagesClient from "@/component/items/MessagesClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export default function MessagesPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center mt-20">Loading...</div>}
    >
      <MessagesClient />
    </Suspense>
  );
}
