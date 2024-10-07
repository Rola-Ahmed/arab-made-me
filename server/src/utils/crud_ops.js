import jwt from "jsonwebtoken";
import { asyncHandler } from "./error_handling.js";
import { searchFiltering } from "./search/api_features.js";
import { sendMail } from "./email.js";
import fs from "fs";
import { deleteFiles } from "./delete_files.js";

const getAll = (Model) => {
  return asyncHandler(async (req, res, nxt) => {
    const page = parseInt(req.query.page, 10) || 10; // Default to page 1
    const limit = parseInt(req.query.size, 10) || 10; // Default limit to 10

    const searchFilters = searchFiltering(req.query);
    let model = Model.name.toLowerCase();
    const docs = await Model.findAll({
      where: searchFilters.whereConditions,
      offset: searchFilters.offset,
      limit: searchFilters.limit,
      order:
        searchFilters.order.length > 0
          ? searchFilters.order
          : [["createdAt", "DESC"]],
      include: req.query.include,
    });

    // Get total count of products that match the filters
    const totalData = await Model.count({
      where: searchFilters.whereConditions,
    });

    return res.status(200).json({
      message: "done",
      [model]: docs,
      pagination: {
        totalData,
        totalPages: Math.ceil(totalData / limit),
        currentPage: page,
      },
    });
  });
};

const getAllForFactory = (Model, returner) => {
  return asyncHandler(async (req, res, nxt) => {
    const { id } = req.params;
    const searchFilters = searchFiltering(req.query);
    const page = parseInt(req.query.page, 10); // Default to page 1
    const limit = parseInt(req.query.size, 10); // Default limit to 10
    const offset = (page - 1) * limit; // Offset calculation

    searchFilters.whereConditions.push({ factoryId: req.factory.id });
    const data = await Model.findAll({
      where: searchFilters.whereConditions,
      offset,
      limit,
      order: searchFilters.order,
      include: req.query.include || "factory",
    });

    // Get total count of products that match the filters
    const totalData = await Model.count({
      where: searchFilters.whereConditions,
    });
    const totalPages = Math.ceil(totalData / limit);

    return res.status(200).json({
      message: "done",
      [returner]: data,

      pagination: {
        totalData,
        totalPages,
        currentPage: page,
      },
    });
  });
};

const getAllForImporter = (Model, returner) => {
  return asyncHandler(async (req, res, nxt) => {
    const { id } = req.params;
    const searchFilters = searchFiltering(req.query);

    searchFilters.whereConditions.push({ importerId: req.importer.id });
    const data = await Model.findAll({
      where: searchFilters.whereConditions,
      offset: searchFilters.offset,
      limit: searchFilters.limit,
      order: searchFilters.order,
      include: req.query.include || "importer",
    });

    return res.status(200).json({ message: "done", [returner]: data });
  });
};

const getOne = (Model) => {
  return asyncHandler(async (req, res, nxt) => {
    let model = Model.name.toLowerCase();
    const { id } = req.params;
    const doc = await Model.findByPk(id, { include: req.query.include });
    if (!doc) return res.status(400).json({ message: `${model} not found` });
    return res.status(200).json({ message: "done", [model]: doc });
  });
};

const addModel = (Model, _uniqueConstraint) => {
  return asyncHandler(async (req, res, nxt) => {
    if (_uniqueConstraint) {
      const doc = await Model.findOne({
        where: { [_uniqueConstraint]: req.body._uniqueConstraint },
      });
      if (doc) return res.json({ message: `${_uniqueConstraint} exists` });
    }
    const doc = await Model.create(req.body);
    if (!doc) return res.status(400).json({ message: `${model} not created` });
    const model = Model.name.toLowerCase();
    return res.status(201).json({ message: "done", [model]: doc });
  });
};

const deleteModel = (Model, types) => {
  return asyncHandler(async (req, res, nxt) => {
    const model = Model.name.toLowerCase();
    const { id } = req.params;
    if (types) deleteFiles(req, await Model.findByPk(id), types, true, true);
    const doc = await Model.destroy({ where: { id } });
    if (!doc) return res.status(400).json({ message: `${model} not found` });

    return res.status(200).json({ message: "done" });
  });
};

const updateModel = (Model) => {
  return asyncHandler(async (req, res, nxt) => {
    const model = Model.name.toLowerCase();
    const { id } = req.params;
    const doc = await Model.findByPk(id);
    if (!doc) return res.status(400).json({ message: `${model} not found` });

    await doc.update(req.body);
    return res.status(202).json({ message: "done", [model]: doc });
  });
};

const deleteFromReq = (model, types) => {
  return asyncHandler(async (req, res, nxt) => {
    if (types) deleteFiles(req, model, types, true, false);

    await req[model].destroy();

    return res.status(200).json({ message: "done" });
  });
};

const updateFromReq = (model) => {
  return asyncHandler(async (req, res, nxt) => {
    await req[model].update(req.body);
    return res.status(200).json({ message: "done", [model]: req[model] });
  });
};

