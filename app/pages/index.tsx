import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push("/api/twitter/authenticate")}>
        post
      </button>
    </div>
  );
}
