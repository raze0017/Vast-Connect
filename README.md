#  Vast-Connect

A **social media web application** designed specifically for college students to **connect, network, share job postings, and engage in discussions**. The platform enables students and faculty to interact, apply for internships, and collaborate on projects.

## Features

### User Authentication

- Secure **sign-up and login system** using JWT authentication.
- Password encryption with **bcrypt**.
- Role-based access for **students and faculty**.

### User Profiles

- Users can **create, edit, and update** their profiles.
- Profiles display **bio, skills, education, and posts**.

### Posts & Discussions

- Users can **create, like, and comment** on posts.
- Faculty can **share important updates** and opportunities.

### Job Posting System

- Employers and faculty can **post job/internship opportunities**.
- Students can **apply for positions** through the platform.

### Notifications

- Real-time notifications for **post likes, comments, job offers**, etc.

### Friend Requests & Messaging

- Users can **send friend requests and connect** with others.
- Private messaging feature for **one-on-one conversations**.

## Tech Stack

### Frontend

- **React.js** - UI development
- **Tailwind CSS** - Styling framework
- **shadcn** - UI components

### Backend

- **Node.js** - Server-side logic
- **Express.js** - API framework
- **PostgreSQL** - Database for storing user data, posts, and jobs, using Prisma as the ORM
- **JWT & bcrypt** - Secure authentication

### Other Tools

- **Git & GitHub** - Version control
- **Postman** - API testing
- **Vercel** - Deployment for frontend
- **Render** - Deployment for backend

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+)
- **PostgreSQL**
- **Git**

### Clone Repository

```sh
 git clone https://github.com/raze0017/Vast-Connect.git
 cd Vast-Connect
```

### Backend Setup

```sh
 cd backend
 npm install
```

#### Create a **.env** file in the backend folder and add:

```
DATABASE_URL=your_postgresql_uri
JWT_SECRET=your_secret_key
PORT=5000
```

#### Start Server

```sh
 npm start
```

### Frontend Setup

```sh
 cd ../frontend
 npm install
```

#### Start Frontend

```sh
 npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Authenticate user

### User Management

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Posts

- `POST /api/posts` - Create new post
- `GET /api/posts` - Fetch all posts
- `PUT /api/posts/:id/like` - Like a post

### Jobs

- `POST /api/jobs` - Post a job
- `GET /api/jobs` - Fetch all job listings
- `POST /api/jobs/:id/apply` - Apply for a job

## Deployment

### Frontend

- Build the React app:

```sh
 npm run build
```

- Deploy to **Vercel/Netlify**

### Backend

- Deploy to **Render/Heroku**
- Ensure environment variables are set in the hosting provider

## Contributing

We would appreciate If you would like to contribute to this project, as this is an open source project so please follow the steps.

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature-name`)
3. **Commit** your changes (`git commit -m 'Add feature'`)
4. **Push** to your fork (`git push origin feature-name`)
5. Open a **pull request**

## License

This project is licensed under the **MIT License**.

---

## Contact

For any issues or contributions, reach out to:

- **Email:** [appurazeem2000@gmail.com](mailto:appurazeem2000@gmail.com)
- **GitHub:** [@raze0017](https://github.com/raze0017)
- **LinkedIn:** [Profile](https://www.linkedin.com/in/abdulrahmanrazeemvs/)

### Credits

This project is based on the foundational code from: [https://github.com/HarryAhnHS/flexor-front-end](https://github.com/HarryAhnHS/flexor-front-end).

Additional contributions:

- **Tailored to University Students**, Adapted from a generic social media app to account for a real world solution.
- **Implemented user role selection**, allowing students and faculty to have distinct functionalities.
- **Developed a job posting feature**, where students can browse and apply for internships and part-time jobs.
- Planning to add more features in the future.
