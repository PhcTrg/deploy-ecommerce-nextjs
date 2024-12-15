import dynamic from "next/dynamic";

const LoginContent = dynamic(() => import("@/components/login-content"), {
  ssr: false,
});

export default function LoginPage() {
  return <LoginContent />;
}
