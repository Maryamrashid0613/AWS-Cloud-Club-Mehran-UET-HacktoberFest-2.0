
# 🐻 Bear API - Dockerized Node.js + MongoDB

This project runs a **Node.js (Express + Mongoose)** API and **MongoDB** using Docker Compose.  
MongoDB uses **persistent storage** and authentication, and the Node app runs migrations and seeds automatically on startup.

---

## 🧱 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=password

MONGODB_URI=mongodb://root:password@mongo:27017/bearDB?authSource=admin
````

> `mongo` refers to the MongoDB service in `docker-compose.yml`.
> The URI includes username, password, and `authSource=admin` because authentication is enabled.

---

## Run the Project

### Build and start containers

```bash
docker compose up --build
```

This will:

* Build the Node.js image
* Start **Node.js** and **MongoDB** containers
* Run migrations and seed scripts automatically
* Expose the API on port `3000`

---

### 2️⃣ Verify services

* API: [http://localhost:3000](http://localhost:3000)
* MongoDB: accessible internally at `mongodb://root:password@mongo:27017`

---

## 🧩 Manual Database Operations

If needed, you can run migrations or seed manually:

```bash
docker compose exec app pnpm run migrate
docker compose exec app pnpm run seed
```

---

## 💾 Persistent MongoDB Storage

MongoDB data is stored in a **Docker volume** called `mongo_data`.

To list volumes:

```bash
docker volume ls
```