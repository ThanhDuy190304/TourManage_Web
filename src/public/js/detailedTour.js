const userElement = document.getElementById('user-info');
const user = JSON.parse(userElement.getAttribute('data-user'));

document.addEventListener("DOMContentLoaded", () => {
    // Function to add product ID to cart in localStorage
      const addToCart = async (productId) => {
        // Check if 'cart' exists in localStorage
        if(!user){
          let cart = localStorage.getItem("cart");

          if (cart) {
            // Parse the cart để lấy dưới dạng mảng
            cart = JSON.parse(cart);
          } else {
            // Nếu chưa có giỏ hàng, khởi tạo mảng rỗng
            cart = [];
          }
          try {
            response = await fetch(`/tours/getTourbyID/${productId}`); // Đường dẫn API để lấy sản phẩm
            if (!response.ok) throw new Error("Failed to fetch product data");
            tourInf = await response.json(); // Trả về dữ liệu sản phẩm
          } catch (error) {
            console.error(`Khong lay duoc thong tin product`, error);
            return null;
          }
          // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
          const existingProduct = cart.find(item => item.tour_id === productId);

          if (!existingProduct) {
            // Nếu chưa tồn tại, thêm sản phẩm mới với giá trị mặc định
            cart.push({
              tour_id: productId,
              price: tourInf[0].prices, // Thay tourPrice bằng giá của sản phẩm (cần có từ trước)
              quantity: 1
            });
      
            // Save the updated cart back to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
          
            // Notify user
            alert(`Product ID ${productId} has been added to your cart.`);
          } else {
            alert(`Product ID ${productId} is already in your cart.`);
          }
        }else{
          let response
          let cartID, nextCIID, tourInf
          try {
            response = await fetch(`/cart/getNextCIID`); // Đường dẫn API để lấy sản phẩm
            if (!response.ok) throw new Error("Failed to fetch product data");
            nextCIID = await response.json(); // Trả về dữ liệu sản phẩm
          } catch (error) {
            console.error(`Khong lay dc next CI ID`, error);
            return null;
          }

          try {
            response = await fetch(`/cart/getCartByUserid/${user.user_id}`); // Đường dẫn API để lấy sản phẩm
            if (!response.ok) throw new Error("Failed to fetch product data");
            cartID = await response.json(); // Trả về dữ liệu sản phẩm
          } catch (error) {
            console.error(`Khong lay duoc Cart`, error);
            return null;
          }

          try {
            response = await fetch(`/tours/getTourbyID/${productId}`); // Đường dẫn API để lấy sản phẩm
            if (!response.ok) throw new Error("Failed to fetch product data");
            tourInf = await response.json(); // Trả về dữ liệu sản phẩm
          } catch (error) {
            console.error(`Khong lay duoc thong tin product`, error);
            return null;
          }
          try {
            response = await fetch('/cart/addCartItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nextCIID: nextCIID[0].next_cart_item_id,  // Mã chi nhánh
                    CartID: cartID[0].cart_id,
                    TourID: productId,
                    quantity: 1,
                    price: tourInf[0].prices,
                }),
            });
    
            if (response.ok) {
                console.log('Order submitted successfully!');
                // Xử lý phản hồi từ server nếu cần
            } else {
                console.error('Error submitting order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        }
      }

    
  
    // Attach event listeners to all "Add to Cart" buttons
    const addCartButtons = document.querySelectorAll(".addCart");
    addCartButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        const productId = button.value;
        addToCart(productId);
      });
    });
});