import { Input } from "@nextui-org/react";
import { useState } from "react";
import { MODE } from "../../types";
import authAPIs from "@/api/auth";
import { useRouter } from "next/navigation";

interface ILoginPage {
  setMode: (val: MODE) => void;
}

const LoginForm: React.FC<ILoginPage> = ({ setMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username != "" && password != "") {
      setIsLoading(true);
      setError("");

      try {
        const reqBody: IReqLogin = {
          username,
          password,
        };

        const res = await authAPIs.login(reqBody);

        if (res) {
          localStorage.setItem("token", res.token);
          router.push("/");
        }
      } catch (err: any) {
        console.log(err);
        setError("Invalid credentials.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please input all fields");
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-80">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email"
          labelPlacement="outside"
          className="font-bold"
          isClearable
          onClear={() => setUsername("")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          labelPlacement="outside"
          className="font-bold"
          isClearable
          onClear={() => setPassword("")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          className="text-sm underline cursor-pointer mb-4"
          onClick={() => setMode(MODE.SEND_EMAIL)}
        >
          Forgot Password?
        </div>

        {error && (
          <div className="text-red-600" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <button
          className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Login..." : "Login"}
        </button>

        <div
          className="text-sm underline cursor-pointer"
          onClick={() => setMode(MODE.REGISTER)}
        >
          {"Don't have an account?"}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
