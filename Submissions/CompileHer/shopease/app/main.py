from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# --- DATA MODELS ---

class Product(BaseModel):
    """Defines a single item in the cart."""
    product_id: str
    name: str
    price: float = Field(..., gt=0, description="Price must be greater than zero.")
    quantity: int = Field(..., gt=0, description="Quantity must be greater than zero.")

class Cart(BaseModel):
    """The complete cart state, including dynamic totals."""
    items: List[Product]
    # These fields will be calculated dynamically and should be initialized to 0.0
    subtotal: float = 0.0
    tax_rate: float = 0.08 # Example tax rate (8%)
    tax_amount: float = 0.0
    total: float = 0.0
    
# --- CALCULATION FUNCTION ---

def calculate_cart_totals(cart_data: Cart) -> Cart:
    """
    Calculates subtotal, tax, and final total based on cart items.
    
    This fixes the '0 subtotal/total' issue and replaces the hardcoded '799'
    for the process sale amount with the calculated total.
    """
    
    # 1. Calculate Subtotal
    subtotal = sum(item.price * item.quantity for item in cart_data.items)
    
    # 2. Calculate Tax Amount
    tax_amount = subtotal * cart_data.tax_rate
    
    # 3. Calculate Final Total (This is the amount for 'process sale')
    total = subtotal + tax_amount
    
    # 4. Update the Cart object with calculated values
    cart_data.subtotal = round(subtotal, 2)
    cart_data.tax_amount = round(tax_amount, 2)
    cart_data.total = round(total, 2)
    
    return cart_data

# --- APP SETUP ---

app = FastAPI()

# Configure CORS Middleware (Kept for frontend connectivity)
origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---

@app.get("/")
def read_root():
    """Health check and status route."""
    # Provide a simple example cart for connection test
    sample_cart = Cart(
        items=[
            Product(product_id="A01", name="Test Item 1", price=10.00, quantity=1),
        ]
    )
    calculated_cart = calculate_cart_totals(sample_cart)
    
    return {
        "status": "ok", 
        "message": "FastAPI API is running!",
        "initial_total_check": calculated_cart.total 
    }

@app.post("/cart/calculate")
def calculate_sale(cart_data: Cart):
    """
    Endpoint for the frontend to send the current cart data and receive 
    the calculated totals.
    
    The frontend should call this POST endpoint every time an item is added,
    removed, or quantity is changed.
    """
    calculated_cart = calculate_cart_totals(cart_data)
    
    # The calculated_cart object contains the correct subtotal, tax_amount, 
    # and total (which is your 'process sale' amount).
    return calculated_cart

# --- IMPORTANT NOTES FOR FRONTEND FIX ---

# 1. Frontend Update: When the frontend processes a sale, it must now
#    use the 'total' field returned by the '/cart/calculate' endpoint, 
#    instead of the hardcoded value (799).

# 2. Data Flow: The frontend needs to POST the full list of products 
#    (with price and quantity) to '/cart/calculate' and use the resulting 
#    JSON object to update its UI fields for subtotal and total.
