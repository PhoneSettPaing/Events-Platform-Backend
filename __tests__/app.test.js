const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Bad URL errors", () => {
  test("404: Responds with Invalid Url! msg", () => {
    return request(app)
      .get("/NotAValidUrl")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Url!");
      });
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(6);
        users.forEach((user) => {
          expect(user).toMatchObject({
            user_id: expect.any(String),
            avatar_url: null,
            full_name: expect.any(String),
            email: expect.any(String),
            password: null,
            role: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:user_id", () => {
  test("200: Responds with a user object for given user_id", () => {
    return request(app)
      .get("/api/users/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: "f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111",
          avatar_url: null,
          full_name: "Alice Thompson",
          email: "alice.thompson@eventhub.co.uk",
          password: null,
          role: "admin",
          created_at: expect.any(String),
        });
      });
  });

  test("400: Respond with Invalid user_id format! when user_id id invalid", () => {
    return request(app)
      .get("/api/users/NotVaildUserId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });

  test("404: Respond with user_id Not Found! when user_id not in database", () => {
    return request(app)
      .get("/api/users/123e4567-e89b-12d3-a456-426614174000")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });
});

describe("PATCH /api/users/:user_id", () => {
  test("200: Respond with an updated user object with updated full_name and avatar_url for given user_id", () => {
    const patchObj = {
      full_name: "Tom Doe",
      avatar_url: "photo/testimage.jpg",
    };

    return request(app)
      .patch("/api/users/e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: "e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555",
          avatar_url: "photo/testimage.jpg",
          full_name: "Tom Doe",
          email: "ella.nguyen@example.com",
          password: null,
          role: "user",
          created_at: expect.any(String),
        });
      });
  });

  test("200: Respond with an updated user object with just updated full_name for given user_id", () => {
    const patchObj = { full_name: "Tom Doe" };

    return request(app)
      .patch("/api/users/e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: "e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555",
          avatar_url: null,
          full_name: "Tom Doe",
          email: "ella.nguyen@example.com",
          password: null,
          role: "user",
          created_at: expect.any(String),
        });
      });
  });

  test("200: Respond with an updated user object with just updated avatar_url for given user_id", () => {
    const patchObj = {
      avatar_url: "photo/testimage.jpg",
    };

    return request(app)
      .patch("/api/users/e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: "e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555",
          avatar_url: "photo/testimage.jpg",
          full_name: "Ella Nguyen",
          email: "ella.nguyen@example.com",
          password: null,
          role: "user",
          created_at: expect.any(String),
        });
      });
  });

  test("400: Respond with Missing required field! when trying to patch with empty patchObj", () => {
    const patchObj = {};

    return request(app)
      .patch("/api/users/e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field!");
      });
  });

  test("400: Respond with Invalid user_id format! when trying to patch with invalid user_id", () => {
    const patchObj = { full_name: "Tom Doe" };

    return request(app)
      .patch("/api/users/NotVaildUserId")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });

  test("404: Respond with user_id Not Found! when trying to patch with user_id not in database", () => {
    const patchObj = { full_name: "Tom Doe" };

    return request(app)
      .patch("/api/users/123e4567-e89b-12d3-a456-426614174000")
      .send(patchObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });
});

describe("PATCH /api/users/:user_id/role", () => {
  test("200: Responds with an updated user objects", () => {
    const patchObj = { role: "staff" };

    return request(app)
      .patch("/api/users/e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555/role")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: "e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555",
          avatar_url: null,
          full_name: "Ella Nguyen",
          email: "ella.nguyen@example.com",
          password: null,
          role: "staff",
          created_at: expect.any(String),
        });
      });
  });

  test("400: Respond with Missing required field or invalid role! when trying to patch with empty patchObj", () => {
    const patchObj = {};

    return request(app)
      .patch("/api/users/e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555/role")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field or invalid role!");
      });
  });

  test("400: Respond with Missing required field or invalid role! when trying to patch with invalid role", () => {
    const patchObj = { role: "notValid" };

    return request(app)
      .patch("/api/users/e9a7a130-ef50-4d29-a8d8-3e4c8e5ac555/role")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field or invalid role!");
      });
  });

  test("400: Respond with Invalid user_id format! when trying to patch with user_id not in database", () => {
    const patchObj = { role: "staff" };

    return request(app)
      .patch("/api/users/NotValidId/role")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });

  test("404: Respond with user_id Not Found! when trying to patch with user_id not in database", () => {
    const patchObj = { role: "staff" };

    return request(app)
      .patch("/api/users/123e4567-e89b-12d3-a456-426614174999/role")
      .send(patchObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });
});

