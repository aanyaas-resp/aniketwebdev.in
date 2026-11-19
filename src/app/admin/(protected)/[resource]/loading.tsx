import Loader from "@/components/ui/Loader";

export default function ResourceLoading() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center">
      <Loader label="Loading content" />
    </div>
  );
}
