import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { auth, provider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";

function AuthLayout() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      dispatch(loginUser({
        email: user.email,
        userName: user.displayName,
        googleIdToken: idToken,
      }));

      toast({
        title: "Logged in successfully with Google!",
      });

      navigate("/shop/home/");
    } catch (error) {
      console.error("Login Error:", error);
      toast({
        title: "Error logging in with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex items-center justify-center bg-black w-1/2 px-12">
        <div className="max-w-md space-y-6 text-center text-primary-foreground">
          <style>
            {`@import url('https://fonts.googleapis.com/css2?family=Doto&display=swap');`}
            {`@import url('https://fonts.googleapis.com/css2?family=Dongle&display=swap');`}
          </style>
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span style={{ fontFamily: 'Doto, cursive' }}>IphoneTech</span><br />
            <span style={{ fontFamily: 'Dongle, static', fontSize: '2.5rem' }}>
              An Apple Product Management System
            </span>
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md space-y-6">
          {location.pathname === "/login" && (
            <button onClick={handleGoogleLogin} className="w-full bg-blue-500 text-white py-2 rounded">
              Sign in with Google
            </button>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
