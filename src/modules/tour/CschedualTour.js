class ScheduelTour {
    #ScheduelId;
    #tourId;
    #status;
    #tourDate;
    #available_quantity;

    // Constructor để khởi tạo các giá trị cho các thuộc tính
    constructor(ScheduelId, tourId, status = null, tourDate = null, available_quantity = null) {
        this.#ScheduelId = ScheduelId;
        this.#tourId = tourId;
        this.#status = status;
        this.#tourDate = tourDate;
        this.#available_quantity = available_quantity;
    }

    // Getter cho các thuộc tính
    getscheduelId() {
        return this.#ScheduelId;
    }

    gettourId() {
        return this.#tourId;
    }

    getstatus() {
        return this.#status;
    }

    gettourDate() {
        return this.#tourDate;
    }

    getavailable_quantity() {
        return this.#available_quantity;
    }

}
