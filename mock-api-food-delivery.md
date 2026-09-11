# Mock API Setup for Your Food Delivery App

Instead of a real backend, use **json-server** — it gives you a full CRUD REST API from a single JSON file in ~30 seconds.

## 1. Project Structure

```text
mock-api/
├── db.json          ← your "database"
├── server.js        ← custom server (optional, for /api prefix)
├── routes.json      ← route rewrites (optional)
└── package.json
```

## 2. Install & Run

```bash
mkdir mock-api && cd mock-api
npm init -y
npm install json-server
```

### Quick start (zero config)

```bash
npx json-server --watch db.json --port 3000
```

That's it. You now have a live API at:

```text
http://localhost:3000
```

## 3. `db.json` — Your Mock Database

```json
{
  "users": [
    { "id": 1, "role": "customer", "name": "John Doe", "email": "john@email.com", "phone": "+1234567890" }
  ],
  "addresses": [
    { "id": 1, "userId": 1, "label": "Home", "line1": "123 Main St", "city": "Brooklyn", "lat": 40.6782, "lng": -73.9442 }
  ],
  "restaurants": [
    {
      "id": 1,
      "name": "Bella's Italian",
      "description": "Authentic Italian cuisine",
      "logoUrl": "https://picsum.photos/200?random=1",
      "coverUrl": "https://picsum.photos/800/400?random=2",
      "phone": "+11111111111",
      "lat": 40.6782,
      "lng": -73.9442,
      "openingTime": "10:00",
      "closingTime": "22:00",
      "rating": 4.5,
      "cuisines": ["Italian", "Pizza"]
    },
    {
      "id": 2,
      "name": "Noodle House",
      "description": "Best ramen in town",
      "logoUrl": "https://picsum.photos/200?random=3",
      "coverUrl": "https://picsum.photos/800/400?random=4",
      "phone": "+2222222222",
      "lat": 40.6820,
      "lng": -73.9390,
      "openingTime": "11:00",
      "closingTime": "21:00",
      "rating": 4.2,
      "cuisines": ["Asian", "Noodles"]
    }
  ],
  "menuCategories": [
    { "id": 1, "restaurantId": 1, "name": "Starters" },
    { "id": 2, "restaurantId": 1, "name": "Mains" },
    { "id": 3, "restaurantId": 2, "name": "Ramen" },
    { "id": 4, "restaurantId": 2, "name": "Sides" }
  ],
  "menuItems": [
    { "id": 1, "categoryId": 1, "name": "Bruschetta", "description": "Grilled bread, tomato, basil", "price": 6.99, "imageUrl": "https://picsum.photos/300?random=10", "isVeg": true, "isAvailable": true },
    { "id": 2, "categoryId": 2, "name": "Margherita Pizza", "description": "Classic cheese and tomato pizza", "price": 12.99, "imageUrl": "https://picsum.photos/300?random=11", "isVeg": true, "isAvailable": true },
    { "id": 3, "categoryId": 2, "name": "Spaghetti Bolognese", "description": "Pasta with beef ragù", "price": 14.99, "imageUrl": "https://picsum.photos/300?random=12", "isVeg": false, "isAvailable": true },
    { "id": 4, "categoryId": 3, "name": "Tonkotsu Ramen", "description": "Rich pork broth, chashu, egg", "price": 15.99, "imageUrl": "https://picsum.photos/300?random=13", "isVeg": false, "isAvailable": true },
    { "id": 5, "categoryId": 3, "name": "Shoyu Ramen", "description": "Soy-based broth, chicken, bamboo", "price": 13.99, "imageUrl": "https://picsum.photos/300?random=14", "isVeg": false, "isAvailable": true }
  ],
  "orders": [
    {
      "id": 1,
      "customerId": 1,
      "restaurantId": 1,
      "addressId": 1,
      "driverId": null,
      "status": "placed",
      "subtotal": 27.98,
      "deliveryFee": 2.99,
      "tax": 2.24,
      "discount": 0,
      "total": 33.21,
      "notes": "Ring the bell",
      "createdAt": "2026-09-11T12:00:00Z"
    }
  ],
  "orderItems": [
    { "id": 1, "orderId": 1, "menuItemId": 2, "quantity": 1, "unitPrice": 12.99, "notes": "" },
    { "id": 2, "orderId": 1, "menuItemId": 3, "quantity": 1, "unitPrice": 14.99, "notes": "no onions" }
  ],
  "payments": [
    { "id": 1, "orderId": 1, "method": "card", "status": "pending", "amount": 33.21, "createdAt": "2026-09-11T12:00:00Z" }
  ],
  "drivers": [
    { "id": 10, "role": "driver", "name": "Mike", "phone": "+3333333333", "lat": 40.6790, "lng": -73.9430, "isAvailable": true }
  ]
}
```

