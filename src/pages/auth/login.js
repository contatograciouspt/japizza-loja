import { FiLock, FiMail } from "react-icons/fi";

//internal  import
import Layout from "@layout/Layout";
import Error from "@components/form/Error";
import useLoginSubmit from "@hooks/useLoginSubmit";
import InputArea from "@components/form/InputArea";
import BottomNavigation from "@components/login/BottomNavigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const { user, handleSubmit, submitHandler, setUser, showPass, setShowPass, register, errors, loading } = useLoginSubmit();

  return (
    <Layout title="Login" description="Página de Login">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-4 flex flex-col lg:flex-row w-full">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
              <div className="overflow-hidden mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold font-serif">Login</h2>
                  <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
                    Entre com seu email e senha
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className="flex flex-col justify-center"
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div className="form-group">
                      <InputArea
                        register={register}
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        Icon={FiMail}
                        autocomplete="email"
                        value={user.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                      <Error errorName={errors.email} />
                    </div>
                    <div className="form-group">
                      <InputArea
                        register={register}
                        label="Password"
                        name="password"
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        Icon={FiLock}
                        autocomplete="current-password"
                        value={user.password || ""}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="text-gray-950 absolute inset-y-0 right-0 pr-14 top-12 flex items-center text-sm"
                        onClick={() => setShowPass(!showPass)}
                      >
                        {showPass ? (<AiFillEyeInvisible />) : (<AiFillEye />)}
                      </button>
                      <Error errorName={errors.password} />
                    </div>

                    {/* <div className="flex items-center justify-between">
                      <div className="flex ms-auto">
                        <Link
                          href="/auth/forget-password"
                          className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div> */}
                    {loading ? (
                      <button
                        disabled={loading}
                        type="submit"
                        className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-customRed text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-customRed h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                      >
                        <img
                          src="/loader/spinner.gif"
                          alt="Loading"
                          width={20}
                          height={10}
                        />
                        <span className="font-serif ml-2 font-light">
                          Processando
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={loading}
                        type="submit"
                        className="w-full text-center py-3 rounded bg-customRed text-white hover:bg-customRed transition-all focus:outline-none my-1"
                      >
                        Login
                      </button>
                    )}
                  </div>
                </form>
                <BottomNavigation
                  or={true}
                  route={"/auth/signup"}
                  pageName={"Sign Up"}
                  loginTitle="Login"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