describe("GET /api/categories", () => {
  test("200: Responds with an array of categories objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories.length).toBe(10);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            category_id: expect.any(Number),
            category_name: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/events", () => {
  test("200: Responds with an array of events objects", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body: { events } }) => {
        expect(events.length).toBe(50);
        events.forEach((event) => {
          expect(event).toMatchObject({
            event_id: expect.any(Number),
            image_url: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
            category_id: expect.any(Number),
            capacity: expect.any(Number),
            price: expect.any(String),
            date: expect.any(String),
            from_time: expect.any(String),
            to_time: expect.any(String),
            location: expect.any(String),
            city: expect.any(String),
            created_at: expect.any(String),
            category_name: expect.any(String),
            attendees: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/events/:event_id", () => {
  test("200: Responds with an event object with given event_id", () => {
    return request(app)
      .get("/api/events/2")
      .expect(200)
      .then(({ body: { event } }) => {
        expect(event).toMatchObject({
          event_id: 2,
          image_url: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
          category_id: expect.any(Number),
          capacity: expect.any(Number),
          price: expect.any(String),
          date: expect.any(String),
          from_time: expect.any(String),
          to_time: expect.any(String),
          location: expect.any(String),
          city: expect.any(String),
          created_at: expect.any(String),
          category_name: expect.any(String),
          attendees: expect.any(Number),
        });
      });
  });

  test("400: Responds with Bad Request! with an invalid event_id", () => {
    return request(app)
      .get("/api/events/NotValidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("404: Responds with event_id Not Found! with an event_id not in database", () => {
    return request(app)
      .get("/api/events/999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("event_id Not Found!");
      });
  });
});

describe("POST /api/events", () => {
  test("201: Responds with an added event object", () => {
    const postObj = {
      image_url: "https://example.com/event.jpg",
      title: "React Bootcamp",
      description: "Learn React in 2 days",
      category_id: 1,
      capacity: 50,
      price: 0,
      date: "2025-10-22",
      from_time: "09:00",
      to_time: "16:00",
      location: "TechHub",
      city: "Manchester",
    };

    return request(app)
      .post("/api/events")
      .send(postObj)
      .expect(201)
      .then(({ body: { event } }) => {
        expect(event).toMatchObject({
          event_id: 51,
          image_url: "https://example.com/event.jpg",
          title: "React Bootcamp",
          description: "Learn React in 2 days",
          category_id: 1,
          capacity: 50,
          price: "0.00",
          date: "2025-10-22",
          from_time: "09:00:00",
          to_time: "16:00:00",
          location: "TechHub",
          city: "Manchester",
          created_at: expect.any(String),
        });
      });
  });

  test("400: Respond with Missing required field! when trying to add event with incomplete object in post object", () => {
    const postObj = {
      image_url: "https://example.com/event.jpg",
      title: "React Bootcamp",
      description: "Learn React in 2 days",
      category_id: 1,
      capacity: 50,
    };

    return request(app)
      .post("/api/events")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field!");
      });
  });

  test("400: Respond with Invalid data type! when postObj has invalid data type", () => {
    const postObj = {
      image_url: "https://example.com/image.jpg",
      title: "Tech Talk",
      description: "Talk about AI",
      category_id: 1,
      capacity: "fifty",
      price: 10,
      date: "2025-10-22",
      from_time: "09:00",
      to_time: "16:00",
      location: "TechHub",
      city: "Manchester",
    };

    return request(app)
      .post("/api/events")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or format!");
      });
  });

  test("400: Responds with Invalid data type! when postObj has invalid time", () => {
    const postObj = {
      image_url: "https://example.com/image.jpg",
      title: "Bad Date Event",
      description: "Invalid date/time input",
      category_id: 1,
      capacity: 100,
      price: 0,
      date: "not-a-date",
      from_time: "25:99",
      to_time: "16:00",
      location: "TechHub",
      city: "London",
    };

    return request(app)
      .post("/api/events")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or format!");
      });
  });

  test("400: Responds with Invalid data type! when postObj has invalid price", () => {
    const postObj = {
      image_url: "https://example.com/image.jpg",
      title: "Negative Price Event",
      description: "Oops",
      category_id: 1,
      capacity: 100,
      price: -10,
      date: "2025-10-22",
      from_time: "09:00",
      to_time: "16:00",
      location: "TechHub",
      city: "Manchester",
    };

    return request(app)
      .post("/api/events")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type or format!");
      });
  });

  test("400: Responds with Bad Request! when category_id does not exist in database", () => {
    const postObj = {
      image_url: "https://example.com/image.jpg",
      title: "Ghost Category Event",
      description: "This category doesn't exist",
      category_id: 9999,
      capacity: 100,
      price: 5,
      date: "2025-10-22",
      from_time: "09:00",
      to_time: "16:00",
      location: "TechHub",
      city: "London",
    };

    return request(app)
      .post("/api/events")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });
});

