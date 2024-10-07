import { Op } from "sequelize";
import { Product } from "../../database/models/product.model.js";
import { searchFiltering } from "../../utils/search/api_features.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import { Factory } from "../../database/models/factory.model.js";
import { sequelize } from "../../database/connection.js";

export const addProduct = asyncHandler(async (req, res, nxt) => {
  const factoryId = req.factory.id;
  const product = await Product.create({ ...req.body, factoryId });
  return res.status(201).json({ message: "done", product });
});

export const getProducts = asyncHandler(async (req, res, nxt) => {
  // Initialize filter for name and description search
  let filter;


  // Initialize search filters from the request query
  const searchFilters = searchFiltering(req.query);
  const { sectors, location ,include} = req.query;

  // Parse sectors into an array if present
  let sectorsArr = [];
  if (sectors) {
    sectorsArr = sectors.split(",").map((sector) => sector.trim());
  }
  

  // Build the SQL query dynamically
  // let sqlQuery = `
  //   SELECT "products".*, "factories"."sectorId", "factories"."country","factories"."city"
  //   FROM "products"
  //   JOIN "factories" ON "factories"."id" = "products"."factoryId"
  // `;

  let sqlQuery = `
  SELECT 
    "products".*,
    json_build_object(
      'sectorId', "factories"."sectorId",
      'country', "factories"."country",
      'city', "factories"."city",
      'name', "factories"."name",
      'coverImage', "factories"."coverImage"
    ) AS factory
  FROM "products"
  JOIN "factories" ON "factories"."id" = "products"."factoryId"
`;

  // if(include=='factory'){
    
  // }

  // console.log("req.query.filter",req.query.filter)
  if (req.query.filter) {
    const filterValue = req.query.filter.toLowerCase();
    console.log("filterValue",req.query.filter,filterValue)
    sqlQuery += ` WHERE LOWER("products"."name") LIKE '%${filterValue}%' OR LOWER("products"."description") LIKE '%${filterValue}%'`;
  }

  if (location) {
    // If the previous WHERE condition exists, use AND; otherwise, use WHERE
    sqlQuery += req.query.filter
      ? ` AND LOWER("factories"."country") = LOWER('${location}')`
      : ` WHERE LOWER("factories"."country") = LOWER('${location}')`;
  }

  // Handle the sectors filter
  if (sectorsArr.length > 0) {
    // Adjust WHERE condition based on existing filters
    sqlQuery +=
      req.query.filter || location
        ? ` AND "factories"."sectorId" IN (${sectors})`
        : ` WHERE "factories"."sectorId" IN (${sectors})`;
  }

  console.log("Executing SQL Query: ", sqlQuery);

  // Fetch products based on the constructed SQL query
  const [productss] = await sequelize.query(sqlQuery);

  console.log("Filtered Products: ", productss);

  // Pagination setup
  const page = parseInt(req.query.page, 10) || 1; // Default to page 1
  const limit = parseInt(req.query.size, 10) || 10; // Default limit to 10
  const offset = (page - 1) * limit; // Calculate offset for pagination

  // Slice the products for pagination
  const paginatedProducts = productss.slice(offset, offset + limit);

  // Get total count of products that match the filters
  const totalProducts = productss.length; // Total count after filtering

  // Send response back to client
  return res.status(200).json({
    message: "done",
    products: paginatedProducts,
    pagination: {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    },
  });
});

export const getProduct = crudOps.getOne(Product);

export const uploadMedia = crudOps.uploadMedia("product", {
  images: "array",
  coverImage: "file",
  coverVideo: "file",
});

export const updateProduct = crudOps.updateModel(Product);

export const updateOneImage = crudOps.updateOneInMedia(
  Product,
  "product",
  "images",
  8
);

export const deleteOneMedia = crudOps.deleteOneInMedia(
  Product,
  "product",
  "coverVideo",
  1
);
export const deleteProduct = crudOps.deleteModel(Product, {
  images: "array",
  coverImage: "file",
  coverVideo: "file",
});
export const updateFromAdmin = crudOps.updateModel(Product);
