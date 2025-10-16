const devData = require("../data/development-data/index.js");
const format = require("pg-format");
const db = require("../connection.js");

const { categoriesData, eventsData } = devData;

const runSeed = (categoriesData, eventsData) => {
  return db
    .query(
      `CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    avatar_url TEXT,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'staff', 'user')) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW());`
    )
    .then(() => {
      return db.query(`CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    category_name TEXT UNIQUE NOT NULL,
    description TEXT);`);
    })
    .then(() => {
      return db.query(`CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    image_url TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    capacity INT DEFAULT 100,
    price NUMERIC(10,2) DEFAULT 0.00,
    date DATE,
    from_time TIME,
    to_time TIME,
    location TEXT,
    city TEXT,
    created_at TIMESTAMP DEFAULT NOW());`);
    })
    .then(() => {
      return db.query(`CREATE TABLE IF NOT EXISTS saved_events (
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, event_id));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE IF NOT EXISTS booked_events (
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
      const formattedCategories = categoriesData.map(
        ({ category_name, description }) => [category_name, description]
      );
      const insertCategoriesQuery = format(
        `INSERT INTO categories(category_name, description) VALUES %L ON CONFLICT (category_name) DO NOTHING;`,
        formattedCategories
      );
      return db.query(insertCategoriesQuery);
    })
    .then(() => {
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
          city) VALUES %L;`,
        formattedEvents
      );
      return db.query(insertEventsQuery);
    })
    .then(() => db.end());
};

runSeed(categoriesData, eventsData);
