import Loader from "@/components/ui/Loader";

export default function Loading() {
  return (
    <div className="flex h-full min-h-[60dvh] items-center justify-center bg-[var(--background)]">
      <Loader label="Loading" />
    </div>
  );
}
