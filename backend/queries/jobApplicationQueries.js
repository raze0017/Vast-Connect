const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function createApplication(username, jobId) {
  // Find user ID by username
  const user = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Create job application
  return await db.jobApplication.create({
    data: {
      applicantId: user.id, // Use the fetched ID
      jobId,
    },
  });
}

module.exports = { createApplication };
