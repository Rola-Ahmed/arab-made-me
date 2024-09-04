import { Op } from "sequelize";
import { sequelize } from "../../database/connection.js";





export const getFormsFilter = (filter) => {
    if (filter) {
        return {
            [Op.or]: [
                sequelize.where(sequelize.fn('LOWER', sequelize.col('productName')), 'LIKE', sequelize.fn('LOWER', `%${filter}%`)),
            ],
        };
    }
    return null;

}




