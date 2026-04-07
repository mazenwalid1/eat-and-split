import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleFriendSelection(friend) {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend,
    );
    setShowAddFriend(false);
  }
  function handleSubmitbill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend,
      ),
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleFriendSelection={handleFriendSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend friends={friends} handleAddFriend={handleAddFriend} />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSubmitbill={handleSubmitbill}
        />
      )}
    </div>
  );
}
function FriendList({ friends, handleFriendSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleFriendSelection={handleFriendSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, handleFriendSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => handleFriendSelection(friend)}>
        {" "}
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handelSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const newfriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID,
    };
    setName("");
    setImage("https://i.pravatar.cc/48");
    handleAddFriend(newfriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, handleSubmitbill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const paidByFriend = bill - paidByUser;
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    handleSubmitbill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT BILL WITH {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value))}
      ></input>
      <label>{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>
      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) =>
          setWhoIsPaying(e.target.value > bill ? paidByUser : e.target.value)
        }
      >
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
