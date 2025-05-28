import React, { useState } from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";

function AdminHeader({ setOpen }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for dialog visibility
  const dispatch = useDispatch();

  // Trigger the confirmation dialog
  const handleLogoutClick = () => {
    setIsConfirmOpen(true); // Open the confirmation dialog
  };

  // Handle user confirmation to log out
  const handleConfirm = () => {
    setIsConfirmOpen(false); // Close the dialog
    dispatch(logoutUser()); // Dispatch the logout action
  };

  // Handle cancel action for dialog
  const handleCancel = () => {
    setIsConfirmOpen(false); // Close the dialog without logging out
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block ">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogoutClick} // Trigger dialog on button click
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="w-[90%] max-w-md rounded-md">
          <DialogHeader>
            <DialogTitle
            className="text-left lg:mb-[-5px] mb-[-10px]"
            >Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to log out?
          </p>
          <DialogFooter className="grid grid-cols-2 md:w-auto flex flex-row justify-end items-end lg:flex md:flex">
            <Button
              variant="outline"
              className="w-[100px] mr-2 md:mr-0 lg:mr-0"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-[100px]"
              onClick={handleConfirm}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </header>
  );
}

export default AdminHeader;
