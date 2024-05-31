import Image from "next/image";

import connectToDB from "@/utils/db";

export default function Home() {

  connectToDB();

  return (
    <main>
      <h1>Cartable</h1>
    </main>
  );
}
