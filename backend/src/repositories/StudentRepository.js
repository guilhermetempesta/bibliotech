const Student = require('../models/Student');
const Loan = require('../models/Loan');
const { MethodNotAllowedError, NotFoundError } = require('../utils/errors');

class StudentRepository {

    async create(data) {
        try {   
            const student = await Student.create(data);   
            return student;     
        } catch(err) {
            throw err
        }
    }

    async update(data) {
        try {
            await Student.update(data,{   
                    where: {id: data.id}
                }
            );
        } catch(err) {
            throw err
        }
    }

    async get() {
        try {
            const students = await Student.findAll({
                attributes: ['id', 'name', 'phone', 'class'],
                order: ['id']
            })
            return students
        } catch (err) {
            throw err
        }
    }

    async getById(id) {
        try {
            const student = await Student.findOne({ 
                attributes: ['id', 'name', 'phone', 'class', 'comments'],
                where: {id: id} 
            })
            return student;
        } catch (err) {
            throw err
        }
    }

    async count() {
        try {
            const count = await Student.count();
            return count;
        } catch (err) {
            throw err
        }
    }

    async remove(id) {
        try { 
            const loans = await Loan.count({
                where: { studentId: id }
            })
            if (loans) throw new MethodNotAllowedError('Este aluno possui vínculos.');

            const rowsDeleted = await Student.destroy({
                where: {id: id} 
            });
            if (rowsDeleted===0) throw new NotFoundError('Aluno não encontrado!'); 
        } catch (err) {
            throw err
        }
    }
}

module.exports = { StudentRepository }