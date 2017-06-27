"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_categories_1 = require("../Database/database.categories");
class Renderer {
    static live(req, res) {
        var pageInfo = {
            pageName: "Live"
        };
        res.render('home', pageInfo);
    }
    static contact(req, res) {
        var pageInfo = {
            pageName: "Contact"
        };
        res.render('contact', pageInfo);
    }
    static stock(req, res) {
        var pageInfo = {
            pageName: "Stock",
            popups: database_categories_1.default.popups
        };
        res.render('stock', pageInfo);
    }
    static product(req, res) {
        var pageInfo = {
            pageName: "Product"
        };
        res.render('Products/product', pageInfo);
    }
}
exports.default = Renderer;
