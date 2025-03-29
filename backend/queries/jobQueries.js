const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getJobsByEmployer(employerId) {
  try {
    return await prisma.job.findMany({
      where: { authorId: employerId },
    });
  } catch (error) {
    console.error("Error fetching jobs by employer:", error);
    throw new Error("Could not retrieve jobs");
  }
}

module.exports = { getJobsByEmployer };
