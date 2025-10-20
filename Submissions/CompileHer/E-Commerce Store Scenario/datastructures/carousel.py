class ProductNode:
    def __init__(self, product_id, is_featured=False):
        self.product_id = product_id
        self.is_featured = is_featured
        self.prev = None
        self.next = None

class ProductCarousel:
    def __init__(self):
        self.head = None
        self.tail = None
        self.product_map = {}
        self.featured_count = 0
        self.MAX_FEATURED = 3

    def _update_featured_status(self):
        current = self.head
        count = 0
        self.featured_count = 0
        
        while current and count < self.MAX_FEATURED:
            current.is_featured = True
            self.featured_count += 1
            current = current.next
            count += 1
        
        while current:
            current.is_featured = False
            current = current.next

    def _auto_promote(self):
        self._update_featured_status()

    def addToFront(self, product_id, is_featured=False):
        if product_id in self.product_map:
            return False 

        new_node = ProductNode(product_id, is_featured)
        self.product_map[product_id] = new_node

        if not self.head:
            self.head = self.tail = new_node
        else:
            new_node.next = self.head
            self.head.prev = new_node
            self.head = new_node
        
        self._auto_promote()
        return True

    def addToEnd(self, product_id, is_featured=False):
        if product_id in self.product_map:
            return False

        new_node = ProductNode(product_id, is_featured)
        self.product_map[product_id] = new_node
        
        if not self.tail:
            self.head = self.tail = new_node
        else:
            self.tail.next = new_node
            new_node.prev = self.tail
            self.tail = new_node
            
        self._auto_promote()
        return True
    
    def _unlink_node(self, node):
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next # Node was the head
        
        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev # Node was the tail
        
        node.prev = None
        node.next = None

    def removeProduct(self, product_id):
        node = self.product_map.get(product_id)
        if not node:
            return False

        self._unlink_node(node)

        del self.product_map[product_id]
        
        self._auto_promote() 
        
        return True

    def moveToFront(self, product_id):
        node = self.product_map.get(product_id)
        if not node or node == self.head:
            return False

        self._unlink_node(node)
        
        node.next = self.head
        self.head.prev = node
        self.head = node
        
        self._auto_promote()
        
        return True

    def validateCarousel(self):
        """using Floyd's Tortoise and Hare algorithm"""
        if not self.head:
            return {"status": "No cycle detected (carousel is empty).", "repaired": False}

        tortoise = self.head
        hare = self.head

        while hare and hare.next:
            tortoise = tortoise.next
            hare = hare.next.next

            if tortoise == hare:    
                current = self.head
                new_tail = self.head
                
                count = 0
                max_checks = 2 * len(self.product_map) + 5 

                seen_nodes = set()
                while current and current.next and current.next not in seen_nodes and count < max_checks:
                    seen_nodes.add(current)
                    new_tail = current
                    current = current.next
                    count += 1
                
                if current and current.next and current.next in seen_nodes:
                    new_tail = current
                    new_tail.next = None 
                    self.tail = new_tail
                    
                    return {"status": "CYCLE DETECTED AND REPAIRED.", "repaired": True, "details": "Loop broken by resetting the tail's next pointer."}


        return {"status": "No cycle detected.", "repaired": False}

    def display(self):
        products = []
        current = self.head
        count = 0
        while current and count < 2 * len(self.product_map) + 2: # Safety limit for display
            products.append(current.product_id)
            current = current.next
            count += 1
        return products

    def get_featured(self):
        featured = []
        current = self.head
        while current and len(featured) < self.MAX_FEATURED:
            if current.is_featured:
                featured.append(current.product_id)
            current = current.next
        return featured


def create_test_cycle(carousel):
    if len(carousel.product_map) < 3:
        return False

    target_node = carousel.head
    count = 0

    while target_node and count < 2:
        target_node = target_node.next
        count += 1

    if target_node and carousel.tail:
        carousel.tail.next = target_node
        print("--- DEBUG: Test Cycle created ---")
        return True
    return False

def setup_carousel_mock(carousel):
    carousel.addToFront('P101', is_featured=True)
    carousel.addToFront('P102', is_featured=True)
    carousel.addToFront('P103', is_featured=True)

    carousel.addToEnd('P201')
    carousel.addToEnd('P202')
    carousel.addToEnd('P301')
    carousel.addToEnd('P302')
    
    carousel.addToFront('P104', is_featured=True)
    
    return carousel
