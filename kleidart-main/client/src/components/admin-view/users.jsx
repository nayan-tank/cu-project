import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminUserDetailsView from "./users-details";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  getAllUsersForAdmin,
  getUserDetailsForAdmin,
  updateUserDetailsForAdmin,
  deleteUserDetailsForAdmin, // Import the delete action
} from "../../store/admin/users-slice";
import { useToast } from "../ui/use-toast";

function AdminUsersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [editedUserDetails, setEditedUserDetails] = useState(null); // State to hold edited user details
  const { toast } = useToast();

  const { userList, userDetails } = useSelector((state) => state.adminUser);
  const dispatch = useDispatch();

  // function editUser(userId) {
  //   dispatch(getUserDetailsForAdmin({ id: userId }));
  // }

  function handleDeleteUser(userId) {
    setUserToDelete(userId);
    setConfirmDeleteDialog(true);
  }

  function confirmDelete() {
    if (userToDelete) {
      dispatch(deleteUserDetailsForAdmin({ id: userToDelete }))
        .unwrap()
        .then(() => {
          toast({
            title: "User deleted successfully!",
          });
        })
        .catch((error) => {
          toast({
            title: "Failed to delete user.",
            variant: "destructive",
          });
        });
      setUserToDelete(null);
      setConfirmDeleteDialog(false);
    }
  }

  function handleEditUser(userId) {
    // Trigger the form to open and fill in the details
    const user = userList.find((user) => user._id === userId);
    if (user) {
      setEditedUserDetails(user); // Set user details in state
      setEditUserDialog(true); // Open the edit dialog
    }
  }

  function handleUpdateUser() {
    if (editedUserDetails) {
      const { _id, userName, email, phone, role } = editedUserDetails;

      dispatch(
        updateUserDetailsForAdmin({
          id: _id,
          userDetails: { userName, email, phone, role }, // Pass the user details properly
        })
      )
        .unwrap()
        .then(() => {
          toast({
            title: "User updated successfully!",
          });
          setEditUserDialog(false); // Close the dialog after update
        })
        .catch((error) => {
          toast({
            title: "Failed to update user.",
            variant: "destructive",
          });
        });
    }
  }

  function handleChange(e) {
    setEditedUserDetails({
      ...editedUserDetails,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    dispatch(getAllUsersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (userDetails !== null) setOpenDetailsDialog(true);
  }, [userDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList && userList.length > 0
              ? userList.map((user, index) => (
                  <TableRow key={user._id || index}>
                    <TableCell>{user?._id}</TableCell>
                    <TableCell>{user?.userName}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>{user?.phone}</TableCell>
                    <TableCell>{user?.role}</TableCell>
                    <TableCell>
                      <Pencil onClick={() => handleEditUser(user?._id)} />
                    </TableCell>
                    <TableCell>
                      <Trash2 onClick={() => handleDeleteUser(user?._id)} />
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onOpenChange={setEditUserDialog}>
        <DialogContent className="p-6 bg-white rounded-lg shadow-lg lg:w-full md:w-full w-[90%] max-w-md ">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Edit User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* User Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name:
              </label>
              <input
                type="text"
                name="userName"
                value={editedUserDetails?.userName || ""}
                onChange={handleChange}
                className="input p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={editedUserDetails?.email || ""}
                onChange={handleChange}
                className="input p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone:
              </label>
              <input
                type="text"
                name="phone"
                value={editedUserDetails?.phone || ""}
                onChange={handleChange}
                className="input p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role:
              </label>
              <select
                name="role"
                value={editedUserDetails?.role || ""}
                onChange={handleChange}
                className="input p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Dialog Footer with Buttons */}
          <DialogFooter className="grid grid-cols-2 md:w-auto flex flex-row justify-end items-end lg:flex md:flex">
            <Button
              variant="outline"
              onClick={() => setEditUserDialog(false)} // Close dialog on cancel
              className="w-[100px] mr-2 md:mr-0 lg:mr-0"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUpdateUser} // Trigger update
              className="w-[100px]"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default AdminUsersView;
