from collections import deque

class CartAction:
    def __init__(self, action_type, product_id, change_data):
        self.action_type = action_type 
        self.product_id = product_id
        self.change_data = change_data 

    def __repr__(self):
        return f"Action({self.action_type} on {self.product_id})"

class ShoppingCart:
    def __init__(self, max_undo=5):
        self.undo_stack = []
        self.max_undo = max_undo
        self.items = {'P102': 1, 'P201': 3}

    def pushCartAction(self, action: CartAction):
        self.undo_stack.append(action)
        if len(self.undo_stack) > self.max_undo:
            self.undo_stack.pop(0) 

    def undoLastAction(self):
        if not self.undo_stack:
            return {"status": "Undo stack is empty."}
        
        last_action = self.undo_stack.pop()
        
        if last_action.action_type == 'ADD':
            self.items.pop(last_action.product_id, None)
            
        elif last_action.action_type == 'QTY_CHANGE':
            self.items[last_action.product_id] = last_action.change_data['old_qty']
        
        elif last_action.action_type == 'BUNDLE_ADD':
            if 'bundle_products' in last_action.change_data:
                for prod_id in last_action.change_data['bundle_products']:
                    self.items.pop(prod_id, None)

        return {"status": "Action undone successfully.", "action_type": last_action.action_type}
    
    def get_stack_summary(self):
        return [str(action) for action in self.undo_stack]

class OrderProcessor:
    def __init__(self):
        self.queue = deque()

    def enqueueOrder(self, order_id, vip_flag=False):
        
        order = {'id': order_id, 'vip': vip_flag}
        
        if not vip_flag or not self.queue:
            self.queue.append(order)
            return {"status": "Order added to the end."}
        else:
            last_order = self.queue.pop()
            
            self.queue.append(order)
            
            self.queue.append(last_order)
            
            return {"status": "VIP order inserted one position ahead of the end."}

    def processNextOrder(self):
        if not self.queue:
            return None
        return self.queue.popleft()

    def get_queue_summary(self):
        return list(self.queue)
