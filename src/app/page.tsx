import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";
<Toaster/>
export default function Home() {
  redirect("/dashboard");
}
