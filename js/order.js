// Format number as price with LKR
function priceFormat(value) {
    return `${parseInt(value).toLocaleString()} LKR`;
  }
  
  // Update the cart summary table 
  function updateCart() {
      const cartBody = document.getElementById("cart-body");
      const totalPrice = document.getElementById("total-price");
      cartBody.innerHTML = ""; // Clear current rows
        
      // Get cart from localStorage
      const cart = JSON.parse(localStorage.getItem("cartItems")) || {};
    
      let total = 0;
    
      // Loop through items in the cart
      for (const itemName in cart) {
        const item = cart[itemName];
        const row = document.createElement("tr");
    
        // Item name
        const nameCell = document.createElement("td");
        nameCell.textContent = itemName;
    
        // Quantity
        const qtyCell = document.createElement("td");
        qtyCell.textContent = item.qty;
    
        // Total price for the item
        const priceCell = document.createElement("td");
        priceCell.textContent = priceFormat(item.qty * item.price);
    
        // Quantity adjustment controls
        const editCell = document.createElement("td");
        
        // Create a container div for the buttons
        const qtyAdjuster = document.createElement("div");
        qtyAdjuster.className = "qty-adjuster";
        
        // Decrease button
        const decreaseBtn = document.createElement("button");
        decreaseBtn.textContent = "-";
        decreaseBtn.className = "qty-btn";
        decreaseBtn.addEventListener("click", () => {
          const cart = JSON.parse(localStorage.getItem("cartItems")) || {};
          if (cart[itemName] && cart[itemName].qty > 1) {
            cart[itemName].qty--;
            localStorage.setItem("cartItems", JSON.stringify(cart));
            updateCart();
          } else if (cart[itemName]) {
            delete cart[itemName];
            localStorage.setItem("cartItems", JSON.stringify(cart));
            updateCart();
          }
        });
        
        // Quantity display
        const qtyDisplay = document.createElement("span");
        qtyDisplay.textContent = item.qty;
        qtyDisplay.className = "qty-display";
        
        // Increase button
        const increaseBtn = document.createElement("button");
        increaseBtn.textContent = "+";
        increaseBtn.className = "qty-btn";
        increaseBtn.addEventListener("click", () => {
          const cart = JSON.parse(localStorage.getItem("cartItems")) || {};
          if (cart[itemName]) {
            cart[itemName].qty++;
            localStorage.setItem("cartItems", JSON.stringify(cart));
            updateCart();
          }
        });
    
        qtyAdjuster.appendChild(decreaseBtn);
        qtyAdjuster.appendChild(qtyDisplay);
        qtyAdjuster.appendChild(increaseBtn);
        editCell.appendChild(qtyAdjuster);
    
        // Append all cells to row
        row.appendChild(nameCell);
        row.appendChild(qtyCell);
        row.appendChild(priceCell);
        row.appendChild(editCell);
    
        cartBody.appendChild(row); // Add row to table
        total += item.qty * item.price; // Update total price of cart
      }
    
      // Display total price
      totalPrice.textContent = priceFormat(total);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
      // Initialize cart from localStorage
      let cart = JSON.parse(localStorage.getItem("cartItems")) || {};
      updateCart();
    
      // ADD TO CART button handler
      document.querySelectorAll(".Add-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const itemContainer = btn.closest(".item");
    
          const name = itemContainer.querySelector("h4").textContent.trim();
          const price = parseInt(
            itemContainer.querySelector(".price").dataset.price.replace(/,/g, "")
          );
          const qtyInput = itemContainer.querySelector("input[type='number']");
          const qty = parseInt(qtyInput.value);
    
          if (qty > 0) {
            // Get current cart from localStorage
            cart = JSON.parse(localStorage.getItem("cartItems")) || {};
            
            if (cart[name]) {
              cart[name].qty += qty;
            } else {
              cart[name] = { qty, price };
            }
            
            // Save back to localStorage
            localStorage.setItem("cartItems", JSON.stringify(cart));
            updateCart();
            document.getElementById("msg").textContent = "";
          } else {
            document.getElementById("msg").textContent = "Please enter a valid quantity.";
          }
        });
      });
    
     
      // ADD TO FAVOURITE button
      document.getElementById("order-favs").addEventListener("click", () => {
          cart = JSON.parse(localStorage.getItem("cartItems")) || {};
          if (Object.keys(cart).length === 0) {
            alert("Your cart is empty. Please add items before saving as favourite.");
          } else {
            localStorage.setItem("favouriteOrder", JSON.stringify(cart));
            alert("Order saved as favourite!");
          }
      });
    
      // APPLY FAVOURITE button
      document.getElementById("apply-favs").addEventListener("click", () => {
        const fav = JSON.parse(localStorage.getItem("favouriteOrder"));
        if (fav) {
          cart = JSON.parse(localStorage.getItem("cartItems")) || {};
          
          for (const name in fav) {
            if (cart[name]) {
              cart[name].qty += fav[name].qty;
            } else {
              cart[name] = fav[name];
            }
          }
          
          localStorage.setItem("cartItems", JSON.stringify(cart));
          updateCart();
        } else {
          alert("No favourite order found.");
        }
      });
    
      // Buy Now button
      document.getElementById("checkout").addEventListener("click", () => {
          cart = JSON.parse(localStorage.getItem("cartItems")) || {};
          if (Object.keys(cart).length === 0) {
            alert("Your cart is empty. Please add items before checkout.");
          } else {
            window.location.href = "cart.html";
          }
      });
  });