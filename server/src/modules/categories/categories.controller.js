import { Category } from "../../database/models/category.model.js";
import { Product } from "../../database/models/product.model.js";

import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import { searchFiltering } from "../../utils/search/api_features.js";

export const addCategory = crudOps.addModel(Category)

export const getCategories = crudOps.getAll(Category)

export const getCategory = crudOps.getOne(Category)

export const updateCategory = crudOps.updateModel(Category)

export const deleteCategory = crudOps.deleteModel(Category)

export const productsOfCategory = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.params
        const searchFilters=searchFiltering(req.query)
        searchFilters.whereConditions.push({ categoryId: id })
        const products = await Product.findAll({
            where:searchFilters.whereConditions ,
            offset: searchFilters.offset,
            limit: searchFilters.limit,
            order: searchFilters.order,
            include:req.query.include
        });
        return res.json({ message: "done", products })
    }
)