describe("GET /api/booked_events/:user_id", () => {
  test("200: Responds with an array of booked_events objects for given user_id", () => {
    return request(app)
      .get("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac444")
      .expect(200)
      .then(({ body: { booked_events } }) => {
        expect(booked_events.length).toBe(1);
        booked_events.forEach((booked_event) => {
          expect(booked_event).toMatchObject({
            booked_id: expect.any(Number),
            event_id: expect.any(Number),
            user_id: expect.any(String),
            full_name: expect.any(String),
            email: expect.any(String),
            phone: expect.any(String),
            tickets: expect.any(Number),
            booked_at: expect.any(String),
            title: expect.any(String),
            date: expect.any(String),
            from_time: expect.any(String),
            to_time: expect.any(String),
            location: expect.any(String),
            city: expect.any(String),
          });
        });
      });
  });

  test("200: Responds with an empty array when the user has no booked events", () => {
    return request(app)
      .get("/api/booked_events/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111")
      .expect(200)
      .then(({ body: { booked_events } }) => {
        expect(Array.isArray(booked_events)).toBe(true);
        expect(booked_events.length).toBe(0);
      });
  });

  test("400: Respond with Invalid user_id format! when given user_id is invalid", () => {
    return request(app)
      .get("/api/booked_events/NotValidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });

  test("404: Respond with user_id Not Found! when given user_id is not in database", () => {
    return request(app)
      .get("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac123")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });
});

describe("POST /api/booked_events/:user_id", () => {
  test("201: Responds with a booked_event object for given user_id", () => {
    const postObj = {
      event_id: 2,
      full_name: "Ben Harris",
      email: "ben.harris@example.com",
      phone: "+44 7700 900004",
      tickets: 2,
    };

    return request(app)
      .post("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac444")
      .send(postObj)
      .expect(201)
      .then(({ body: { booked_event } }) => {
        expect(booked_event).toMatchObject({
          booked_id: expect.any(Number),
          event_id: 2,
          user_id: "d3f0a920-0c33-4ef9-83c2-81d65a1ac444",
          full_name: "Ben Harris",
          email: "ben.harris@example.com",
          phone: "+44 7700 900004",
          tickets: 2,
          booked_at: expect.any(String),
        });
      });
  });

  test("400: Respond with Invalid user_id format! when given user_id is invalid", () => {
    const postObj = {
      event_id: 2,
      full_name: "Ben Harris",
      email: "ben.harris@example.com",
      phone: "+44 7700 900004",
      tickets: 2,
    };

    return request(app)
      .post("/api/booked_events/NotValidId")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });

  test("400: Respond with user_id Not Found! when given user_id is not in database", () => {
    const postObj = {
      event_id: 2,
      full_name: "Ben Harris",
      email: "ben.harris@example.com",
      phone: "+44 7700 900004",
      tickets: 2,
    };

    return request(app)
      .post("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac123")
      .send(postObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });

  test("400: Respond with Bad Request! when given event_id is not in database", () => {
    const postObj = {
      event_id: 999,
      full_name: "Ben Harris",
      email: "ben.harris@example.com",
      phone: "+44 7700 900004",
      tickets: 2,
    };

    return request(app)
      .post("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac444")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("400: Respond with Invalid data type! when given event_id is invalid", () => {
    const postObj = {
      event_id: "NotEventID",
      full_name: "Ben Harris",
      email: "ben.harris@example.com",
      phone: "+44 7700 900004",
      tickets: 2,
    };

    return request(app)
      .post("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac444")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type!");
      });
  });

  test("400: Respond with Missing required field! when post obj has missing field", () => {
    const postObj = {
      event_id: 3,
      phone: "+44 7700 900004",
      tickets: 2,
    };

    return request(app)
      .post("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac444")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field!");
      });
  });

  test("400: Respond with Invalid data type! when given tickets is negative", () => {
    const postObj = {
      event_id: 3,
      full_name: "Ben Harris",
      email: "ben.harris@example.com",
      phone: "+44 7700 900004",
      tickets: -2,
    };

    return request(app)
      .post("/api/booked_events/d3f0a920-0c33-4ef9-83c2-81d65a1ac444")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type!");
      });
  });
});

