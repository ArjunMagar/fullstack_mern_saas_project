import { Response } from 'express'
import { IExtendedRequest } from '../../../middleware/type'
import sequelize from '../../../database/connection'
import { QueryTypes } from 'sequelize'



class CategoryController {

    async createCategory(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const { categoryName, categoryDescription } = req.body
        if (!categoryName || !categoryDescription) {
            res.status(400).json({
                message: "Please provide categoryName, categoryDescription"
            })
        }
        await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,categoryDescription)VALUES(?,?)`, {
            replacements: [categoryName, categoryDescription]
        })
        res.status(200).json({
            message: "Category added successfully",

        })
    }

    async getCategories(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const categories = await sequelize.query(`SELECT * FROM category_${instituteNumber}`, {
            type: QueryTypes.SELECT
        })

        res.status(200).json({
            message: "Categories fetched successfully",
            data: categories
        })
    }

    async deleteCategory(req: IExtendedRequest, res: Response) {
        const instituteNumber = req.user?.currentInstituteNumber
        const id = req.params.id
        await sequelize.query(`DELETE FROM category_${instituteNumber} WHERE id = ?`, {
            replacements: [id]
        })
        res.status(200).json({
            message: "category deleted successfully"
        })
    }

}

export default new CategoryController