import type { Metadata } from "next";
import { DsLab } from "@/components/three/ds-lab-stage";

export const metadata: Metadata = { title: "3D Data Structure Lab", description: "Explore binary search trees and graphs in 3D, orbit, zoom, click nodes and run BFS.", alternates: { canonical: "/lab" } };

export default function LabPage() {
  return (
    <div className="container-cv py-10">
      <h1 className="mt-2 font-heading text-3xl font-bold md:text-4xl">Data Structure Lab</h1>
      <p className="mt-2 mb-6 max-w-2xl text-muted-foreground">Drag to orbit, scroll to zoom, click a node to inspect it. Insert keys into a BST or generate a random graph and watch BFS spread through it.</p>
      <DsLab />
    </div>
  );
}
