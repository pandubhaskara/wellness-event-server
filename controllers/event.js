const { events, users } = require("../models")
const { Op } = require("sequelize");

module.exports = {
    dashboard: async (req, res) => {
        const user = req.user
        try {
            const data = await events.findAll({
                where: {
                    [Op.or]: [
                        { vendor_id: user.id },
                        { company_id: user.id }
                    ]
                },
                include: [
                    {
                        model: users,
                        as: "Company",
                        attributes: ["name"],
                    },
                    {
                        model: users,
                        as: "Vendor",
                        attributes: ["name"],
                    }
                ],
            })
            if (data.length == 0) {
                return res.status(400).json({
                    status: "failed",
                    message: "No data",
                    data: null
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Success get the data",
                data: data
            })
        }
        catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
                data: null,
            })
        }
    },
    proposeEvent: async (req, res) => {
        const body = req.body;
        const user = req.user;
        const place = body.map((x) => x.place)
        const date = body.map((x) => x.date)
        const vendor_id = body.map((x) => x.vendor_id)
        const data = [];
        for (var i = 0; i < body.length; i++) {
            data.push({
                company_id: user.id,
                date: date[i],
                place: place[i],
                vendor_id: vendor_id[i],
                status: "pending"
            });
        }
        try {
            const check = await events.bulkCreate(data);

            if (!check) {
                return res.status(400).json({
                    status: "failed",
                    message: "Unable to save the data to database",
                    data: null
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Successfully saved to database",
                data: check,
            });
        }
        catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
                data: null,
            })
        }
    },
    approveEvent: async (req, res) => {
        const body = req.body
        const user = req.user
        try {
            if (user.role == "company") {
                return res.status(400).send({
                    status: "failed",
                    message: "not allowed"
                })
            }


            const approve = await events.update(
                {
                    status: "approved"
                },
                {
                    where: {
                        place: body.place,
                        date: body.date,
                        vendor_id: user.id,
                        company_id: body.company_id
                    },
                },
            );

            const reject = await events.update(
                {
                    status: "rejected"
                },
                {
                    where: {
                        place: body.place,
                        vendor_id: user.id,
                        company_id: body.company_id,
                        status: "pending"
                    },
                }
            )
            const data = await events.findAll({
                vendor_id: user.id,
                place: body.place
            })
            return res.status(200).json({
                status: "success",
                message: "Successfully approved",
                data: data,
            });
        } catch {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
                data: null,
            })
        }
    },
}