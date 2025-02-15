import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatList } from "../../auth/getApi";
import FriendDetails from "./FriendDetails";
import { clearChatList } from "../../Redux/chattingSlice";
import SearchChat from "./SearchChat";
import useNewSender from "../../hooks/useNewSender";
import { Button, Drawer } from "antd";
import { LuUsers } from "react-icons/lu";

const fetchUsers = async () => {
  const response = await fetchChatList();
  if (!response) {
    throw new Error("Failed to fetch users");
  }
  return response.data;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const chatList = useSelector((state) => state.chatting.chatList);
  const dispatch = useDispatch();

  useNewSender();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers((prevUsers) => [...prevUsers, ...usersData]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (chatList.length > 0) {
      const newUser = chatList[0];
      setUsers((prevUsers) => [newUser, ...prevUsers]);
      dispatch(clearChatList());
    }
  }, [chatList, dispatch]);

  const showDrawer = useCallback(() => setVisible(true), []);
  const onClose = useCallback(() => setVisible(false), []);

  const uniqueUsers = useMemo(
    () =>
      users.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
      ),
    [users]
  );

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="col-span-2 bg-white h-[88vh] dark:bg-secondary-dark px-5 p-2 shadow-lg rounded-lg">
        Error: {error}
      </div>
    );

  return (
    <>
      <div className="col-span-2 hidden sm:block bg-white h-[88vh] dark:bg-secondary-dark px-2 p-2 shadow-lg rounded-lg">
        <SearchChat />
        <ul className="list-none px-0 flex flex-col gap-1 my-4">
          {uniqueUsers.map((user) => (
            <FriendDetails key={user._id} friend={user} />
          ))}
        </ul>
      </div>

      <div className="flex px-2 gap-1 sm:hidden items-center justify-center w-[390px] h-fit dark:bg-secondary-dark shadow-lg rounded-lg">
        <Button
          onClick={showDrawer}
          className="block h-full border-text-primary sm:hidden p-2"
        >
          <LuUsers className="text-xl" />
        </Button>
        <SearchChat />

        <Drawer
          title="Friends"
          placement="left"
          closable={false}
          onClose={onClose}
          visible={visible}
          width={300}
        >
          <ul className="list-none px-0 flex p-0 flex-col gap-1">
            {uniqueUsers.map((user) => (
              <FriendDetails key={user._id} friend={user} />
            ))}
          </ul>
        </Drawer>
      </div>
    </>
  );
};

export default React.memo(UserList);
