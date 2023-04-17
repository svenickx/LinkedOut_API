const Job = require("../models/job_model");

//#region Gestion des métiers

exports.createJob = async (req, res) => {
  const newJob = new Job(req.body);

  newJob
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

exports.updateJob = async (req, res) => {
  Job.findOneAndUpdate(
    { name: req.body.name },
    { name: req.body.newName },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Le métier ${req.body.name} n'a pas été trouvé`,
        });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};

exports.deleteJob = async (req, res) => {
  Job.findOneAndDelete({ name: req.body.name })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `La métier ${req.body.name} n'a pas été trouvé`,
        });
      }
      res.status(200).send({ message: "le métier a bien été supprimé" });
    })
    .catch((err) => res.status(400).send(err));
};

exports.getJobs = async (req, res) => {
  const limit = 10;
  const skip = req.query.page * limit;
  Job.find({}, {}, { skip, limit })
    .then((data) => {
      if (data.length <= 0) {
        return res
          .status(404)
          .send({ message: "Aucun métier trouvé à cette page" });
      }
      res.status(200).send(data.map((j) => j.name.toUpperCase()));
    })
    .catch((err) => res.status(400).send(err));
};

//#endregion
