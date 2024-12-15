"use client";
import { Input } from "@nextui-org/react";
import { MODE } from "../../types";
import { useState } from "react";

interface IRegisterPage {
  setMode: (val: MODE) => void;
}

interface IRegisterForm {
  username: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface IFormField {
  type: string;
  name: keyof IRegisterForm;
  label: string;
  placeholder: string;
}

const formFields: IFormField[] = [
  {
    type: "text",
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
  },
  {
    type: "text",
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
  },
  {
    type: "tel",
    name: "phoneNumber",
    label: "Phone Number",
    placeholder: "Enter your phone number",
  },
  {
    type: "email",
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    type: "text",
    name: "address",
    label: "Address",
    placeholder: "Enter your address",
  },
];

const RegisterFormComponent: React.FC<IRegisterPage> = ({ setMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState<IRegisterForm>({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<IRegisterForm>>({});

  const validateField = (field: keyof IRegisterForm, value: string) => {
    let error = "";
    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Invalid email address";
    }

    if (field === "phoneNumber" && value) {
      const phoneRegex = /^[0-9]{10,15}$/; // Adjust regex for your phone number format
      if (!phoneRegex.test(value)) error = "Invalid phone number";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const handleInputChange = (field: keyof IRegisterForm, value: string) => {
    setRegisterForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
    validateField(field, value);
  };

  const handleSignUp = () => {};

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {formFields.map((field) => (
            <div key={field.name} className="mb-4">
              <Input
                type={field.type}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                labelPlacement="outside"
                className="font-bold"
                isClearable
                onClear={() => handleInputChange(field.name, "")}
                value={registerForm[field.name] as string}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
          disabled={isLoading}
          onClick={handleSignUp}
        >
          {isLoading ? "Loading..." : "Register"}
        </button>

        <div className="text-sm">
          Already have an account?{" "}
          <span
            className="underline font-bold cursor-pointer"
            onClick={() => setMode(MODE.LOGIN)}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterFormComponent;
