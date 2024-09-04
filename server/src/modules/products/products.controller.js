import { Op } from "sequelize";
import { Product } from "../../database/models/product.model.js";
import { searchFiltering } from "../../utils/search/api_features.js";
import { crudOps } from "../../utils/crud_ops.js";
import { asyncHandler } from "../../utils/error_handling.js";
import { Factory } from "../../database/models/factory.model.js";
import { sequelize } from "../../database/connection.js";

export const addProduct = asyncHandler(
    async (req, res, nxt) => {
        const factoryId = req.factory.id
        const product = await Product.create({ ...req.body, factoryId })
        return res.status(201).json({ message: "done", product })
    }
)

export const getProducts = asyncHandler(
    async (req, res, nxt) => {
        let filter
        if (req.query.filter) {
            filter = {
                [Op.or]: [
                    sequelize.where(sequelize.fn('LOWER', sequelize.col('products.name')), 'LIKE', sequelize.fn('LOWER', `%${req.query.filter}%`)),
                    sequelize.where(sequelize.fn('LOWER', sequelize.col('products.description')), 'LIKE', sequelize.fn('LOWER', `%${req.query.filter}%`)),
                ],
            };
            req.query.filter = null
        }
        const searchFilters = searchFiltering(req.query)

        const { sectors } = req.query
        let sectorsArr
        if(sectors){
            sectorsArr=sectors.split(',')
        }

        if (sectors && sectorsArr != []) {
            searchFilters.whereConditions.push({
                sectorId: {
                    [Op.in]: sectorsArr
                }
            })
        }


        // for resolving sequelize issues of same attributes in product and factory 

        if (filter) {
            searchFilters.whereConditions.push(filter)
        }
        console.log(searchFilters.whereConditions);
        const products = await Product.findAll({
            where: searchFilters.whereConditions,
            offset: searchFilters.offset,
            limit: searchFilters.limit,
            order: searchFilters.order.length > 0 ? searchFilters.order : [['createdAt', 'DESC']],
            include: ["factory","sector"]
        });

        return res.status(200).json({ message: "done", products })
    }
)

export const getProduct = crudOps.getOne(Product)

export const uploadMedia = crudOps.uploadMedia('product', { 'images': 'array', 'coverImage': 'file' })

export const updateProduct = crudOps.updateModel(Product)

export const updateOneImage = crudOps.updateOneInMedia(Product, 'product', 'images', 8)


export const deleteProduct = crudOps.deleteModel(Product, { 'images': 'array', 'coverImage': 'file' })
export const updateFromAdmin = crudOps.updateModel(Product)
