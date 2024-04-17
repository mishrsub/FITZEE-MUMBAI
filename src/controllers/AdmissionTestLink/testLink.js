import path from "path";
import { AdmissionLink } from "../../model/AdmissionTestLink/testLink.js";

class AdmissionTest {
    // Add a new menu
    addMenu = async (req, res) => {
        try {
            const { title } = req.body;

            // Create a new menu instance
            const newMenu = new AdmissionLink({ title });
            await newMenu.save();

            return res.status(201).json({
                status: 201,
                message: "Admission Link menu created successfully",
                menu: newMenu,
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    // Add a new submenu to a menu
    addSubMenu = async (req, res) => {
        try {
            const { title, link } = req.body;
            const menuId = req.params.menuId;

            // Find the menu by ID
            const menu = await AdmissionLink.findById(menuId);

            if (!menu) {
                return res
                    .status(404)
                    .json({ status: 404, error: "AdmissionLink not found" });
            }

            const reqData = {
                title,
                link,
            };

            // Create the new submenu
            const newSubMenu = reqData;
            menu.subMenus.push(newSubMenu);
            await menu.save();

            return res.status(201).json({
                status: 201,
                message: "Submenu added successfully",
                submenu: newSubMenu,
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    // Edit an existing menu
    editMenu = async (req, res) => {
        try {
            const { title } = req.body;

            // Find and update the menu by ID
            const updatedMenu = await AdmissionLink.findByIdAndUpdate(
                req.params.menuId,
                { title },
                { new: true }
            );

            if (!updatedMenu) {
                return res
                    .status(404)
                    .json({ error: "AdmissionLink not found" });
            }

            return res.status(200).json({
                message: "Admission Link menu updated successfully",
                menu: updatedMenu,
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    // Delete an existing menu
    deleteMenu = async (req, res) => {
        try {
            const menuId = req.params.menuId;

            const deletedMenu = await AdmissionLink.findByIdAndDelete(menuId);

            if (!deletedMenu) {
                return res
                    .status(404)
                    .json({ error: "AdmissionLink not found" });
            }

            return res.status(200).json({
                status: 200,
                message: "AdmissionLink deleted successfully",
                menu: deletedMenu,
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    // Edit an existing submenu
    editSubMenu = async (req, res) => {
        try {
            const { title, link } = req.body;
            const menuId = req.params.menuId;
            const id = req.params.id;

            // Find the menu by ID
            const menu = await AdmissionLink.findById(menuId);

            if (!menu) {
                return res
                    .status(404)
                    .json({ status: 404, error: "AdmissionLink not found" });
            }

            //delete existing file
            const fileIndex = menu.subMenus.findIndex(
                (val, i) => val._id.toString() === id
            );

            if (fileIndex === -1) {
                return res
                    .status(404)
                    .json({ status: 404, error: "Submenu not found" });
            }

            // Update data for the submenu
            const updateData = {};
            if (title) {
                updateData["subMenus.$.title"] = title;
            }
            if (link) {
                updateData["subMenus.$.link"] = link;
            }

            const submenu = await AdmissionLink.findOneAndUpdate(
                { _id: menuId, "subMenus._id": id },
                {
                    $set: updateData, // Pass updateData directly
                },
                { new: true }
            );

            if (!submenu) {
                return res
                    .status(404)
                    .json({ status: 404, error: "Submenu not found" });
            }

            return res.status(200).json({
                status: 200,
                message: "Submenu updated successfully",
                submenu,
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    // Delete an existing submenu from a menu
    deleteSubMenu = async (req, res) => {
        try {
            const menuId = req.params.menuId;
            const subMenuId = req.params.id;

            // Find the menu by ID
            const menu = await AdmissionLink.findById(menuId);
            if (!menu) {
                return res
                    .status(404)
                    .json({ error: "AdmissionLink not found" });
            }

            //delete existing file
            const fileIndex = menu.subMenus.findIndex(
                (val, i) => val._id.toString() === subMenuId
            );

            if (fileIndex === -1) {
                return res
                    .status(404)
                    .json({ status: 404, error: "Submenu not found" });
            }

            // Filter out the submenu with the specified subMenuId
            menu.subMenus = menu.subMenus.filter(
                (submenu) => submenu._id.toString() !== subMenuId
            );

            // Save the updated menu
            await menu.save();

            return res.status(200).json({
                status: 200,
                message: "Submenu deleted successfully",
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    getAdmissionTestMenus = async (req, res) => {
        try {
            const getAllData = await AdmissionLink.find({});

            return res.status(200).json({
                status: 200,
                menusLink: getAllData,
            });
        } catch (error) {
            return res.status(400).json({ status: 400, error: error.message });
        }
    };
}

const admissionTest = new AdmissionTest();
export { admissionTest };