const uploadMedia = (model, types) => {
  return asyncHandler(async (req, res, nxt) => {
    deleteFiles(req, model, types, false, false);

    await req[model].update(req.files);
    return res.status(202).json({ message: "done", [model]: req[model] });
  });
};
const deleteOneInMedia = (Model, reqModel, columnName) => {
  return asyncHandler(async (req, res, nxt) => {
    let model = req[reqModel];

    // If the model does not exist, return an error
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    // Get the column name from the request body
    // const { columnName } = req.body;
    // console.log("req.body", req.body);

    // Set the specified column to null
    let updateData = {};
    updateData[columnName] = null;

    // Update the model in the database by setting the column to null
    await Model.update(updateData, { where: { id: model.id } });

    return res.status(202).json({
      message: `done`,
      [reqModel]: await Model.findByPk(model.id),
    });
  });
};

const updateOneInMedia = (Model, reqModel, arr, max) => {
  return asyncHandler(async (req, res, nxt) => {
    let model = req[reqModel];

    let modelArr = model[arr];

    let docs = req.files[arr];

    let { index } = req.body;
    if (index >= max) {
      return res.status(400).json({ message: `maximum files is ${max}` });
    }

    if (docs && index) {
      if (fs.existsSync(modelArr[index])) {
        fs.unlink(modelArr[index], (error) => {
          if (error) console.log("error");
          else console.log("deleted");
        });
      }

      modelArr[index] = docs[0].finalPath;
      let updatedDocs = [];
      modelArr.forEach((element) => {
        updatedDocs.push({ finalPath: element });
      });

      req.files[arr] = updatedDocs;
      await Model.update(req.files, { where: { id: model.id } });
      return res
        .status(202)
        .json({ message: "done", [reqModel]: await Model.findByPk(model.id) });
    } else if (index) {
      if (fs.existsSync(modelArr[index])) {
        fs.unlink(modelArr[index], (error) => {
          if (error) console.log("error");
          else console.log("deleted");
        });
      }

      let updatedDocs = [];
      let c = 0;
      for (let indexx = 0; indexx < modelArr.length; indexx++) {
        if (indexx == index) continue;
        updatedDocs[c] = { finalPath: modelArr[indexx] };
        c++;
      }
      console.log(updatedDocs);
      req.files[arr] = updatedDocs;
      console.log(req.files);
      await Model.update(req.files, { where: { id: model.id } });
      return res
        .status(202)
        .json({ message: "done", [reqModel]: await Model.findByPk(model.id) });
    } else {
      return res.status(400).json({ message: "no doc selected" });
    }
  });
};
export const confirmEmail = (Model, name) => {
  return asyncHandler(async (req, res, nxt) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    const model = await Model.update(
      { emailActivated: true },
      { where: { id: decoded.id }, returning: true }
    );
    if (!model) return res.status(400).json({ message: `${name} not found` });
    return res.status(202).json({ message: "done" });
  });
};

export const resendConfirmationMail = (Model, name, path, email) => {
  return asyncHandler(async (req, res, nxt) => {
    const { id } = req.params;

    const model = await Model.findByPk(id);
    if (!model) return res.json({ message: `${name} not found` });
    if (model.emailActivated)
      return res.status(400).json({ messgae: "email activated" });

    const newToken = jwt.sign(
      {
        id: model.id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5 m" }
    );

    await sendMail({
      to: model[email],
      subject: "New Confirmation Email",
      html: `<a href="${req.protocol}://${req.hostname}/${path}${newToken}">Confirm Accaount</a>`,
    });
    return res.status(200).json({ message: "done,check your email" });
  });
};

export const updateOneLegalDoc = (Model, object) => {
  return asyncHandler(async (req, res, nxt) => {
    const id = req[object].id;
    object = req[object];
    const legalDocsArr = object.legalDocs;
    const { legalDocs } = req.files;
    const { legalDocsIndex } = req.body;
    console.log(req.files);
    console.log(legalDocs);
    console.log(legalDocsIndex);

    if (legalDocsIndex >= 8) {
      return res.json({ message: "Maximum docs is 8" });
    }

    if (legalDocs && legalDocsIndex) {
      console.log("here 1");
      legalDocsArr[legalDocsIndex] = legalDocs[0].finalPath;
      let updatedLegalDocs = [];
      legalDocsArr.forEach((element) => {
        updatedLegalDocs.push({ finalPath: element });
      });

      await Model.update({ legalDocs: updatedLegalDocs }, { where: { id } });
      const f = await Model.findByPk(id);
      return res.json({ message: "done", object: f });
    } else if (legalDocsIndex) {
      console.log("here 2");
      let updatedLegalDocs = [];
      let c = 0;
      for (let indexx = 0; indexx < legalDocsArr.length; indexx++) {
        if (indexx == legalDocsIndex) continue;
        updatedLegalDocs[c] = { finalPath: legalDocsArr[indexx] };
        c++;
      }

      await Model.update({ legalDocs: updatedLegalDocs }, { where: { id } });
      const f = await Model.findByPk(id);
      return res.json({ message: "done", object: f });
    } else {
      return res.json({ message: "no doc selected" });
    }
  });
};

export const crudOps = {
  getAll,
  getOne,
  addModel,
  deleteModel,
  updateModel,
  uploadMedia,
  deleteFromReq,
  updateOneInMedia,
  updateFromReq,
  updateOneInMedia,
  confirmEmail,
  resendConfirmationMail,
  updateOneLegalDoc,
  getAllForFactory,
  getAllForImporter,
  deleteOneInMedia,
};
