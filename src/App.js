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


function Button({children,onClick}){
  return <button className="button" onClick={onClick}>{children}</button>
}

// ------------------------------------------------------------------------------------------------------



export default function App(){

  const [showAddFriend,setShowAddFriend]=useState(false)
  const [friends,setFreinds]=useState(initialFriends)
  const [selectedFriend,setSelectedFriend]=useState(null)




  function handleShowAddFriend(){
    setShowAddFriend((show)=> !show)
  }

  function handleAddFriend(friend){
    setFreinds((friends)=> [...friends,friend])
    setShowAddFriend(false)
  }
  function handleSelection(friend){
    setSelectedFriend((cur)=>(cur?.id === friend.id ? null:friend))

    setShowAddFriend(false)
  } 
  function handleSplitBill(value){
    // console.log(value)
    setFreinds(friends => friends.map(friend => friend.id === selectedFriend.id ? {...friend,balance:friend.balance + value} : friend))

    setSelectedFriend(null)
  }





  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} selectedFriend={selectedFriend} onSelection={handleSelection}/>

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend}/>}

        <Button onClick={handleShowAddFriend}>{showAddFriend ? "Close" : "Add friend"}</Button>
      </div>


      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill}/>}
    </div>
  )
}



// -------------------------------------------------------------------------------------------------------------------




function FriendList({friends,onSelection,selectedFriend}){


  return (
    <ul>
      {friends.map((friend)=>(
        <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}/>
      ))}
    </ul>
  )
}






// ----------------------------------------------------------------------------------------------------------------------------

function Friend({friend, onSelection,selectedFriend}){

  const isSelected=selectedFriend?.id === friend.id
  console.log(selectedFriend)
  console.log(isSelected)

  return <li className={isSelected ? "selected" : ""}>
    <img src={friend.image} alt={friend.name}/>
    <h3>{friend.name}</h3>


    {friend.balance <0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}</p>}

    {friend.balance >0 && <p className="green">{friend.name} owes you {Math.abs(friend.balance)}</p>}

    {friend.balance ===0 && <p className="green">you and {friend.name} are even</p>}

    <Button onClick={()=> onSelection(friend)}>{isSelected ? "Close" :"Select"}</Button>
  </li>
}


// ----------------------------------------------------------------------------------------------------------------------------------




function FormAddFriend({onAddFriend}){
  const [name,setName]= useState("")
  const [image,setImage]=useState("https://i.pravatar.cc/48")


  function handleSubmit(e){
    e.preventDefault()

    if (!name || !image) return;




    const id=crypto.randomUUID()

    const newFriend={
      id,
      name,
      image:`${image}?=${id}`,
      balance:0,
    }

    console.log(newFriend)

    onAddFriend(newFriend)

    setName('')
    setImage("https://i.pravatar.cc/48")
  }






  return (
  <form className="form-add-friend" onSubmit={handleSubmit}>
    <label>Friend Name</label>
    <input type="text" value={name} onChange={(e)=> setName(e.target.value)}/>

    <lbel>Image Url</lbel>
    <input type="text" value={image} onChange={(e)=>setImage(e.target.value)}/>

    <Button>Add</Button>
  </form>
  )
}
 

// ---------------------------------------------------------------------------------------------------------------

function FormSplitBill({selectedFriend,onSplitBill}){
  const [bill,setBill]=useState("")
  const [paidUser,setPaidUser]=useState("")
  const [whoIsplaying,setWhoIsPlaying]=useState("user")

  const paidByFriend=bill? bill - paidUser : ""


  function handleSubmit(e){
    e.preventDefault()

    if (!bill || !paidUser) return 

    onSplitBill(whoIsplaying === 'user' ? paidByFriend : -paidUser)

  }



  return <form className="form-split-bill" onSubmit={handleSubmit}>
    <h2>Split a Bill with {selectedFriend.name}</h2>

    <label>💵 Bill value</label>
    <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

    <label>🤯 Your Expenses</label>
    <input type="text" value={paidUser} onChange={(e)=>setPaidUser(Number(e.target.value) > bill ? paidUser : Number(e.target.value))}/>


    <label>🤱 {selectedFriend.name}'s Expenses</label>
    <input type="text" disabled value={paidByFriend}/>


    <label>Who is paying the Bill?</label>
    <select value={whoIsplaying} onChange={(e)=>setWhoIsPlaying(e.target.value)}>
      <option value='user'>You</option>
      <option value='friend'>{selectedFriend.name}</option>
    </select>

    <Button>Split the Bill</Button>
  </form>
}












