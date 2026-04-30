import { Suspense } from "react";
import MessagesClient from "./MessagesClient";

export default function MessagesPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center mt-20">Loading...</div>}
    >
      <MessagesClient />
    </Suspense>
  );
}
