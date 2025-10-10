const db = require("../connection");
const format = require("pg-format");

const seed = ({
  usersData,
  categoriesData,
  eventsData,
  savedEventsData,
  bookedEventsData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS saved_events;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS booked_events;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS events;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT CHECK (role IN ('admin', 'staff', 'user')) DEFAULT 'user',
    phone TEXT,
    created_at TIMESTAMP DEFAULT NOW());`);
    })
    .then(() => {
      return db.query(`CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT UNIQUE NOT NULL,
    description TEXT);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    image_url TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    capacity INT DEFAULT 100,
    attendees INT DEFAULT 0,
    price NUMERIC(10,2) DEFAULT 0.00,
    date DATE,
    from_time TIME,
    to_time TIME,
    location TEXT,
    city TEXT,
    created_at TIMESTAMP DEFAULT NOW());`);
    })
    .then(() => {
      return db.query(`CREATE TABLE saved_events (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, event_id));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE booked_events (
    booked_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    tickets INT DEFAULT 1,
    booked_at TIMESTAMP DEFAULT NOW());`);
    })
    .then(() => {
      const formattedUsers = usersData.map(
        ({ user_id, full_name, email, role, phone, created_at }) => [
          user_id,
          full_name,
          email,
          role,
          phone,
          created_at,
        ]
      );
      const insertUsersQuery = format(
        `INSERT INTO users(user_id, full_name, email, role, phone, created_at) VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .then(() => {
      const formattedCategories = categoriesData.map(
        ({ category_id, category_name, description }) => [
          category_id,
          category_name,
          description,
        ]
      );
      const insertCategoriesQuery = format(
        `INSERT INTO categories(category_id, category_name, description) VALUES %L`,
        formattedCategories
      );
      return db.query(insertCategoriesQuery);
    })
    .then(() => {
      ///here problem no category name
      const formattedEvents = eventsData.map(
        ({
          image_url,
          title,
          description,
          category_id,
          capacity,
          price,
          date,
          from_time,
          to_time,
          location,
          city,
        }) => [
          image_url,
          title,
          description,
          category_id,
          capacity,
          price,
          date,
          from_time,
          to_time,
          location,
          city,
        ]
      );
      const insertEventsQuery = format(
        `INSERT INTO events(image_url,
          title,
          description,
          category_id,
          capacity,
          price,
          date,
          from_time,
          to_time,
          location,
          city) VALUES %L`,
        formattedEvents
      );
      return db.query(insertEventsQuery);
    })
    .then(() => {
      const formattedSavedEvents = savedEventsData.map(
        ({ user_id, event_id }) => [user_id, event_id]
      );
      const insertSavedEventsQuery = format(
        `INSERT INTO saved_events(user_id, event_id) VALUES %L`,
        formattedSavedEvents
      );
      return db.query(insertSavedEventsQuery);
    })
    .then(() => {
      const formattedBookedEvents = bookedEventsData.map(
        ({
          booked_id,
          event_id,
          user_id,
          full_name,
          email,
          phone,
          tickets,
          booked_at,
        }) => [
          booked_id,
          event_id,
          user_id,
          full_name,
          email,
          phone,
          tickets,
          booked_at,
        ]
      );
      const insertBookedEventsQuery = format(
        `INSERT INTO booked_events(booked_id,
          event_id,
          user_id,
          full_name,
          email,
          phone,
          tickets,
          booked_at) VALUES %L`,
        formattedBookedEvents
      );
      return db.query(insertBookedEventsQuery);
    })
    .catch((err) => {
      console.log("Seeding error:", err);
    });
};

module.exports = seed;

// -- ==============================
// -- USERS TABLE
// -- ==============================
// CREATE TABLE users (
//     user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     full_name TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL,
//     password TEXT,
//     role TEXT CHECK (role IN ('admin', 'staff', 'user')) DEFAULT 'user',
//     phone TEXT,
//     created_at TIMESTAMP DEFAULT NOW()
// );

// -- ==============================
// -- CATEGORIES TABLE
// -- ==============================
// CREATE TABLE categories (
//     category_id SERIAL PRIMARY KEY,
//     category_name TEXT UNIQUE NOT NULL,
//     description TEXT
// );

// -- ==============================
// -- EVENTS TABLE
// -- ==============================
// CREATE TABLE events (
//     event_id SERIAL PRIMARY KEY,
//     image_url TEXT,
//     title TEXT NOT NULL,
//     description TEXT,
//     category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
//     capacity INT DEFAULT 100,
//     attendees INT DEFAULT 0,
//     price NUMERIC(10,2) DEFAULT 0.00,
//     date DATE,
//     from_time TIME,
//     to_time TIME,
//     location TEXT,
//     city TEXT,
//     created_at TIMESTAMP DEFAULT NOW()
// );

// -- ==============================
// -- SAVED EVENTS TABLE
// -- ==============================
// CREATE TABLE saved_events (
//     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
//     event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
//     saved_at TIMESTAMP DEFAULT NOW(),
//     PRIMARY KEY (user_id, event_id)
// );

// -- ==============================
// -- BOOKED EVENTS TABLE
// -- ==============================
// CREATE TABLE booked_events (
//     booked_id SERIAL PRIMARY KEY,
//     event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
//     user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
//     full_name TEXT NOT NULL,
//     email TEXT NOT NULL,
//     phone TEXT,
//     tickets INT DEFAULT 1,
//     booked_at TIMESTAMP DEFAULT NOW()
// );
