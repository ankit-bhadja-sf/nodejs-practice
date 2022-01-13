const fs = require('fs')
const path = require('path');
const { threadId } = require('worker_threads');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
    );

const getProductsFromFile = (cb) => {

    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, imageUrl, price, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }
    save()  {
        this.id = Math.random().toString();
        getProductsFromFile(products => {
            if (this.id){
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id 
                );
                const updateProducts = [...products];
                updateProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updateProducts), err => {
                    console.log(err);
                });   
            }
            else{
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
            }
            
        });
    }


    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};