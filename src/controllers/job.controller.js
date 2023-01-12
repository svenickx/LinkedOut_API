const Job = require("../models/job_model");

// Créé un nouveau métier
exports.createJob = async (req, res) => {
  const newJob = new Job(req.body);

  newJob
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};
