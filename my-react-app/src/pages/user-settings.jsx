import React, { useState } from "react";

function Usersetting() {
  const [name, setName] = useState("JoshA_380");
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(name);

  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");

  // picture upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "40px",
        gap: "40px",
        backgroundColor: "#fff",
        maxWidth: "800px",
        margin: "50px auto",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* picture  */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "#000",
            borderRadius: "0%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "bold",
            overflow: "hidden",
            cursor: "pointer",
            border: "2px solid #000",
          }}
        >
          {/* show picture */}
          {avatar ? (
            <img
              src={avatar}
              alt="picture"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            "picture"
          )}
        </div>
        {/* upload button */}
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            display: "flex",
            gap: "5px",
          }}
        >
          {/* upload */}
          <label
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "pointer",
              border: "none",
            }}
          >
            upload
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* name */}
      <div>
        {editing ? (
          <div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                padding: "8px",
                border: "2px solid #000",
                fontSize: "30px",
                marginBottom: "15px",
                width: "250px",
                backgroundColor: "#fff",
                color: "#000",
              }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                onClick={() => {
                  if (input.trim()) setName(input);
                  setEditing(false);
                }}
                style={{
                  padding: "10px 20px",
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "4px",
                  minWidth: "80px",
                }}
              >
                save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setInput(name);
                }}
                style={{
                  padding: "10px 20px",
                  background: "#fff",
                  color: "#000",
                  border: "2px solid #000",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "4px",
                  minWidth: "80px",
                }}
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span
              style={{ fontSize: "40px", fontWeight: "bold", color: "#000" }}
            >
              {name}
            </span>
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "8px 16px",
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "4px",
              }}
            >
              change name
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Usersetting;

//To do:
//Add a page that displays the users name and profile picture can use a default one for now 
//Add it so the user can change the about me seciton 
//Add it so the user can select a profile picture 
//Display how long the account has been made
//After Speak to Krisha about how the database works and try make it so it works with the logged in user
