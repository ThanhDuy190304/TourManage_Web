class Tour {
    #id;
    #title;
    #brief;
    #details;
    #location_id;
    #prices;
    #rate;
    #voucher;
    #img_array;

    constructor(id, title, brief, details, location_id, prices, rate, voucher, img_array) {
        this.#id = id;
        this.#title = title;
        this.#brief = brief;
        this.#details = details;
        this.#location_id = location_id;
        this.#prices = prices;
        this.#rate = rate;
        this.#voucher = voucher;
        this.#img_array = img_array;
    }

    getId() {
        return this.#id;
    }

    getTitle() {
        return this.#title;
    }

    getBrief() {
        return this.#brief;
    }

    getDetails() {
        return this.#details;
    }

    getLocationId() {
        return this.#location_id;
    }

    getPrices() {
        return this.#prices;
    }

    getRate() {
        return this.#rate;
    }

    getVoucher() {
        return this.#voucher;
    }

    getImgArray() {
        return this.#img_array;
    }
}
module.exports = Tour;