## 4. Custom Server with `/api` Prefix (Optional)

If you want endpoints like `/api/restaurants` instead of `/restaurants`:

```js
// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}));
server.use(router);

server.listen(3000, () => {
  console.log('Mock API running at http://localhost:3000/api');
});
```

Run it with:

```bash
node server.js
```

## 5. Auto-Generated Endpoints

json-server gives you **all CRUD endpoints for free**:

| Method | Endpoint | Example |
| :--- | :--- | :--- |
| GET | `/api/restaurants` | List all |
| GET | `/api/restaurants/1` | By ID |
| GET | `/api/restaurants?rating=4.5` | Filter |
| GET | `/api/restaurants?_sort=rating&_order=desc` | Sort |
| GET | `/api/restaurants?_page=1&_limit=5` | Paginate |
| POST | `/api/orders` | Create order |
| PATCH | `/api/orders/1` | Update status |
| DELETE | `/api/orders/1` | Delete |

[json-server mock API documentation](https://github.com/typicode/json-server)

## 6. Frontend Connection (Flutter Example)

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiClient {
  static const baseUrl = 'http://10.0.2.2:3000/api'; // Android emulator
  // Use 'http://localhost:3000/api' for iOS simulator or web

  static Future<List<Map<String, dynamic>>> getRestaurants() async {
    final res = await http.get(Uri.parse('$baseUrl/restaurants'));
    return jsonDecode(res.body) as List<Map<String, dynamic>>;
  }

  static Future<List<Map<String, dynamic>>> getMenu(int restaurantId) async {
    final res = await http.get(Uri.parse('$baseUrl/menuItems?categoryId=2'));
    return jsonDecode(res.body) as List<Map<String, dynamic>>;
  }

  static Future<Map<String, dynamic>> createOrder(Map<String, dynamic> order) async {
    final res = await http.post(
      Uri.parse('$baseUrl/orders'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(order),
    );
    return jsonDecode(res.body) as Map<String, dynamic>;
  }

  static Future<void> updateOrderStatus(int id, String status) async {
    await http.patch(
      Uri.parse('$baseUrl/orders/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'status': status}),
    );
  }
}
```

## 7. Simulating Real-Time (WebSocket Mock)

json-server doesn't do WebSockets. For the tracking screen, **fake it** on the frontend:

```dart
// Simulate driver moving toward user
void simulateDriver() {
  double lat = 40.6790, lng = -73.9430;
  final targetLat = 40.6782, targetLng = -73.9442;

  Timer.periodic(Duration(seconds: 2), (timer) {
    lat += (targetLat - lat) * 0.1;
    lng += (targetLng - lng) * 0.1;
    driverLocation.value = LatLng(lat, lng); // trigger UI update
  });
}
```

## 8. Quick Start Checklist

| Step | Command / Action |
| :--- | :--- |
| 1 | `npm install json-server` |
| 2 | Create `db.json` with data above |
| 3 | `npx json-server --watch db.json` |
| 4 | Open `http://localhost:3000` in browser to verify |
| 5 | Point your app's `baseUrl` to `http://localhost:3000/api` |
| 6 | Build UI screens against live mock data |

---

**That's the entire backend.** No database, no auth, no Stripe — just a JSON file serving realistic data so you can build and test every screen end-to-end.

When you're ready for production, swap the `baseUrl` to your real API and the frontend code stays identical.
