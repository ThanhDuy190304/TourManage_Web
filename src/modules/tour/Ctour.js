class CTour {
    #id;
    #title;
    #brief;
    #details;
    #location_id;
    #prices;
    #rate;
    #voucher;
    #img_array;
    #schedule_array;
    constructor(id, title = null, brief = null, details = null, location_id = null, prices = null, rate = null, voucher = null, img_array = null, schedule_array = null) {
        this.#id = id;
        this.#title = title;
        this.#brief = brief;
        this.#details = details;
        this.#location_id = location_id;
        this.#prices = prices;
        this.#rate = rate;
        this.#voucher = voucher;
        this.#img_array = img_array;
        this.#schedule_array = schedule_array;
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

    getScheduelArray() {
        return this.#schedule_array;
    }

    toJSON() {
        return {
            tour_id: this.getId(),
            title: this.getTitle(),
            brief: this.getBrief(),
            details: this.getDetails(),
            location_id: this.getLocationId(),
            prices: this.getPrices(),
            rate: this.getRate(),
            voucher: this.getVoucher(),
            img_array: this.getImgArray(),
            schedules_tour: this.getScheduelArray()
        };
    }
}
module.exports = CTour;
