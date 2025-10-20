class CustomerNode:
    def __init__(self, id, profile):
        self.id = id
        self.profile = profile
        self.left = None
        self.right = None
        self.parent = None 
        self.purchase_frequency = profile.get('freq', 0)
        self.rec_graph = profile.get('rec_graph', {}) 

    def __repr__(self):
        return f"CustNode(ID: {self.id}, Freq: {self.purchase_frequency})"

class CustomerDB:
    def __init__(self):
        self.root = None
      

    def addCustomer(self, id, profile):
        new_node = CustomerNode(id, profile)
        if not self.root:
            self.root = new_node
            return new_node
        
        current = self.root
        while True:
            if id < current.id:
                if current.left is None:
                    current.left = new_node
                    new_node.parent = current
                    return new_node
                current = current.left
            else: 
                if current.right is None:
                    current.right = new_node
                    new_node.parent = current
                    return new_node
                current = current.right

    def findCustomer(self, id):
        current = self.root
        while current:
            if id == current.id:
                return current
            elif id < current.id:
                current = current.left
            else:
                current = current.right
        return None

    def deleteCustomer(self, id):
        return self.findCustomer(id) is not None


    def _rotate_right(self, y_node):
        x_node = y_node.left
        y_node.left = x_node.right
        if x_node.right:
            x_node.right.parent = y_node
        
        x_node.parent = y_node.parent
        if not y_node.parent:
            self.root = x_node
        elif y_node == y_node.parent.right:
            y_node.parent.right = x_node
        else:
            y_node.parent.left = x_node
            
        x_node.right = y_node
        y_node.parent = x_node
        return x_node

    def _rotate_left(self, x_node):
        y_node = x_node.right
        x_node.right = y_node.left
        if y_node.left:
            y_node.left.parent = x_node
        
        y_node.parent = x_node.parent
        if not x_node.parent:
            self.root = y_node
        elif x_node == x_node.parent.left:
            x_node.parent.left = y_node
        else:
            x_node.parent.right = y_node
            
        y_node.left = x_node
        x_node.parent = y_node
        return y_node


    def promoteHotCustomer(self, id):

        node = self.findCustomer(id)
        if not node or not node.parent:
            return {"status": "Customer not found or is already the root."}
        
        parent = node.parent
        
        if node == parent.left:
            self._rotate_right(parent)
            return {"status": f"Customer {id} promoted one level (Right Rotation)."}
        
        elif node == parent.right:
            self._rotate_left(parent)
            return {"status": f"Customer {id} promoted one level (Left Rotation)."}
        
        return {"status": "Promotion logic failed."}
    

    def recommendProducts(self, customer_id, k):

        node = self.findCustomer(customer_id)
        if not node:
            return {"status": "Customer not found."}
        
        recommendation_counts = {}
        
        for product_id in node.rec_graph:
            for co_bought_id, count in node.rec_graph[product_id].items():
                
                if co_bought_id not in node.rec_graph:
                    recommendation_counts[co_bought_id] = recommendation_counts.get(co_bought_id, 0) + count

        sorted_recs = sorted(
            recommendation_counts.items(), 
            key=lambda item: item[1], 
            reverse=True
        )

        top_k_recs = [item[0] for item in sorted_recs[:k]]
        
        return {"status": "Recommendations generated.", "recommendations": top_k_recs}
