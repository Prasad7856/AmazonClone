const productData = require('./constant/ProductData');
const Products = require('./models/ProductSchema');

const DefaultData = async () => {
    try {

        await Products.deleteMany({});
        
        const storeData = await Products.insertMany(productData);
        // console.log(storeData);

    }
    catch(error) {
        console.log("error" + error.message);


    }
}

module.exports = DefaultData;
