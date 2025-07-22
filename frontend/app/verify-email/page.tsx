import dynamic from "next/dynamic";

const VerifyEmailClient = dynamic(() => import("./VerifyEmailClient"), { ssr: false });

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
} 