const express = require('express');

const router = new express.Router();
const Products = require('../models/ProductSchema');
const User = require('../models/userSchema');

const bcryptjs = require('bcryptjs');
const authanticate = require('../middleware/Authanticate');

// get productsdata api

router.get('/getproducts', async (req, resp) => {
    try {
        const productdata = await Products.find();

        // console.log("db data : "+productdata);
        resp.status(201).json(productdata);

    }
    catch (error) {

        console.log("error" + error.message);

    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})


// get individual data

router.get('/getproductsone/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        // or const id = req.params.id;

        // console.log(id);

        const individualdata = await Products.findOne({ id: id });
        // console.log(individualdata);

        resp.status(201).json(individualdata);


    } catch (error) {
        resp.status(400).json(individualdata);
        console.log("error" + error.message);

    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})

// register user

router.post('/register', async (req, resp) => {
    // console.log(req.body);
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        resp.status(422).json({ error: "filll the all details" });
        console.log("bhai nathi present badhi details");
    };

    try {

        const preuser = await User.findOne({ email: email });

        if (preuser) {
            resp.status(422).json({ error: "This email is already exist" });
        } else if (password !== cpassword) {
            resp.status(422).json({ error: "password are not matching" });;
        } else {

            const finaluser = new User({
                fname, email, mobile, password, cpassword
            });

            // hash password before save data into db

            const storedata = await finaluser.save();
            // console.log(storedata + "user successfully added");
            resp.status(201).json(storedata);
        }

    } catch (error) {
        console.log("error the bhai catch ma for registratoin time" + error.message);
        resp.status(422).send(error);
    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})

// login user 

router.post("/login", async (req, resp) => {

    const { email, password } = req.body;

    if (!email || !password) {
        resp.status(400).json({ error: "fill all the data" })
    }

    try {

        const loginUser = await User.findOne({ email: email });
        // console.log(loginUser + 'user details');


        if (loginUser) {
            const isMatch = await bcryptjs.compare(password, loginUser.password);
            // console.log(isMatch);

            //  token generate process



            if (!isMatch) {
                resp.status(400).json({ error: "invalid details" })
            }
            else {
                const token = await loginUser.generateAuthtoken();
                // console.log("token value" + token);

                resp.cookie("Amazonweb", token, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                })
                resp.status(201).json(loginUser)
            }
        }
        else {
            resp.status(400).json({ error: "invalid details" })
        }

    } catch (error) {
        resp.status(400).json({ error: "invalid details" })

    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})

// add data into cart

router.post('/addtocart/:id', authanticate, async (req, resp) => {
    try {
        const { id } = req.params;

        const cart = await Products.findOne({ id: id });
        // console.log("cart value : " + cart);

        const userContact = await User.findOne({ _id: req.userID });
        // console.log("user contact : ",userContact);

        if (userContact) {
            const cartData = await userContact.addtocartdata(cart);
            await userContact.save();

            // console.log(cartData);

            resp.status(201).json(userContact);

        }
        else {
            resp.status(401).json({ error: "invalid user" });

        }

    } catch (error) {
        resp.status(401).json({ error: "invalid user" });
    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})

// get carts details 

router.get('/cartdetails', authanticate, async (req, resp) => {
    try {
        const cartuser = await User.findOne({ _id: req.userID })

        resp.status(201).json(cartuser);

    } catch (error) {
        console.log("error", +error)
    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})


// get valid user

router.get('/validuser', authanticate, async (req, resp) => {
    try {
        const validuserone = await User.findOne({ _id: req.userID })

        resp.status(201).json(validuserone);

    } catch (error) {
        console.log("error", +error)
    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})

// remove item from cart 

router.delete('/remove/:id', authanticate, async (req, resp) => {
    try {

        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((cartval) => {
            return cartval.id != id

        })

        req.rootUser.save();

        resp.status(201).json(req.rootUser);
        console.log("removed item");
    } catch (error) {
        console.log("error in remove")
        resp.status(400).json({ error: "error in removing" })
    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');

})

//logout user 

router.get('/logout', authanticate, async (req, resp) => {
    try {

        req.rootUser.tokens = req.rootUser.tokens.filter((currele) => {
            return currele.token !== req.token
        })

        resp.clearCookie('Amazonweb', { path: '/' });

        req.rootUser.save();

        resp.status(201).json(req.rootUser.tokens);
        console.log("user logout");

    } catch (error) {

        console.log("error in logout");
    }

    resp.setHeader('Access-Control-Allow-Origin', 'https://verdant-sprite-6a61c6.netlify.app');
    resp.setHeader('Access-Control-Allow-Credentials', 'true');
})



module.exports = router;

