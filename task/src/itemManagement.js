import React, { useState, useEffect } from "react";
import "./itemManagement.css";

function ItemManagement() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editItem, setEditItem] = useState({});
  const apiUrl = "http://localhost:5001/products"; // Replace with your API URL

  const fetchItems = async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    if (newItem) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newItem }),
        });

        if (response.ok) {
          const addedItem = await response.json();
          setItems([...items, addedItem]);
          setNewItem("");
        } else {
          console.error("Failed to add item");
        }
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item);
  };

  const handleSaveItem = async () => {
    if (editItem.name) {
      try {
        const response = await fetch(`${apiUrl}/${editItem._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editItem.name }),
        });
        if (response.ok) {
          fetchItems();
          setEditItem({});
        }
      } catch (error) {
        console.error("Error saving item:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditItem({});
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`${apiUrl}/${itemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="item-management-container">
      <h1>Item Management</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <div className="item-container">
              <div className="item">
                {editItem._id === item._id ? (
                  <div className="editing-item">
                    <input
                      type="text"
                      value={editItem.name}
                      onChange={(e) =>
                        setEditItem({ ...editItem, name: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <div>{item.name}</div>
                )}
              </div>
              <div className="button-container">
                {editItem._id === item._id ? (
                  <>
                    <button className="save-button" onClick={handleSaveItem}>
                      Save
                    </button>
                    <button
                      className="cancel-button"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-button"
                      onClick={() => handleEditItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <h2>Add a New Item</h2>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Item Name"
        />
        <button className="add-button" onClick={handleAddItem}>
          Add
        </button>
      </div>
    </div>
  );
}

export default ItemManagement;
