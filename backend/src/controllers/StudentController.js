const { StudentRepository } = require('../repositories/StudentRepository');
const { NotFoundError } = require('../utils/errors');

class StudentController {

    async store (req, res, next) {
        try {
            const student = req.body;
            const studentRepository = new StudentRepository;
            await studentRepository.create(student);
            res.status(201).send();
        } catch (error) {
            next(error); 
        } 
    }

    async update (req, res, next) {        
        try {
            const student = req.body;
            student.id = req.params.id;
            const studentRepository = new StudentRepository;
            await studentRepository.update(student);
            res.status(200).json({ message: "Informações atualizadas com sucesso." });
        } catch (error) {
            next(error); 
        } 
    }

    async index (req, res, next) {
        try {                        
            const query = req.query;
            const studentRepository = new StudentRepository;
            const authors = await studentRepository.get(query); 
            res.status(200).json(authors);    
        } catch (error) {
            next(error); 
        }
    }   

    async show (req, res, next) {
        try {                        
            const id = req.params.id;
            const studentRepository = new StudentRepository;
            const student = await studentRepository.getById(id); 
            if (!student) {
                throw new NotFoundError('Aluno não encontrado!');
            }
            res.status(200).json(student);    
        } catch (error) {
            next(error); 
        }
    }
    
    async destroy (req, res, next) {
        try {                        
            const id = req.params.id;   
            const studentRepository = new StudentRepository;
            await studentRepository.remove(id);
            res.status(200).json({ message: "Aluno excluído com sucesso." });
        } catch (error) {
            next(error); 
        }
    }     
}

module.exports = { StudentController }
