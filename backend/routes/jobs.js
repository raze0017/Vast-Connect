const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create a new job
router.post("/", async (req, res) => {
  try {
    const { title, description, company, location, salary, authorId } =
      req.body;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        salary,
        authorId,
      },
    });

    res.status(201).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create job", details: error.message });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get a single job by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) return res.status(404).json({ error: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// Update a job
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, company, location, salary } = req.body;

    const job = await prisma.job.update({
      where: { id },
      data: { title, description, company, location, salary },
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

// Delete a job
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.job.delete({ where: { id } });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

module.exports = router;
