from flask import Flask, request, jsonify
from flask_cors import CORS # <--- NEW IMPORT

from datastructures.carousel import ProductCarousel, setup_carousel_mock, create_test_cycle
from datastructures.cart_queue import ShoppingCart, CartAction, OrderProcessor
from datastructures.customer_db import CustomerDB

app = Flask(__name__)
CORS(app) 

carousel = ProductCarousel()
cart = ShoppingCart()
order_processor = OrderProcessor()
customer_db = CustomerDB()

def initialize_system():
    global carousel, cart, order_processor, customer_db
    
    carousel = setup_carousel_mock(ProductCarousel())
    
    cart.pushCartAction(CartAction('ADD', 'P401', {'new_qty': 1}))
    order_processor.enqueueOrder('O101')
    order_processor.enqueueOrder('O102')
    
    cust1_profile = {
        'name': 'Alice', 'freq': 5,
        'rec_graph': {
            'A-Shirt': {'B-Pants': 3, 'C-Socks': 1},
            'B-Pants': {'A-Shirt': 3, 'D-Belt': 2}
        }
    }
    cust2_profile = {
        'name': 'Bob', 'freq': 1,
        'rec_graph': {'E-Mug': {'F-Tea': 5}}
    }
    cust3_profile = {
        'name': 'Charlie', 'freq': 10, 
        'rec_graph': {'G-Book': {}}
    }
    customer_db.addCustomer(500, cust2_profile) 
    customer_db.addCustomer(300, cust1_profile) 
    customer_db.addCustomer(700, cust3_profile) 
    
    print("--- System Initialized ---")
    print(f"BST Root: {customer_db.root.id if customer_db.root else 'None'}")
    print(f"Carousel: {carousel.display()}")
    print(f"Featured: {carousel.get_featured()}")
    print("--------------------------")

initialize_system()


@app.route('/carousel', methods=['GET'])
def get_carousel():
    return jsonify({
        "carousel_order": carousel.display(),
        "featured_products": carousel.get_featured()
    })

@app.route('/carousel/add', methods=['POST'])
def add_to_carousel():
    data = request.json
    carousel.addToFront(data['product_id'], data.get('is_featured', False))
    return jsonify({"status": "Product added.", "current_carousel": carousel.display()})

@app.route('/carousel/remove/<product_id>', methods=['DELETE'])
def remove_from_carousel(product_id):
    if carousel.removeProduct(product_id):
        return jsonify({"status": f"Product {product_id} removed.", "current_carousel": carousel.display()})
    return jsonify({"status": "Product not found."}), 404

@app.route('/carousel/move_to_front/<product_id>', methods=['POST']) # Added this endpoint to match the frontend
def move_product_to_front(product_id):
    if carousel.moveToFront(product_id):
        return jsonify({"status": f"Product {product_id} moved to front.", "current_carousel": carousel.display()})
    return jsonify({"status": "Product not found."}), 404

@app.route('/carousel/validate', methods=['GET'])
def validate_carousel():
    if request.args.get('create_cycle') == 'true':
        if create_test_cycle(carousel):
            return jsonify({"status": "Cycle manually created. Run again without 'create_cycle=true' to repair."})
        else:
             return jsonify({"status": "Cycle creation failed (not enough nodes)."})


    result = carousel.validateCarousel()
    return jsonify(result)

@app.route('/cart/action', methods=['POST'])
def push_cart_action():
    data = request.json
    action = CartAction(
        data['action_type'], 
        data['product_id'], 
        data.get('change_data', {}) 
    )
    cart.pushCartAction(action)
    return jsonify({"status": "Action pushed to undo stack.", "stack_size": len(cart.undo_stack)})

@app.route('/cart/undo', methods=['POST'])
def undo_cart():
    result = cart.undoLastAction()
    return jsonify(result)

@app.route('/order/enqueue', methods=['POST'])
def enqueue_order():
    data = request.json
    order_id = data['order_id']
    vip_flag = data.get('vip', False)
    result = order_processor.enqueueOrder(order_id, vip_flag)
    return jsonify({"status": result['status'], "queue": order_processor.get_queue_summary()})

@app.route('/order/process', methods=['POST'])
def process_order():
    order = order_processor.processNextOrder()
    if order:
        return jsonify({"status": "Order processed.", "order": order})
    return jsonify({"status": "Order queue is empty."})

@app.route('/customer/<int:customer_id>', methods=['GET'])
def find_customer(customer_id):
    node = customer_db.findCustomer(customer_id)
    if node:
        return jsonify({
            "status": "Customer found.",
            "id": node.id, 
            "profile": node.profile,
            "purchase_frequency": node.purchase_frequency,
            "is_root": node == customer_db.root
        })
    return jsonify({"status": "Customer not found."}), 404

@app.route('/customer/promote/<int:customer_id>', methods=['POST'])
def promote_customer_route(customer_id):
    result = customer_db.promoteHotCustomer(customer_id)
    return jsonify(result)

@app.route('/customer/recommend/<int:customer_id>', methods=['GET'])
def recommend_products_route(customer_id):
    k = request.args.get('k', default=3, type=int)
    result = customer_db.recommendProducts(customer_id, k)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
