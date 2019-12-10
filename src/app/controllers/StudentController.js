import Op from 'sequelize/lib/operators';

import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const Schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .required()
        .min(1)
        .integer(),
      height: Yup.number()
        .required()
        .min(1),
      weight: Yup.number()
        .required()
        .min(1),
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const studentExixt = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExixt) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, height, weight });
  }

  async update(req, res) {
    const Schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .min(1)
        .integer(),
      height: Yup.number().min(1),
      weight: Yup.number().min(1),
    });

    if (!(await Schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'User not found' });
    }

    const studentExixt = await Student.findOne({
      where: { id: { [Op.ne]: student.id }, email: req.body.email },
    });

    if (studentExixt) {
      return res.status(400).json({ error: 'e-mail already exists' });
    }

    const { id, name, email, age, height, weight } = await student.update(
      req.body
    );

    return res.json({ id, name, email, age, height, weight });
  }
}

export default new StudentController();
