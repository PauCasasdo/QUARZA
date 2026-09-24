import { MINERALS } from "@/data/minerals";
import DetailView from "./DetailView";

// Pre-render all 11 specimen pages for the static export (GitHub Pages).
export function generateStaticParams() {
  return MINERALS.map((m) => ({ id: m.id }));
}

export default function DetailPage({ params }: { params: { id: string } }) {
  return <DetailView id={params.id} />;
}
