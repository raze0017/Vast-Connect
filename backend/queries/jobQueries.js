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
async function getApplicantsByJob(jobId) {
  return await prisma.jobApplication.findMany({
    where: { jobId },
    include: {
      applicant: {
        select: { id: true, username: true, email: true }, // Select only necessary fields
      },
    },
  });
}

module.exports = { getJobsByEmployer, getApplicantsByJob };
