import { Op } from "sequelize";
import { Product } from "../../database/models/product.model.js";
import { Sector } from "../../database/models/sector.model.js";
import { searchFiltering } from "../../utils/search/api_features.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import { sequelize } from "../../database/connection.js";

import fs from "fs";
export const addSector = crudOps.addModel(Sector);

export const getSectors = crudOps.getAll(Sector);

export const getSector = crudOps.getOne(Sector);

export const updateSector = crudOps.updateModel(Sector);

export const uploadMedia = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const sector = await Sector.update({ ...req.files }, { where: { id } });
  if (!sector) return res.status(400).json({ message: "sector not found" });

  if (fs.existsSync(sector.image)) {
    fs.unlink(sector.image, (error) => {
      if (error) console.log("error");
      else console.log("deleted");
    });
  }
  return res.json({ message: "done", sector: await Sector.findByPk(id) });
});

export const deleteSector = crudOps.deleteModel(Sector);

export const productsOfSector = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const searchFilters = searchFiltering(req.query);
  searchFilters.whereConditions.push({ sectorId: id });
  const products = await Product.findAll({
    where: searchFilters.whereConditions,
    offset: searchFilters.offset,
    limit: searchFilters.limit,
    order:
      searchFilters.order.length > 0
        ? searchFilters.order
        : [["createdAt", "DESC"]],
  });
  return res.json({ message: "done", products });
});

export const productsOfSectors = asyncHandler(async (req, res, nxt) => {
  const { sectors } = req.body;
  const products = await Product.findAll({
    where: {
      sectorId: {
        [Op.in]: sectors,
      },
    },
  });

  return res.json({ message: "done", products });
});

export const getAllWithProductLength = asyncHandler(async (req, res, next) => {
  

  const [sectors] = await sequelize.query(`
    SELECT sectors.id, sectors.name,sectors.image, COUNT(products.id) AS productsCount
    FROM sectors
    LEFT JOIN factories ON factories."sectorId" = sectors.id
    LEFT JOIN products ON products."factoryId" = factories.id
    GROUP BY sectors.id
  `);
  

  return res.status(200).json({
    message: "done",
    sectors: sectors, // Return sectors with the product count
  });
});
