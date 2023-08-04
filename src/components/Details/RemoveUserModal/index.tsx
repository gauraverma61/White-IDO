import Modal from "@molecules/Modal";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Button from "@atoms/Button";
import TextArea from "@atoms/TextArea";

interface Iprops {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setUsers: Function;
  handleSubmit: Function;
  users: string;
  loading?: boolean;
}

const RemoveUserModal = (props: Iprops) => {
  const { showModal, setShowModal, setUsers, handleSubmit, users, loading } =
    props;
  const [showUser, setShowUser] = useState<string[]>([]);

  useEffect(() => {
    if (users) {
      const userArr = users.split(/\r?\n/).map((item) => item);
      setShowUser(userArr);
    }
  }, [users]);

  const getUsersList = () => {
    return (
      showUser &&
      showUser.length > 0 &&
      showUser.map((item, index) => {
        return (
          <li key={index} className="flex items-center justify-between mb-5">
            {item}
            <Button
              className="px-5 lg:px-5 text-sm max-w-[100px] min-w-[100px]"
              onClick={() => deleteUser(item, index)}>
              Delete
            </Button>
          </li>
        );
      })
    );
  };

  const deleteUser = (item: string, count: number) => {
    showUser.splice(count, 1);
  };

  const removeUserWhitelist = () => {
    setUsers(showUser.join("\r\n"));
    handleSubmit();
  };

  return (
    <Modal
      isOpen={showModal}
      setIsOpen={setShowModal}
      className="mx-1 md:mx-2.5 p-6 px-5 sm:px-7 pt-5 w-full max-w-[600px] bg-black dark border border-primary-green ">
      <div className="">
        <div className="text-left">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 text-center">
            <span className="border-b border-[#000] text-primary-green">
              Delete Users from whitelist
            </span>
          </h3>
          <div className="mt-7">
            <p className="label font-bold text-base px-0">Users</p>
            <TextArea
              label=""
              placeholder="Insert Allocation: separate with breaks line. By format: address"
              className="textarea textarea-bordered h-40 text-white"
              textAreaHeight="h-40"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
            />
            {/*<ul className="max-h-[300px] overflow-y-auto">{getUsersList()}</ul>*/}
          </div>
        </div>

        <div className="flex justify-center w-full mt-5">
          <Button
            loading={loading}
            className="w-full sm:w-max"
            onClick={removeUserWhitelist}>
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveUserModal;
