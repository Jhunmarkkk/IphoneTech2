import { Formik, Form, Field, ErrorMessage } from 'formik';
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required.")
    .min(3, "Username must be at least 3 characters."),
  email: Yup.string()
    .required("Email is required.")
    .email("Email is not valid."),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function AuthRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <Formik
        initialValues={{
          userName: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (formData) => {
          const data = await dispatch(registerUser(formData));
          if (data?.payload?.success) {
            toast({
              title: data?.payload?.message,
            });
            navigate("/auth/login");
          } else {
            toast({
              title: data?.payload?.message,
              variant: "destructive",
            });
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            {registerFormControls.map((controlItem) => (
              <div className="grid w-full gap-1.5" key={controlItem.name}>
                <label className="mb-1">{controlItem.label}</label>
                <Field
                  name={controlItem.name}
                  placeholder={controlItem.placeholder}
                  type={controlItem.type}
                  className={`input ${errors[controlItem.name] && touched[controlItem.name] ? 'border-red-500' : ''}`}
                />
                <ErrorMessage name={controlItem.name} component="p" className="text-red-500 text-sm" />
              </div>
            ))}
            <button type="submit" className="mt-2 w-full">
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AuthRegister;
