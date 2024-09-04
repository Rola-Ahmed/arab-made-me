import { Op } from "sequelize";
import { sequelize } from "../../database/connection.js";

export const getSort = (sort) => {
    if (sort == 'price-ASC') {
        return [['price', 'ASC']];
    }
    if (sort == 'price-DESC') {
        return [['price', 'DESC']];
    }
    if (sort == 'rate') {
        return [['averageRate', 'DESC']];
    }
    if (sort == 'date-ASC') {
        return [['createdAt', 'ASC']]
    }
    if (sort == 'date-DESC') {
        return [['createdAt', 'DESC']]
    }
    return []
}

export const getFilter = (filter) => {
    if (filter) {
        return {
            [Op.or]: [
                sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', sequelize.fn('LOWER', `%${filter}%`)),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), 'LIKE', sequelize.fn('LOWER', `%${filter}%`)),
            ],
        };
    }
    return null;

}

export const getPriceRange = (rangePrice) => {
    if (rangePrice) {
        let ranges = rangePrice.split('-');
        return {
            price: {
                [Op.between]: [ranges[0], ranges[1]],
            },
        };
    }
    return null;
}

export const getSectors=(sectors)=>{
        let sectorsArr
        if(sectors){
            sectorsArr=sectors.split(',')
        }
        if (sectors && sectorsArr != []) {
            return {
                sectorId: {
                    [Op.in]: sectorsArr
                }
            }
        }
        return null
}

export const getLocation = (location) => {
    if (location) {
        return {
            [Op.or]: [
                { country: { [Op.eq]: `${location}` } },
                { city: { [Op.eq]: `${location}` } },
            ],
        };
    }
    return null;
}



export const getHSNCode = (hsnCode) => {
    if (hsnCode) {
        return {
            hsnCode: { [Op.eq]: `${hsnCode}` },
        };
    }
    return null;
}