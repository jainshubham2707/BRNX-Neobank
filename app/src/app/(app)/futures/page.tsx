import { TopBar } from "@/components/ui/TopBar";
import { FuturesView } from "@/components/futures/FuturesView";

export default function FuturesPage() {
  return (
    <>
      <TopBar title="Futures" back />
      <div className="px-4">
        <FuturesView />
      </div>
    </>
  );
}
