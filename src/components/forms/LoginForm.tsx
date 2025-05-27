import { useAuthStore } from "@/store/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "@/api/auth";
import { authRequest } from "@/api/auth";
import { useMutation } from "@tanstack/react-query"

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setToken = useAuthStore(state => state.setToken)
  const setProfile = useAuthStore(state => state.setProfile)

  
  // Asumiendo que tienes esta acción

  const loginMutation = useMutation<any, any, { email: string; password: string }>({
    mutationFn: loginRequest,
    onSuccess: async (data:any) => {
      const token = data.data.token;
      setToken(token);
      const isAuth = await authRequest();
      setProfile(isAuth);
          navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Error de servidor");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    loginMutation.mutate({ email, password }); // 
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center flex-col gap-4">
      <div>
        <label>Email:</label>
        <input
          className="rounded-md border-2 border-gray-300 p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          className="rounded-md border-2 border-gray-300 p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Iniciar sesión
      </button>
    </form>
  );
};

export default LoginForm;
