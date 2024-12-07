const { query } = require("express");
const db = require("../../config/db");

class cartModel {
    static async getCartId(touristId) {
        try {
            const query = `select cart_id from carts where tourist_id = $1`;
            const result = await db.query(query, [touristId]);
            if (result.rows.length > 0) {
                return result.rows[0].cart_id;
            }
            return null;
        } catch (error) {
            console.error("Error inserting cart item in cartModel: ", error);
            throw new Error("Error getting cart ID in cartModel");
        }
    }
    static async checkExistsCartItem(cartId, tourId, detailTourId) {
        try {
            const query = ` select exists (select 1 from cart_items where cart_id = $1 and tour_id = $2 and detail_tour_id = $3)
             as exists;`;
            const result = await db.query(query, [cartId, tourId, detailTourId]);
            return result.rows[0].exists ? true : false;
        } catch (error) {
            console.error("Error checking existence of cart item in cartModel: ", error);
            throw new Error("Error checking existence of cart item in cartModel: ");
        }

    }

    static async insertCartItem(cartId, tourId, detailTourId, quantity) {
        try {
            const query = `INSERT INTO cart_items (cart_id, tour_id, detail_tour_id, quantity)
                           VALUES ($1, $2, $3, $4)`;
            await db.query(query, [cartId, tourId, detailTourId, quantity]);
        } catch (error) {
            console.error("Error inserting cart item in cartModel: ", error);
            throw new Error("Error inserting cart item in cartModel: ");
        }
    }

    static async increaseCartItemQuantity(cartId, tourId, detailTourId, quantity) {
        try {
            const query = `
            UPDATE cart_items
            SET quantity = quantity + $4
            WHERE cart_id = $1 AND tour_id = $2 AND detail_tour_id = $3
        `;
            await db.query(query, [cartId, tourId, detailTourId, quantity]);
        } catch (error) {
            console.error("Error increasing cart item quantity in cartModel:", error);
            throw new Error("Error increasing cart item quantity in cartModel.");
        }
    }

    static async getItemCounts(cartId) {
        try {
            const query = `select items_count from carts where cart_id = $1`;
            const result = await db.query(query, [cartId]);
            if (result.rows.length > 0) {
                return result.rows[0].items_count;
            }
            return 0;
        } catch {
            console.error("Error getItemCounts in cartModel:", error);
            throw new Error("Error getItemCounts in cartModel.");
        }
    }

    static async getCartItems(cartId) {
        try {
            const query = `
            select
                c_i.tour_id,
                c_i.detail_tour_id,
                c_i.quantity,
                c_i.updated_at,
                dt.status,
                dt.tour_date,
                greatest(dt.max_quantity - dt.booked_quantity, 0) as available_quantity,
                t.title,
                t.prices,
                t.rate,
                ti.img_url as first_image
            from
                cart_items c_i
            join
                detail_tours dt on dt.tour_id = c_i.tour_id and dt.detail_tour_id = c_i.detail_tour_id
            join
                tours t on t.tour_id = c_i.tour_id
            left join
                (
                    select tour_id, img_url
                    from (
                        select tour_id, img_url, row_number() over (partition by tour_id order by img_url) as rn
                        from tour_images
                    ) subquery
                    where rn = 1
                ) ti
                on ti.tour_id = t.tour_id
            where
                c_i.cart_id = $1;
            `;
            const result = await db.query(query, [cartId]);
            if (result.rows.length > 0) {
                return result.rows.map(row => ({
                    tourId: row.tour_id,
                    scheduleId: row.detail_tour_id,
                    quantity: row.quantity,
                    updatedAt: row.updated_at,
                    status: row.status,
                    tourDate: row.tour_date,
                    availableQuantity: row.available_quantity,
                    title: row.title,
                    prices: row.prices,
                    rate: row.rate,
                    firstImage: row.first_image
                }));
            }

            return null;
        }
        catch {
            console.error("Error getCartItems in cartModel:", error);
            throw new Error("Error getCartItems in cartModel.");
        }
    }
}

module.exports = cartModel;
