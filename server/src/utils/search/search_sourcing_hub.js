import { Op } from "sequelize";
import { sequelize } from "../../database/connection.js";

export const getSourcingFilter = (sourcingFilter) => {
    if (sourcingFilter) {
        return {
            [Op.or]: [
                sequelize.where(sequelize.fn('LOWER', sequelize.col('productName')), 'LIKE', sequelize.fn('LOWER', `%${sourcingFilter}%`)),
                sequelize.where(sequelize.fn('LOWER', sequelize.col('productDescription')), 'LIKE', sequelize.fn('LOWER', `%${sourcingFilter}%`)),
            ],
        };
    }
    return null;
}

export const getSourcingLocation = (sourcingLocation) => {
    if (sourcingLocation) {
        return {
            preferredCountries: { [Op.contains]: [`${sourcingLocation}`] }
        };
    }
    return null;
}