import { Button, Modal, Divider, List, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import UnFollowBtn from "../../../User/component/UnfollowBtn";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "../../../User/component/Avatar";
const ButtonElem = ({ item, list,  }) => {
  const {user} = useSelector(state => state.user)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(list);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // Simulate an API call to load more data
    setTimeout(() => {
      const newData = [...data, ...list]; // Simulate adding more items to the list
      setData(newData);
      setLoading(false);
    }, 1500);
  };
  useEffect(() => {
    setData(list);
  }, [list]);
  return (
    <>
      <Button
        onClick={showModal}
        className="bg-white px-2 text-xs font-Jakarta text-black p-1 rounded-md shadow-sm md:shadow-lg"
      >
        {item}
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div
          className="items-center justify-center w-full h-full p-4 bg-white rounded"
          id="scrollableDiv"
          style={{
            height: 300,
            overflow: "auto",
            padding: "0 16px",
            border: "1px solid rgba(140, 140, 140, 0.35)",
          }}
        >
          <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={data.length < 50} 
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={data}
              renderItem={(listItem) => (
                <List.Item key={listItem._id}>
                  <List.Item.Meta
                    avatar={<Avatar src={listItem.profilePicture} spell={listItem.userName.charAt(0).toUpperCase()} />}
                    title={<Link onClick={() => setIsModalOpen(false)} to={`/profile/${listItem._id}`} >{listItem.userName}</Link>}
                    description={listItem.email}
                  />
                  {user._id !== listItem._id && (
                    <UnFollowBtn id={listItem._id} />
                  )}
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </Modal>
    </>
  );
};

export default ButtonElem;
