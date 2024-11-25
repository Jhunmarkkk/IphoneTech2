import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { accountFormControls } from "@/config"; // Ensure this is correctly imported
import { useDispatch, useSelector } from "react-redux";
import { updateAccountInfo } from "@/store/shop/account-slice"; // Ensure this is correctly imported
import { useToast } from "../ui/use-toast";

const initialAccountFormData = {
  userName: "", // Change this to userName
  email: "",
};

function Account() {
  const [formData, setFormData] = useState(initialAccountFormData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "", // Change this to userName
        email: user.email || "",
      });
    }
  }, [user]);

  function handleUpdateAccount(event) {
    event.preventDefault();
    dispatch(updateAccountInfo(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Account updated successfully",
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key]?.trim() !== "") // Use optional chaining
      .every((item) => item);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <CommonForm
          formControls={accountFormControls} // Ensure this is updated accordingly
          formData={formData}
          setFormData={setFormData}
          buttonText="Update"
          onSubmit={handleUpdateAccount}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Account;