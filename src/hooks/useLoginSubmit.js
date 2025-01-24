import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios"

//internal import

import { notifyError, notifySuccess } from "@utils/toast";

const useLoginSubmit = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const redirectUrl = useSearchParams().get("redirectUrl");
  const registerUrl = process.env.NEXT_PUBLIC_REGISTER_URL // Production url
  const registerUrlDev = process.env.NEXT_PUBLIC_DEV_REGISTER_URL // Development url

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false, // Changed to false to handle redirection manually
        email,
        password,
      });

      if (result?.error) {
        notifyError(result?.error);
        console.error("Error during sign-in:", result.error);
      } else if (result?.ok) {
       // Save email in localStorage
        localStorage.setItem("email", email);

        // Redirecionar o usuário
        const url = "/checkout";
        // const url = redirectUrl ? redirectUrl : "/user/dashboard";
        router.push(url);
      }
    } catch (error) {
      console.log("Ocorreu um erro ao tentar fazer login", error);
    } finally {
      setLoading(false);
    }
  };


  const submitHandlerRegister = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      console.log("Usuário antes do registro: ", user);
      const result = await axios.post(registerUrlDev, user, {
        headers: {
          ContentType: 'application/json',
        }
      });
      if (result.status === 200) {
        notifySuccess(result.data.message);
        router.push("/user/dashboard");
        // Salvar email no localStorage
        localStorage.setItem("email", user.email);
      } else {
        notifyError(result.data.message);
      }
    } catch (error) {
      console.log("Erro ao tentar criar conta", error);
      notifyError("Houve um problema ao criar a conta.");
    } finally {
      setLoading(false)
    }
  };

  return {
    user,
    setUser,
    register,
    errors,
    loading,
    handleSubmit,
    submitHandler,
    showPass,
    setShowPass,
    submitHandlerRegister,
  };
};

export default useLoginSubmit;