describe("POST /api/booked_events", () => {
  test("201: Responds with a booked_event object for guest", () => {
    const postObj = {
      event_id: 2,
      full_name: "Ben Harris",
      email: "ben.harris@example.com",
      phone: "+44 7700 900004",
      tickets: 2,
    };

    return request(app)
      .post("/api/booked_events")
      .send(postObj)
      .expect(201)
      .then(({ body: { booked_event } }) => {
        expect(booked_event).toMatchObject({
          booked_id: expect.any(Number),
          event_id: 2,
          user_id: null,
          full_name: "Ben Harris",
          email: "ben.harris@example.com",
          phone: "+44 7700 900004",
          tickets: 2,
          booked_at: expect.any(String),
        });
      });
  });
});

describe("GET /api/saved_events/:user_id", () => {
  test("200: Responds with an array of saved_events objects", () => {
    return request(app)
      .get("/api/saved_events/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111")
      .expect(200)
      .then(({ body: { saved_events } }) => {
        expect(saved_events.length).toBe(2);
        saved_events.forEach((saved_event) => {
          expect(saved_event).toMatchObject({
            event_id: expect.any(Number),
            image_url: expect.any(String),
            title: expect.any(String),
            description: expect.any(String),
            category_id: expect.any(Number),
            capacity: expect.any(Number),
            price: expect.any(String),
            date: expect.any(String),
            from_time: expect.any(String),
            to_time: expect.any(String),
            location: expect.any(String),
            city: expect.any(String),
            created_at: expect.any(String),
            category_name: expect.any(String),
            attendees: expect.any(Number),
          });
        });
      });
  });

  test("200: Responds with an empty array when the user has no saved events", () => {
    return request(app)
      .get("/api/saved_events/b1e2cf30-c5c9-4f18-9b34-22ad2f3dc333")
      .expect(200)
      .then(({ body: { saved_events } }) => {
        expect(Array.isArray(saved_events)).toBe(true);
        expect(saved_events.length).toBe(0);
      });
  });

  test("400: Responds with Invalid user_id format! when given user_id is not a valid UUID", () => {
    return request(app)
      .get("/api/saved_events/NotValidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });

  test("404: Responds with user_id Not Found! when given user_id is not in the database", () => {
    return request(app)
      .get("/api/saved_events/b1e2cf30-c5c9-4f18-9b34-22ad2f3dc123")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });
});

describe("POST /api/saved_events/:user_id", () => {
  test("200: Responds with an inserted saved_events objects", () => {
    const postObj = { event_id: 1 };

    return request(app)
      .post("/api/saved_events/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111")
      .send(postObj)
      .expect(201)
      .then(({ body: { saved_event } }) => {
        expect(saved_event).toMatchObject({
          user_id: "f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111",
          event_id: 1,
          saved_at: expect.any(String),
        });
      });
  });

  test("400: Responds with Bad Request! when given event_id is not in the database", () => {
    const postObj = { event_id: 9999 };

    return request(app)
      .post("/api/saved_events/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("400: Responds with Invalid data type! when given event_id is not a valid id format", () => {
    const postObj = { event_id: "NotValidId" };

    return request(app)
      .post("/api/saved_events/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type!");
      });
  });

  test("400: Responds with Missing required field! when postObj/event_id is empty", () => {
    const postObj = {};

    return request(app)
      .post("/api/saved_events/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a111")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field!");
      });
  });

  test("400: Responds with Invalid user_id format! when given user_id is not a valid UUID", () => {
    const postObj = { event_id: 1 };

    return request(app)
      .post("/api/saved_events/NotValidId")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });

  test("404: Responds with user_id Not Found! when given user_id is not in the database", () => {
    const postObj = { event_id: 1 };

    return request(app)
      .post("/api/saved_events/f4b3cbd0-0a12-4e2b-9d10-9e2a3e45a456")
      .send(postObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });
});

describe("DELETE /api/saved_events/:user_id", () => {
  test("204: when given saved event is sucessfully deleted from given user_id", () => {
    const deleteObj = { event_id: 15 };

    return request(app)
      .delete("/api/saved_events/c7b1f840-6f76-4b2e-9a2b-7d9ad3dcf666")
      .send(deleteObj)
      .expect(204);
  });

  test("400: Respond with Invalid data type! when given event_id is not valid data format", () => {
    const deleteObj = { event_id: "NotValidId" };

    return request(app)
      .delete("/api/saved_events/c7b1f840-6f76-4b2e-9a2b-7d9ad3dcf666")
      .send(deleteObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid data type!");
      });
  });

  test("400: Respond with event_id Not Found! when given event_id is not in the database", () => {
    const deleteObj = { event_id: 9999 };

    return request(app)
      .delete("/api/saved_events/c7b1f840-6f76-4b2e-9a2b-7d9ad3dcf666")
      .send(deleteObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("event_id Not Found!");
      });
  });

  test("400: Respond with Missing required field! when deleteObj/event_id is empty", () => {
    const deleteObj = {};

    return request(app)
      .delete("/api/saved_events/c7b1f840-6f76-4b2e-9a2b-7d9ad3dcf666")
      .send(deleteObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing required field!");
      });
  });

  test("404: Respond with event_id Not Found! when given event_id is not saved", () => {
    const deleteObj = { event_id: 1 };

    return request(app)
      .delete("/api/saved_events/c7b1f840-6f76-4b2e-9a2b-7d9ad3dcf666")
      .send(deleteObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("event_id Not Found!");
      });
  });

  test("404: Respond with user_id Not Found! when given user_id is not in the database", () => {
    const deleteObj = { event_id: 15 };

    return request(app)
      .delete("/api/saved_events/c7b1f840-6f76-4b2e-9a2b-7d9ad3dcf256")
      .send(deleteObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("user_id Not Found!");
      });
  });

  test("400: Respond with Invalid user_id format! when given user_id is not a valid UUID", () => {
    const deleteObj = { event_id: 15 };

    return request(app)
      .delete("/api/saved_events/NotValidId")
      .send(deleteObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid user_id format!");
      });
  });
});
