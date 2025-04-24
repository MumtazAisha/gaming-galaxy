document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".checkout-form form");
    const zone = document.getElementById("zone");
    const formError = document.getElementById("form-error");
    const bankDetails = document.getElementById("bank-details");
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const proceedBtn = document.getElementById("proceed-btn");
    const summarySection = document.getElementById("order-summary");

    // Show bank details if "Online payment" is selected
    paymentRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            bankDetails.style.display = (radio.value === "Online payment" && radio.checked) ? "block" : "none";
            // Update required fields based on selection
            document.getElementById("bank-name").required = radio.checked && radio.value === "Online payment";
            document.getElementById("card-num").required = radio.checked && radio.value === "Online payment";
            document.getElementById("expiry").required = radio.checked && radio.value === "Online payment";
            document.getElementById("cvv").required = radio.checked && radio.value === "Online payment";
        });
    });

    // Function to update the order summary table
    function showOrderSummary() {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
        console.log("Cart Items from localStorage:", cartItems);

        const cartItemsContainer = document.getElementById('cart-items-container');
        const deliveryChargeElement = document.getElementById('delivery-charge');
        const grandTotalElement = document.getElementById('grand-total');
        const deliveryDateElement = document.getElementById('delivery-date');
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        // Check if cart is empty
        if (Object.keys(cartItems).length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4">Your cart is empty</td>`;
            cartItemsContainer.appendChild(row);
            
            // Set default values
            deliveryChargeElement.textContent = 'Rs. 0';
            grandTotalElement.textContent = 'Rs. 0';
            deliveryDateElement.textContent = 'Estimated Delivery: Add items to cart';
            return;
        }
        
        // Add cart items to table
        let itemTotal = 0;
        for (const [itemName, itemData] of Object.entries(cartItems)) {
            const row = document.createElement('tr');
            const itemPrice = parseFloat(itemData.price) || 0;
            const itemQty = parseInt(itemData.qty) || 0;
            const itemSubtotal = itemPrice * itemQty;
            itemTotal += itemSubtotal;
            
            row.innerHTML = `
                <td>${itemName}</td>
                <td>${itemQty}</td>
                <td>Rs. ${itemPrice.toLocaleString()}</td>
                <td>Rs. ${itemSubtotal.toLocaleString()}</td>
            `;
            cartItemsContainer.appendChild(row);
        }
        
        // Calculate totals
        const selectedOption = zone.options[zone.selectedIndex];
        const deliveryCharge = parseInt(selectedOption?.dataset.charge) || 0;
        const grandTotal = itemTotal + deliveryCharge;
        
        // Update values
        deliveryChargeElement.textContent = `Rs. ${deliveryCharge.toLocaleString()}`;
        grandTotalElement.textContent = `Rs. ${grandTotal.toLocaleString()}`;
        
        // Calculate delivery date (4-7 days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 4) + 4);
        deliveryDateElement.textContent = `Estimated Delivery: ${deliveryDate.toDateString()}`;
    }

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        formError.textContent = "";
        formError.style.color = "red";

        // Validate form fields
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const zoneValue = zone.value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked');

        // Basic validation
        if (!name || !phone || !address || !zoneValue || zoneValue === "Select" || !paymentMethod) {
            formError.textContent = "Please fill in all required fields";
            return;
        }

        // Validate phone number (10 digits)
        if (!/^\d{10}$/.test(phone)) {
            formError.textContent = "Please enter a valid 10-digit phone number";
            return;
        }

        // Validate name (letters and spaces only)
        if (!/^[A-Za-z\s]+$/.test(name)) {
            formError.textContent = "Name should contain only letters and spaces";
            return;
        }

        // If online payment selected, validate those fields
        if (paymentMethod.value === "Online payment") {
            const bankName = document.getElementById("bank-name").value;
            const cardNum = document.getElementById("card-num").value;
            const expiry = document.getElementById("expiry").value;
            const cvv = document.getElementById("cvv").value;

            if (!bankName || !cardNum || !expiry || !cvv) {
                formError.textContent = "Please fill in all payment details";
                return;
            }

            // Validate bank name
            if (!/^[a-zA-Z\s]{3,50}$/.test(bankName)) {
                formError.textContent = "Please enter a valid bank name (letters only, 3-50 characters).";
                return;
            }

            // Validate card number (16 digits)
            if (!/^\d{16}$/.test(cardNum)) {
                formError.textContent = "Card number must be exactly 16 digits.";
                return;
            }

            // Validate expiry date (month input type returns YYYY-MM format)
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            if (!expiry) {
                formError.textContent = "Please enter expiry date";
                return;
            }

            const [expiryYear, expiryMonth] = expiry.split('-').map(Number);
            
            if (expiryYear < currentYear || 
                (expiryYear === currentYear && expiryMonth < currentMonth)) {
                formError.textContent = "Expiry date must be in the future.";
                return;
            }

            // Validate CVV (3 digits)
            if (!/^\d{3}$/.test(cvv)) {
                formError.textContent = "Please enter a valid 3-digit CVV";
                return;
            }
        }

        // If all validations pass, show order summary
        showOrderSummary();
        summarySection.style.display = "block";
        
        // Disable form after successful validation
        Array.from(form.elements).forEach(el => el.disabled = true);
        
        // Clear cart after successful order
        localStorage.removeItem("cartItems");
        
        // Show success message
        formError.style.color = "green";
        formError.textContent = "Order placed successfully!";
    });

    // Show order summary when page loads if there are items in cart
    showOrderSummary();
});