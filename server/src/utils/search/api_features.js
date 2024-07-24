import { getFilter, getHSNCode, getLocation, getPriceRange, getSort } from "./search_functions.js";
import { getSourcingFilter, getSourcingLocation } from "./search_sourcing_hub.js";
import { getFormsFilter } from "./search_forms.js";


export const searchFiltering = (queryParams) => {
   
    const { page, size, sort, filter, rangePrice, location, sourcingFilter, sourcingLocation, formsFilter, hsnCode } = queryParams;

    const offset = ((page || 1) - 1) * (size || 6);

     const searchFilters={
        offset,
        limit:size,
        order:getSort(sort),
        whereConditions:[
            getSourcingFilter(sourcingFilter),
            getFilter(filter),
            getLocation(location),
            getSourcingLocation(sourcingLocation),
            getPriceRange(rangePrice),
            getFormsFilter(formsFilter),
            getHSNCode(hsnCode)
        ].filter(Boolean)
    }
   

    return searchFilters;
};







 //console.log(searchFilters.whereConditions);
    // searchFilters.offset = offset;
    // searchFilters.limit = size || null;

    // searchFilters.order = [];
    // if (sort === 'price-ASC') {
    //     searchFilters.order.push(['price', 'ASC']);
    // }
    // if (sort == 'price-DESC') {
    //     searchFilters.order.push(['price', 'DESC']);
    // }
    // if (sort === 'rate') {
    //     searchFilters.order.push(['rate', 'DESC']);
    // }

    // searchFilters.whereConditions = [];
    // if (filter) {
    //     searchFilters.whereConditions.push({
    //         [Op.or]: [
    //             sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', sequelize.fn('LOWER', `%${filter}%`)),
    //             sequelize.where(sequelize.fn('LOWER', sequelize.col('description')), 'LIKE', sequelize.fn('LOWER', `%${filter}%`)),
    //         ],
    //     });

    // }

    // if (sourcingFilter) {
    //     searchFilters.whereConditions.push({
    //         [Op.or]: [
    //             sequelize.where(sequelize.fn('LOWER', sequelize.col('productName')), 'LIKE', sequelize.fn('LOWER', `%${sourcingFilter}%`)),
    //             sequelize.where(sequelize.fn('LOWER', sequelize.col('productDescription')), 'LIKE', sequelize.fn('LOWER', `%${sourcingFilter}%`)),
    //         ],
    //     });
    // }

    // if (location) {
    //     searchFilters.whereConditions.push({
    //         [Op.or]: [
    //             { country: { [Op.eq]: `${location}` } },
    //             { city: { [Op.eq]: `${location}` } },
    //         ],
    //     });
    // }

    // if (sourcingLocation) {
    //     searchFilters.whereConditions.push({
    //         preferredCountries: { [Op.contains]: [`${sourcingLocation}`] }
    //     });
    // }
    // if (rangePrice) {
    //     let ranges = rangePrice.split('-');
    //     searchFilters.whereConditions.push({
    //         price: {
    //             [Op.between]: [ranges[0], ranges[1]],
    //         },
    //     });
    // }