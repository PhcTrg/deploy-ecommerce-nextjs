"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Input,
  Button,
  Divider,
} from "@nextui-org/react";
import authAPIs from "@/api/auth";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [user, setUser] = useState<IResGetUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isLoggedIn = localStorage.getItem("token") != null ? true : false;

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const userData = await authAPIs.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.log("Error fetching user data:", error);
      //   router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex gap-5 p-6">
          <Avatar
            name={`${user.first_name[0]}${user.last_name[0]}`}
            size="lg"
            className="bg-primary-200 text-white"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">{`${user.first_name} ${user.last_name}`}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={user.first_name}
              readOnly
              variant="bordered"
            />
            <Input
              label="Last Name"
              value={user.last_name}
              readOnly
              variant="bordered"
            />
            <Input
              label="Email"
              value={user.email}
              readOnly
              variant="bordered"
            />
            <Input
              label="Phone Number"
              value={user.phone_number}
              readOnly
              variant="bordered"
            />
            <Input
              label="Address"
              value={user.address}
              readOnly
              variant="bordered"
            />
            <Input label="Role" value={user.role} readOnly variant="bordered" />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              color="primary"
              className="bg-lama"
              onClick={() => handleEditProfile()}
            >
              Edit Profile
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;
