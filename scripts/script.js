// map products with id, name, price, and image
const products = [
  {
    id: 0,
    name: "Urban Grind Graphic Tee",
    price: 1200,
    image: "https://i.fbcd.co/products/resized/resized-750-500/preview-7-d255ef9c0a8d9efa5e785c36c2c9184dddc8811848f3fc833b3afa5fe5690fa8.jpg"
  },
  {
    id: 1,
    name: "Slantline Oversized Hoodie",
    price: 2800,
    image: "https://charlottefolk.co/cdn/shop/files/IMG-5898_2495d51d-cf18-4b47-9990-24aab9297746.png?v=1714409182"
  },
  {
    id: 2,
    name: "Nocturnal Fade Longsleeve",
    price: 1600,
    image: "https://www.wolvesofhades.com/cdn/shop/files/Dodsrit-NocturnalWillGLongsleeve_0ad4797d-78a9-4d8c-a38f-105d53c610ca.png?v=1706873391"
  },
  {
    id: 3,
    name: "Static Vibe Flannel Shirt",
    price: 2300,
    image: "https://m.media-amazon.com/images/I/61+nchSG-LL._UY1000_.jpg"
  },
  {
    id: 4,
    name: "Dropstep Cargo Joggers",
    price: 2000,
    image: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/462318/sub/goods_462318_sub14_3x4.jpg?width=494"
  },
  {
    id: 5,
    name: "Bleachwave Ripped Jeans",
    price: 2700,
    image: "https://img.kwcdn.com/product/fancy/af0c19c1-072c-45ef-870f-1099e2875d72.jpg"
  },
  {
    id: 6,
    name: "Monochrome Sweatpants",
    price: 1900,
    image: "https://skoop.com.ph/cdn/shop/files/skoop-ryuu-sweatpants-brown.jpg?v=1745826253"
  },
  {
    id: 7,
    name: "Blockcut Nylon Shorts",
    price: 1400,
    image: "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/443017/item/goods_09_443017_3x4.jpg?width=494"
  },
  {
    id: 8,
    name: "Stealth Runner Sneakers",
    price: 3800,
    image: "https://commonwealth-ftgg.ph/cdn/shop/files/norda001stealthblack.jpg?v=1715059675"
  },
  {
    id: 9,
    name: "Concrete Low Skate Shoes",
    price: 3200,
    image: "https://contents.mediadecathlon.com/p1822393/k$e340c49b3ec0ebc3ae8cbed5e91ed6dc/adult-low-top-skateboarding-longboarding-shoes-vulca-100-black-white-decathlon-8577224.jpg?f=1920x0&format=auto"
  },
  {
    id: 10,
    name: "Tactical Utility Vest",
    price: 2500,
    image: "https://blackout-techwear.co.uk/cdn/shop/products/techwear-utility-vest-back-view-uk.jpg?v=1726511299&width=1946"
  },
  {
    id: 11,
    name: "Citycore Windbreaker",
    price: 2900,
    image: "https://m.media-amazon.com/images/I/718WUHIIukL._AC_SL1500_.jpg"
  }
];

let cart = [];
let cartQty = 0;
const scriptURL = 'https://script.google.com/macros/s/AKfycbx7_waNWEWaNdgvsrPZwOvATs2Q7XbaUub6hS-rQmhuqatbHpAA5rkl58oTtVZlZMYo/exec';
const form = document.getElementById('shopForm');
let total = 0;

function postForm(e) {
  if (e) e.preventDefault();

  const cartDetails = cart.map(item =>
    `Product: ${item.name}, Size: ${item.size}, Qty: ${item.qty}, Price: Php ${item.price}`
  ).join('\n');
  const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'))
                      .map(cb => cb.value)
                      .join(', ');
  const feedback = document.querySelector('input[name="feedback"]:checked')?.value || "No feedback";
  const comments = document.getElementById("comments").value;
  const formattedTotal = `Php ${total.toFixed(2)} (incl. 12% VAT)`; 

  document.getElementById("cartData").value = cartDetails;
  document.getElementById("extrasData").value = extras;
  document.getElementById("feedbackData").value = feedback;
  document.getElementById("commentsData").value = comments;
  document.getElementById("totalData").value = formattedTotal;

  // submit the form via fetch
  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      alert("Form submitted successfully!");
      form.reset();
      cart = [];
      cartQty = 0;
      total = 0;
      updateCartTable();
      resetAll();
      hideCart();
    })
    .catch(error => alert('Error!', error.message));
  
}

function addToCart(id) {
  const quantityInput = document.getElementById(`qty-${id}`);
  const qty = parseInt(quantityInput.value);

  if (isNaN(qty) || qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  const size = document.getElementById(`size-${id}`).value;
  if (!size) {
    alert("Please select a size.");
    return;
  }

  cartQty += qty;
  const product = products[id];
  const existingItemIndex = cart.findIndex(item => item.id === id && item.size === size);

  if (existingItemIndex !== -1) {
    // if item with same size already in cart, increase quantity
    cart[existingItemIndex].qty += qty;
  } else {
    // new item or new size variant
    cart.push({
      id: product.id,
      name: product.name,
      size: size,
      price: product.price,
      image: product.image,
      qty: qty
    });
  }

  // SNACKBAR FUNCTION FROM W3SCHOOLS.COM (https://www.w3schools.com/howto/howto_js_snackbar.asp)
  const x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);

  // Reset inputs
  quantityInput.value = "";
  document.getElementById(`size-${id}`).value = "";
  document.getElementById("cart-count").innerText = `${cartQty}`;
}

function resetAll() {
  cart = [];
  cartQty = 0;
  document.getElementById("cart-count").innerText = `${cartQty}`;
  updateCartTable();
  hideCart();
}

function hideCart() {
  document.getElementById("home").style.display = "block";
  document.getElementById("cart").style.display = "none";
}

function showCart() {
  if (cartQty === 0 || cart.length === 0) {
    alert("No items in cart.");
    return;
  }

  document.getElementById("home").style.display = "none";
  // call update cart BEFORE loading cart
  updateCartTable();
  document.getElementById("cart").style.display = "block";
  document.getElementById("cart").scrollIntoView();
}

// updates the cart with items from cart array
function updateCartTable() {
  const table = document.getElementById("cart-table");

  table.innerHTML = `
    <tr>
      <th>Image</th>
      <th>Product Name</th>
      <th>Size</th>
      <th>Price</th>
      <th>Quantity</th>
    </tr>
  `;

  // looping to add each cart item as a row
  cart.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" style="object-fit: cover; border-radius: 8px;"></td>
      <td>${item.name}</td>
      <td>${item.size}</td>
      <td>Php ${item.price}</td>
      <td>${item.qty}</td>
    `;
    table.appendChild(row);
  });

  // checkbox row
  const checkboxRow = document.createElement("tr");
  checkboxRow.innerHTML = `
  <td colspan="5">
    <div class="table-checkbox-group">
      <label><input type="checkbox" name="extras" value="giftwrap"> Gift Wrap</label>
      <label><input type="checkbox" name="extras" value="priority"> Priority Processing</label>
      <label><input type="checkbox" name="extras" value="eco"> Eco Packaging</label>
    </div>
  </td>
  `;
  table.appendChild(checkboxRow);

  // row for total
  total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const VAT = total * 0.12;
  total += VAT;

  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td colspan="3"></td>
    <td colspan="3" style="text-align: right; font-weight: bold;">
      Total (12% VAT incl.): Php ${total}
    </td>
  `;
  table.appendChild(totalRow);

}


