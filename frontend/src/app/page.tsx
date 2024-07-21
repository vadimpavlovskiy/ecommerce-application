import Image from "next/image";
import { Banner } from "./layouts/Banner";
import { Features } from "./layouts/Features";

export default function Home() {
  return (
    <main className="mx-[150px] max-lg:mx-[20px]">
      <Banner />
      <div className="mt-10">
        <Features />
      </div>
    </main>
  );
}
